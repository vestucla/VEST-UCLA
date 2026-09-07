/**
 * Generates the two pieces of sky artwork used by the homepage hero and the
 * site footer.
 *
 * The Figma frame calls for a photographic sky behind the hero and "dithered
 * clouds" behind the footer. The display face (TOF Bit Apple) is a bitmap
 * serif, so both are rendered here as true 1-bit ordered-dither (Bayer 8x8)
 * cloudscapes: two colours only, which keeps the PNGs at a few KB and makes
 * the texture read as deliberate pixel art rather than a compression artefact.
 *
 * Run with:  node scripts/generate-sky.mjs
 * Output:    public/images/hero-sky.png, public/images/footer-clouds.png
 */
import { mkdirSync, statSync } from "node:fs";
import sharp from "sharp";

const BLUE = [0x00, 0x59, 0xff]; // --color-blue
const WHITE = [0xff, 0xff, 0xff];
const CELL = 2; // dither cell size in output pixels

// 8x8 Bayer matrix, normalised to 0..1 thresholds.
const BAYER = [
  [0, 32, 8, 40, 2, 34, 10, 42],
  [48, 16, 56, 24, 50, 18, 58, 26],
  [12, 44, 4, 36, 14, 46, 6, 38],
  [60, 28, 52, 20, 62, 30, 54, 22],
  [3, 35, 11, 43, 1, 33, 9, 41],
  [51, 19, 59, 27, 49, 17, 57, 25],
  [15, 47, 7, 39, 13, 45, 5, 37],
  [63, 31, 55, 23, 61, 29, 53, 21],
].map((row) => row.map((v) => (v + 0.5) / 64));

/** Deterministic hash-based value noise, bilinearly interpolated. */
function makeNoise(seed) {
  const hash = (x, y) => {
    let h = x * 374761393 + y * 668265263 + seed * 2246822519;
    h = (h ^ (h >>> 13)) * 1274126177;
    return ((h ^ (h >>> 16)) >>> 0) / 4294967295;
  };
  const fade = (t) => t * t * (3 - 2 * t);
  return (x, y) => {
    const xi = Math.floor(x);
    const yi = Math.floor(y);
    const tx = fade(x - xi);
    const ty = fade(y - yi);
    const a = hash(xi, yi) + (hash(xi + 1, yi) - hash(xi, yi)) * tx;
    const b = hash(xi, yi + 1) + (hash(xi + 1, yi + 1) - hash(xi, yi + 1)) * tx;
    return a + (b - a) * ty;
  };
}

/** Fractal Brownian motion over the value noise, 5 octaves. */
function makeFbm(seed) {
  const noise = makeNoise(seed);
  return (x, y) => {
    let value = 0;
    let amplitude = 0.5;
    let frequency = 1;
    for (let o = 0; o < 5; o++) {
      value += noise(x * frequency, y * frequency) * amplitude;
      amplitude *= 0.5;
      frequency *= 2.07;
    }
    return value;
  };
}

const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v);
const smoothstep = (edge0, edge1, x) => {
  const t = clamp01((x - edge0) / (edge1 - edge0));
  return t * t * (3 - 2 * t);
};

/**
 * Renders a dithered field. `density(u, v)` returns 0..1 cloud coverage in
 * normalised coordinates; 1 = solid white, 0 = solid blue.
 */
async function render({ file, width, height, density }) {
  const w = Math.round(width / CELL);
  const h = Math.round(height / CELL);
  const raw = Buffer.alloc(w * h * 3);

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const value = clamp01(density(x / w, y / h));
      const on = value > BAYER[y & 7][x & 7];
      const [r, g, b] = on ? WHITE : BLUE;
      const i = (y * w + x) * 3;
      raw[i] = r;
      raw[i + 1] = g;
      raw[i + 2] = b;
    }
  }

  await sharp(raw, { raw: { width: w, height: h, channels: 3 } })
    .resize({ width, height, kernel: "nearest" })
    .png({ palette: true, colours: 2, compressionLevel: 9, effort: 10 })
    .toFile(file);

  console.log(`${file}  ${width}x${height}  ${(statSync(file).size / 1024).toFixed(1)} KB`);
}

mkdirSync("public/images", { recursive: true });

// ---------------------------------------------------------------------------
// Hero: deep blue sky up top, a cloud deck massing toward the bottom — the
// view from above the weather. The left third is held clear so the white
// Bit Apple headline keeps full contrast against solid blue.
// ---------------------------------------------------------------------------
const heroFbm = makeFbm(7);
await render({
  file: "public/images/hero-sky.png",
  width: 2560,
  height: 1200,
  density: (u, v) => {
    const clouds = heroFbm(u * 5.5, v * 5.5);
    // Cloud deck: nothing above the midline, thickening to full coverage low
    // down. The deck edge is warped by the noise itself so the horizon reads
    // as a ragged cloud line rather than a straight seam.
    const deck = smoothstep(0.3, 1.05, v + (clouds - 0.5) * 0.55);
    // A softer band of high cirrus in the top right.
    const cirrus = smoothstep(0.35, 0.9, u) * (1 - smoothstep(0.05, 0.4, v)) * 0.5;
    // Keep the headline column clear.
    const textGuard = 1 - 0.75 * (1 - smoothstep(0.42, 0.62, u)) * (1 - smoothstep(0.62, 0.9, v));
    return (clouds * 1.9 - 0.55) * (deck + cirrus) * textGuard;
  },
});

// ---------------------------------------------------------------------------
// Footer: the same sky inverted — clouds break along the top edge so the
// section reads as flying up out of the deck, then settle into solid blue
// behind the footer content.
// ---------------------------------------------------------------------------
const footerFbm = makeFbm(23);
await render({
  file: "public/images/footer-clouds.png",
  width: 2560,
  height: 760,
  density: (u, v) => {
    const clouds = footerFbm(u * 6, v * 3.2);
    const breakUp = 1 - smoothstep(-0.15, 0.6, v + (clouds - 0.5) * 0.5);
    return (clouds * 2.1 - 0.6) * breakUp + (1 - smoothstep(0, 0.07, v)) * 0.5;
  },
});

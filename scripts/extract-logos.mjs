/**
 * One-off asset script: slices the two legacy logo composites into individual
 * transparent PNGs recoloured to brand navy (--color-black, #10103d) for the
 * light 2026 theme.
 *
 * The source composites were white-on-transparent (built for the old dark
 * theme) and are no longer in the working tree, so they are read straight out
 * of git history:
 *
 *   public/images/Logo-Banner-white.png          -> 6 "Trusted by" partner logos
 *   public/images/VEST-Companies-White-091725.png -> 27 "Working at" company logos
 *
 * Run with:  node scripts/extract-logos.mjs
 * Output:    public/images/logos/*.png
 *
 * Replace individual files with real vector exports whenever they become
 * available — `src/data/logos.ts` is the single place that lists them.
 */
import { execFileSync } from "node:child_process";
import { mkdirSync, statSync } from "node:fs";
import sharp from "sharp";

const OUT_DIR = "public/images/logos";
const GIT_REF = "98d69ca"; // last commit before the redesign removed the composites
const NAVY = [0x10, 0x10, 0x3d];

/** Reads a blob out of git history into a temp buffer. */
function fromGit(path) {
  return execFileSync("git", ["show", `${GIT_REF}:${path}`], {
    maxBuffer: 64 * 1024 * 1024,
    encoding: "buffer",
  });
}

/** Recolours a white-on-transparent crop to navy, preserving the alpha mask. */
async function recolor(buffer, box) {
  const { data, info } = await sharp(buffer)
    .extract(box)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const px = info.width * info.height;
  const out = Buffer.alloc(px * 4);
  for (let p = 0; p < px; p++) {
    out[p * 4] = NAVY[0];
    out[p * 4 + 1] = NAVY[1];
    out[p * 4 + 2] = NAVY[2];
    out[p * 4 + 3] = data[p * info.channels + 3];
  }
  return sharp(out, { raw: { width: info.width, height: info.height, channels: 4 } })
    .trim({ threshold: 1 })
    .png()
    .toBuffer();
}

async function write(buffer, box, name, maxHeight) {
  const recoloured = await recolor(buffer, box);
  const file = `${OUT_DIR}/${name}.png`;
  await sharp(recoloured)
    .resize({ height: maxHeight, width: maxHeight * 6, fit: "inside", kernel: "lanczos3" })
    .png({ compressionLevel: 9, effort: 10 })
    .toFile(file);
  const { width, height } = await sharp(file).metadata();
  const { size } = statSync(file);
  console.log(`${name.padEnd(18)} ${width}x${height}  ${(size / 1024).toFixed(1)} KB`);
}

// ---------------------------------------------------------------------------
// "Trusted by" strip — single row, segmented by column projection.
// ---------------------------------------------------------------------------
const PARTNERS = [
  ["oligo", 0, 317],
  ["a16z", 440, 686],
  ["windsurf", 824, 1412],
  ["ycombinator", 1565, 1969],
  ["8vc", 2115, 2351],
  ["manus", 2482, 2930],
];

// ---------------------------------------------------------------------------
// "Working at" grid — boxes found by connected-component labelling on the
// alpha channel (blur 4 at 1/4 scale, 8-connected), then hand-corrected:
//   * cursor / browserbase were one component -> split on the row gutter
//   * mercor's mark and wordmark were two components -> merged
//   * one unidentified palm-tree mark was dropped (no name = no alt text)
// ---------------------------------------------------------------------------
const COMPANIES = [
  ["apple", { left: 56, top: 16, width: 260, height: 304 }],
  ["google", { left: 428, top: 52, width: 604, height: 248 }],
  ["capital-one", { left: 1740, top: 56, width: 580, height: 260 }],
  ["meta", { left: 1100, top: 80, width: 600, height: 180 }],
  ["caterpillar", { left: 2392, top: 76, width: 424, height: 264 }],
  ["tesla", { left: 76, top: 360, width: 284, height: 344 }],
  ["paramount", { left: 424, top: 332, width: 448, height: 368 }],
  ["snap", { left: 912, top: 304, width: 328, height: 332 }],
  ["blackrock", { left: 1248, top: 304, width: 752, height: 176 }],
  ["amazon", { left: 2108, top: 368, width: 592, height: 232 }],
  ["northrop-grumman", { left: 1376, top: 516, width: 716, height: 216 }],
  ["harvey", { left: 2260, top: 588, width: 568, height: 224 }],
  ["cursor", { left: 180, top: 716, width: 764, height: 200 }],
  ["browserbase", { left: 20, top: 940, width: 812, height: 228 }],
  ["nvidia", { left: 1416, top: 736, width: 708, height: 196 }],
  ["leidos", { left: 2148, top: 792, width: 672, height: 220 }],
  ["vercel", { left: 908, top: 932, width: 688, height: 216 }],
  ["stripe", { left: 1700, top: 940, width: 432, height: 220 }],
  ["polymarket", { left: 2152, top: 1016, width: 696, height: 208 }],
  ["etched", { left: 144, top: 1192, width: 636, height: 192 }],
  ["deloitte", { left: 828, top: 1168, width: 660, height: 188 }],
  ["coinbase", { left: 1500, top: 1168, width: 648, height: 184 }],
  ["scale-ai", { left: 2340, top: 1200, width: 456, height: 196 }],
  ["safetykit", { left: 1560, top: 1376, width: 628, height: 188 }],
  ["mercor", { left: 52, top: 1412, width: 712, height: 208 }],
  ["anduril", { left: 776, top: 1388, width: 764, height: 204 }],
  ["optiver", { left: 2232, top: 1404, width: 620, height: 204 }],
];

mkdirSync(OUT_DIR, { recursive: true });

const banner = fromGit("public/images/Logo-Banner-white.png");
console.log("— Trusted by —");
for (const [name, x0, x1] of PARTNERS) {
  await write(banner, { left: x0, top: 0, width: x1 - x0 + 1, height: 125 }, name, 96);
}

const grid = fromGit("public/images/VEST-Companies-White-091725.png");
console.log("\n— Working at —");
for (const [name, box] of COMPANIES) {
  await write(grid, box, name, 120);
}

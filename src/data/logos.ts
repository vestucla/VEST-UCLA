export interface Logo {
  /** Company / fund name — also the image alt text. */
  name: string;
  src: string;
  /** Size the design draws this logo at, in px. */
  width: number;
  height: number;
}

/**
 * The "Trusted by" marquee, in the order the design lays it out. Every mark is
 * an SVG exported from the design file with the navy 80% fill already baked in,
 * so the row needs no per-logo colour handling.
 */
export const partnerLogos: Logo[] = [
  {
    name: "Y Combinator",
    src: "/images/logos/partners/ycombinator.svg",
    width: 289,
    height: 60,
  },
  {
    name: "Manus",
    src: "/images/logos/partners/manus.svg",
    width: 217,
    height: 60,
  },
  {
    name: "8VC",
    src: "/images/logos/partners/8vc.svg",
    width: 152,
    height: 60,
  },
  {
    name: "Oligo Space",
    src: "/images/logos/partners/oligo-space.svg",
    width: 153,
    height: 60,
  },
  {
    name: "Cognition",
    src: "/images/logos/partners/cognition.svg",
    width: 278,
    height: 60,
  },
  {
    name: "a16z",
    src: "/images/logos/partners/a16z.svg",
    width: 129,
    height: 60,
  },
  {
    name: "Rainfall",
    src: "/images/logos/partners/rainfall.svg",
    width: 153,
    height: 60,
  },
  {
    name: "Pareto",
    src: "/images/logos/partners/pareto.svg",
    width: 335,
    height: 48,
  },
];

export interface CompanyLogo extends Logo {
  /** Zero-indexed slot in the design's 7-column × 6-row grid. */
  col: number;
  row: number;
}

/**
 * Where members have gone on to work. The design hand-places these on a strict
 * 7×6 grid (≈166px × ≈105px pitch) inside a 1142px block, at wildly different
 * intrinsic sizes — a wordmark earns its presence from width, a square mark
 * from height, so a single shared row height would make the square marks read
 * as tiny. `width`/`height` are therefore per-logo, straight from the design.
 *
 * The row/col are kept so desktop can reproduce the exact arrangement,
 * including the four empty slots the design leaves. Narrow screens ignore them
 * and let the logos flow.
 */
export const companyLogos: CompanyLogo[] = [
  {
    name: "OpenAI",
    src: "/images/logos/companies/openai.png",
    width: 134,
    height: 36,
    col: 0,
    row: 0,
  },
  {
    name: "Apple",
    src: "/images/logos/companies/apple.png",
    width: 56,
    height: 69,
    col: 1,
    row: 0,
  },
  {
    name: "Google",
    src: "/images/logos/companies/google.png",
    width: 133,
    height: 41,
    col: 2,
    row: 0,
  },
  {
    name: "Snapchat",
    src: "/images/logos/companies/snapchat.png",
    width: 78,
    height: 78,
    col: 3,
    row: 0,
  },
  {
    name: "Meta",
    src: "/images/logos/companies/meta.png",
    width: 134,
    height: 76,
    col: 4,
    row: 0,
  },
  {
    name: "Amazon",
    src: "/images/logos/companies/amazon.png",
    width: 134,
    height: 41,
    col: 5,
    row: 0,
  },
  {
    name: "NASA",
    src: "/images/logos/companies/nasa.png",
    width: 95,
    height: 76,
    col: 6,
    row: 0,
  },

  {
    name: "Tesla",
    src: "/images/logos/companies/tesla.png",
    width: 78,
    height: 78,
    col: 0,
    row: 1,
  },
  {
    name: "Cursor",
    src: "/images/logos/companies/cursor.png",
    width: 134,
    height: 33,
    col: 1,
    row: 1,
  },
  {
    name: "xAI",
    src: "/images/logos/companies/xai.png",
    width: 108,
    height: 61,
    col: 2,
    row: 1,
  },
  {
    name: "Vercel",
    src: "/images/logos/companies/vercel.png",
    width: 135,
    height: 76,
    col: 3,
    row: 1,
  },
  {
    name: "Stripe",
    src: "/images/logos/companies/stripe.png",
    width: 119,
    height: 50,
    col: 4,
    row: 1,
  },
  {
    name: "NVIDIA",
    src: "/images/logos/companies/nvidia.png",
    width: 99,
    height: 73,
    col: 5,
    row: 1,
  },
  {
    name: "Capital One",
    src: "/images/logos/companies/capital-one.png",
    width: 129,
    height: 46,
    col: 6,
    row: 1,
  },

  {
    name: "Ramp",
    src: "/images/logos/companies/ramp.png",
    width: 146,
    height: 66,
    col: 0,
    row: 2,
  },
  // TODO(vest): confirm this company's name — the design ships only the icon.
  {
    name: "Palm",
    src: "/images/logos/companies/palm.png",
    width: 71,
    height: 71,
    col: 1,
    row: 2,
  },
  {
    name: "Browserbase",
    src: "/images/logos/companies/browserbase.png",
    width: 130,
    height: 26,
    col: 2,
    row: 2,
  },
  {
    name: "Coinbase",
    src: "/images/logos/companies/coinbase.png",
    width: 136,
    height: 24,
    col: 3,
    row: 2,
  },
  {
    name: "VISA",
    src: "/images/logos/companies/visa.png",
    width: 117,
    height: 38,
    col: 4,
    row: 2,
  },
  {
    name: "Paramount",
    src: "/images/logos/companies/paramount.png",
    width: 94,
    height: 74,
    col: 6,
    row: 2,
  },

  {
    name: "AWS",
    src: "/images/logos/companies/aws.png",
    width: 85,
    height: 51,
    col: 0,
    row: 3,
  },
  {
    name: "DeepMind",
    src: "/images/logos/companies/deepmind.png",
    width: 132,
    height: 31,
    col: 1,
    row: 3,
  },
  {
    name: "Wells Fargo",
    src: "/images/logos/companies/wells-fargo.png",
    width: 115,
    height: 65,
    col: 2,
    row: 3,
  },
  {
    name: "Harvey",
    src: "/images/logos/companies/harvey.png",
    width: 135,
    height: 41,
    col: 3,
    row: 3,
  },
  {
    name: "Cerebras",
    src: "/images/logos/companies/cerebras.png",
    width: 131,
    height: 58,
    col: 4,
    row: 3,
  },
  {
    name: "Netic",
    src: "/images/logos/companies/netic.png",
    width: 133,
    height: 38,
    col: 5,
    row: 3,
  },

  {
    name: "Whatnot",
    src: "/images/logos/companies/whatnot.png",
    width: 136,
    height: 26,
    col: 0,
    row: 4,
  },
  {
    name: "Archil",
    src: "/images/logos/companies/archil.png",
    width: 134,
    height: 48,
    col: 1,
    row: 4,
  },
  {
    name: "Mercor",
    src: "/images/logos/companies/mercor.png",
    width: 143,
    height: 40,
    col: 2,
    row: 4,
  },
  {
    name: "Optiver",
    src: "/images/logos/companies/optiver.png",
    width: 134,
    height: 30,
    col: 3,
    row: 4,
  },
  {
    name: "Deloitte",
    src: "/images/logos/companies/deloitte.png",
    width: 132,
    height: 25,
    col: 4,
    row: 4,
  },
  {
    name: "Jane Street",
    src: "/images/logos/companies/jane-street.png",
    width: 135,
    height: 53,
    col: 5,
    row: 4,
  },
  {
    name: "Anduril",
    src: "/images/logos/companies/anduril.png",
    width: 134,
    height: 25,
    col: 6,
    row: 4,
  },

  {
    name: "Y Combinator",
    src: "/images/logos/companies/ycombinator.png",
    width: 66,
    height: 66,
    col: 0,
    row: 5,
  },
  {
    name: "Dorm Room Fund",
    src: "/images/logos/companies/dormroomfund.png",
    width: 190,
    height: 53,
    col: 1,
    row: 5,
  },
  {
    name: "Prod",
    src: "/images/logos/companies/prod.png",
    width: 124,
    height: 46,
    col: 3,
    row: 5,
  },
  {
    name: "NEA",
    src: "/images/logos/companies/nea.png",
    width: 123,
    height: 47,
    col: 5,
    row: 5,
  },
  {
    name: "BlackRock",
    src: "/images/logos/companies/blackrock.png",
    width: 141,
    height: 79,
    col: 6,
    row: 5,
  },
];

/** The design's grid, used to place logos and to size the block's rows. */
export const COMPANY_GRID = { cols: 7, rows: 6 } as const;

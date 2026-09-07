# VEST Website v2

Built with Next.js 15 (App Router), React 19, and Tailwind CSS v4.

Use `pnpm` as the package manager (10.14.0).

## Design system

Everything lives in `src/app/globals.css` — there is no `tailwind.config.ts`.

- **Tokens** (`@theme`): colours (`blue`, `haze`, `black`, `mint`, plus fixed alpha steps like
  `black-80`), fluid display sizes (`text-display-lg` / `-display` / `-display-sm`), easings
  (`ease-out-quart`, `ease-out-expo`, `ease-in-out-cubic`), durations (`--dur-fast|base|slow`),
  radii (`rounded-card` 12px, `rounded-btn` 8px).
- **Fonts**: Rethink Sans (`font-sans`) via `next/font/google`; TOF Bit Apple (`font-display`) as a
  local woff2 in `public/fonts/`. next/font injects `--font-rethink` / `--font-bit-apple`, which the
  `@theme` block aliases — don't point a next/font `variable` at `--font-sans` directly or the
  custom property becomes self-referential.
- **Component classes**: `.container-content` (1200px), `.section`, `.section-header`, `.card`,
  `.card-interactive`, `.btn` + `.btn-primary|inverse|ghost`, `.chip`, `.input`, `.highlight`
  (mint marker), `.eyebrow`, `.meta`, `.prose`, `.footer-sky`, `.footer-link`, `.fade-up`.
- **Motion**: CSS transitions only, plus `motion` for the hero parallax. Hover states are wrapped in
  `@media (hover: hover) and (pointer: fine)`; everything transform-based is disabled under
  `prefers-reduced-motion`. No scroll library, no scroll snapping, no programmatic scrolling.

## Where to change content

| What | File |
| --- | --- |
| Social / newsletter / Discord links, applications flag | `src/data/site.ts` |
| Events (homepage row, `/events`, `/events/[slug]`) | `src/data/events.ts` |
| "Trusted by" and "Working at" logos | `src/data/logos.ts` |
| Nav and footer links | `src/components/layout/Nav.tsx`, `Footer.tsx` |

Set `siteConfig.applicationsOpen = false` to hide the apply calls to action.

## Generated artwork

These scripts produce checked-in assets. Re-run them only if the source changes.

- `node scripts/extract-logos.mjs` — slices the two legacy white-on-transparent logo composites out
  of git history into individual navy PNGs in `public/images/logos/`. Drop in real vector exports
  whenever they are available; `src/data/logos.ts` is the only place that lists them.
- `node scripts/generate-sky.mjs` — renders the hero sky and footer clouds as true 1-bit
  ordered-dither (Bayer 8×8) cloudscapes. Two colours each, so both PNGs are under 10 KB and scale
  without looking like compression noise.
- `node scripts/optimize-images.mjs` — converts the photography in `public/images/` to WebP.

Both dithered PNGs are rendered with `unoptimized` on `next/image`: re-encoding a 2-colour dither as
lossy WebP smears the pattern and lands larger than the original.

## Member Portal

Routes (under `src/app/members/`):

- `/members` — searchable directory of the current class
- `/members/[slug]` — individual member profile
- `/members/alumni` — alumni directory
- `/members/login` — gated sign-in with Google Authentication
- `/members/onboarding` — profile setup
- `/members/edit/[slug]` — profile editing
- `/members/admin` — admin dashboard
- `/members/accolades` — links back to main VEST site sections

Key files:

- `src/lib/auth.tsx` — Firebase Google Auth Provider
- `src/lib/orm/members.ts` — Data layer using Firebase Firestore (`MembersOrm`)
- `src/components/Members/*` — `MemberCard`, `MemberDirectory`, `MemberProfile`, `PortalShell`
- `src/components/ui/*` — Shared primitives (`Button`, `Card`, `FadeIn`, `Forms`, `PageHeader`, `VestMark`)
- `src/components/home/*`, `src/components/events/EventCard.tsx` — homepage sections and the shared event card

### Branch / PR rules

Per the team workflow: **no direct commits to `master`**. Work on a feature branch (e.g. `aw/2026-redesign`) and open a PR.

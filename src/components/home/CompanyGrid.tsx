import { COMPANY_GRID, companyLogos } from "@/data/logos";

/**
 * The "Working at the best companies in tech" block.
 *
 * The design hand-places 42 logos on a strict 7-column grid at a ~166 × ~105px
 * pitch, so this is a real CSS grid with each logo pinned to its own slot —
 * that reproduces the arrangement exactly at desktop width, while still being
 * able to reflow.
 *
 * Below the desktop breakpoint the explicit placement is dropped and the grid
 * steps down to 5 then 4 columns, because holding seven on a phone would
 * render every mark ~40px wide.
 */
export function CompanyGrid() {
  return (
    <ul
      aria-label="Companies VEST members have worked at"
      className="company-grid"
      style={{ "--cols": COMPANY_GRID.cols } as React.CSSProperties}
    >
      {companyLogos.map((logo) => (
        <li
          key={`${logo.name}-${logo.row}-${logo.col}`}
          className="flex items-center justify-center"
          // 1-indexed because CSS grid lines start at 1.
          style={
            {
              "--col": logo.col + 1,
              "--row": logo.row + 1,
            } as React.CSSProperties
          }
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={logo.src}
            alt={logo.name}
            width={logo.width}
            height={logo.height}
            loading="lazy"
            decoding="async"
            // Handed to CSS unitless rather than set as an inline width/height,
            // so the stylesheet can scale the whole set down per breakpoint and
            // — via `aspect-ratio` — a mark too wide for its column loses
            // height with it instead of being squashed.
            style={
              {
                "--logo-w": logo.width,
                "--logo-h": logo.height,
              } as React.CSSProperties
            }
          />
        </li>
      ))}
    </ul>
  );
}

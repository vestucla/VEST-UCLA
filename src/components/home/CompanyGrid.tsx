import { COMPANY_GRID, companyLogos } from "@/data/logos";

/**
 * The "Working at the best companies in tech" block.
 *
 * The design hand-places 38 logos on a strict 7-column grid at a ~166 × ~105px
 * pitch, so this is a real CSS grid with each logo pinned to its own slot —
 * that reproduces the arrangement exactly at desktop width, including the four
 * slots the design leaves empty, while still being able to reflow.
 *
 * Below the desktop breakpoint the explicit placement is dropped and the logos
 * simply flow, because holding 7 columns on a phone would render every mark at
 * ~40px wide.
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
            // The design's own drawn size, capped so a mark wider than its
            // column never pushes the grid open.
            style={{ width: logo.width, height: logo.height }}
            className="h-auto max-w-full object-contain"
          />
        </li>
      ))}
    </ul>
  );
}

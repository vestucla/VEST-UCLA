import type { Logo } from "@/data/logos";

/**
 * Renders a set of logos at a shared optical height. Each cell is a fixed
 * height so the row never reflows while the images decode.
 */
export function LogoWall({
  logos,
  height,
  className,
}: {
  logos: Logo[];
  /** Rendered logo height in px — cells are sized to 2x this. */
  height: number;
  className?: string;
}) {
  return (
    // `w-full` keeps the wrapping row measured against the container. Without
    // it, an `items-center` column parent sizes this list to max-content and
    // the logos stop wrapping.
    <ul className={`w-full ${className ?? ""}`}>
      {logos.map((logo) => (
        <li
          key={logo.name}
          className="flex items-center justify-center"
          style={{ height: height * 2 }}
        >
          {/* Plain <img>: these are already 2-colour PNGs a few KB each, and
              routing 33 of them through the image optimiser would cost more
              requests than it saves bytes. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={logo.src}
            alt={logo.name}
            width={logo.width}
            height={logo.height}
            loading="lazy"
            decoding="async"
            className="w-auto max-w-full object-contain"
            style={{ height: height * (logo.scale ?? 1) }}
          />
        </li>
      ))}
    </ul>
  );
}

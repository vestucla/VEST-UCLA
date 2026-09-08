import { FadeIn } from "./FadeIn";

export function PageHeader({ title, description }: { title: string; description: string | React.ReactNode }) {
  return (
    // pt clears the fixed nav pill (top-4 + ~36px row + padding) with a
    // little air under it, rather than the desktop's full 8rem drop.
    <section className="section bg-haze pt-24 pb-10 md:pt-32 md:pb-16">
      <div className="container-content">
        <FadeIn className="section-header">
          <h1 className="font-display text-display-lg text-blue">{title}</h1>
          <div className="text-black-80 text-base md:text-lg max-w-[360px] prose self-end">
            {description}
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

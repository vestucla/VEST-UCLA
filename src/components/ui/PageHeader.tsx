import { FadeIn } from "./FadeIn";

export function PageHeader({ title, description }: { title: string; description: string | React.ReactNode }) {
  return (
    <section className="section bg-haze pt-32 pb-16">
      <div className="container-content">
        <FadeIn className="section-header">
          <h1 className="font-display text-display-lg text-blue">{title}</h1>
          <div className="text-black-80 text-lg max-w-[360px] prose self-end">
            {description}
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { siteConfig } from "@/data/site";
import { FadeIn } from "@/components/ui/FadeIn";
import { TechWeekMark } from "./TechWeekMark";

/** LA Tech Week showcase block at the top of /events; `#la-tech-week` is the homepage card's target. */
export function TechWeekSection() {
  const { title, description, demoApplicationUrl, rsvpUrl } = siteConfig.techWeek;

  return (
    <section
      id="la-tech-week"
      aria-labelledby="la-tech-week-heading"
      className="section bg-white"
    >
      <div className="container-content">
        <FadeIn>
          <div className="card bg-haze flex flex-col gap-8 p-6 md:p-10 lg:flex-row lg:items-end lg:justify-between lg:gap-16">
            <div className="flex max-w-[640px] flex-col gap-5">
              <TechWeekMark className="h-10 w-auto self-start text-black" />
              <div className="flex flex-col gap-3">
                <h2
                  id="la-tech-week-heading"
                  className="font-display text-display-sm text-blue"
                >
                  {title}
                </h2>
                <p className="text-black-80 prose text-lg">{description}</p>
              </div>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row lg:shrink-0">
              <a
                href={demoApplicationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
              >
                Apply to demo
                <ArrowUpRight size={16} weight="bold" />
              </a>
              <a
                href={rsvpUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-inverse border-blue-50"
              >
                RSVP
                <ArrowUpRight size={16} weight="bold" />
              </a>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

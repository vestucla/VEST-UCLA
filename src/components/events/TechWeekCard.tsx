import Link from "next/link";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { siteConfig } from "@/data/site";
import { FadeIn } from "@/components/ui/FadeIn";
import { TechWeekMark } from "./TechWeekMark";

/** Homepage teaser for the LA Tech Week showcase; the whole card links to /events. */
export function TechWeekCard() {
  return (
    <section aria-labelledby="techweek-heading" className="bg-white pb-16 md:pb-25">
      <div className="container-content">
        <FadeIn>
          <Link href="/events#la-tech-week" className="group block">
            <article className="card card-interactive flex flex-col gap-6 p-6 md:flex-row md:items-center md:justify-between md:p-8">
              <div className="flex flex-col gap-4">
                <TechWeekMark className="h-8 w-auto self-start text-black" />
                <div className="flex flex-col gap-2">
                  <h2
                    id="techweek-heading"
                    className="font-display text-display-sm text-blue"
                  >
                    {siteConfig.techWeek.title}
                  </h2>
                  <p className="text-black-80 text-lg">
                    Apply to demo your product and RSVP.
                  </p>
                </div>
              </div>
              <span className="btn btn-primary self-start md:self-auto">
                See event details
                <ArrowUpRight size={16} weight="bold" />
              </span>
            </article>
          </Link>
        </FadeIn>
      </div>
    </section>
  );
}

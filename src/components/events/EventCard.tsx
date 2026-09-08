import Image from "next/image";
import Link from "next/link";
import { CardArrow } from "@/components/ui/CardArrow";
import { type Event, formatEventDate } from "@/data/events";

/** Shared by the homepage "Recent events" row and the full /events grid. */
export function EventCard({ event }: { event: Event }) {
  return (
    <Link href={`/events/${event.slug}`} className="group block h-full">
      <article className="card card-interactive flex h-full flex-col">
        <div className="relative aspect-[4/3] overflow-hidden border-b-2 border-black-10 bg-haze">
          <Image
            src={event.imageSrc}
            alt=""
            fill
            sizes="(min-width: 1024px) 380px, (min-width: 768px) 50vw, 100vw"
            className="object-cover"
          />
        </div>
        <div className="flex flex-1 flex-col gap-3 px-4 py-4 md:gap-4 md:px-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex flex-col">
              <h3 className="text-xl leading-tight text-black md:text-2xl mb-2">
                {event.title}
              </h3>
              <p className="text-sm text-black-80">{formatEventDate(event.date)}</p>
            </div>
            {/* Nudged down to sit on the title's first line, not its box. */}
            <CardArrow className="mt-0.5 md:mt-1" />
          </div>
          <p className="line-clamp-3 text-black">{event.description}</p>
        </div>
      </article>
    </Link>
  );
}

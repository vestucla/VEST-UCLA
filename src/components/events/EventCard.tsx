import Image from "next/image";
import Link from "next/link";
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
            className="object-cover transition-transform duration-500 ease-out-quart motion-reduce:transition-none md:group-hover:scale-[1.03]"
          />
        </div>
        <div className="flex flex-1 flex-col gap-2 p-6">
          <p className="meta">{formatEventDate(event.date)}</p>
          <h3 className="text-2xl font-bold leading-tight text-black md:text-[28px]">
            {event.title}
          </h3>
          <p className="mt-1 line-clamp-3 text-black-80">{event.description}</p>
        </div>
      </article>
    </Link>
  );
}

import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "@phosphor-icons/react/dist/ssr";
import { events, formatEventDate } from "@/data/events";

export function generateStaticParams() {
  return events.map((event) => ({
    slug: event.slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const event = events.find((e) => e.slug === slug);
  if (!event) return { title: "Event Not Found" };
  return {
    title: `${event.title} - VEST Events`,
    description: event.description,
  };
}

export default async function EventPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const event = events.find((e) => e.slug === slug);
  
  if (!event) {
    notFound();
  }

  return (
    <article className="pt-32 pb-24 bg-white min-h-screen">
      <div className="container-content max-w-[800px]">
        <Link href="/events" className="inline-flex items-center text-sm font-medium text-black-80 hover:text-blue transition-colors mb-8">
          <ArrowLeft size={16} className="mr-2" />
          Back to Events
        </Link>
        
        <header className="mb-12">
          <p className="meta mb-4">{formatEventDate(event.date)}</p>
          <h1 className="font-display text-display-sm text-black mb-4">{event.title}</h1>
          <p className="text-xl text-black-80 font-medium">{event.subtitle}</p>
        </header>

        <div className="relative w-full aspect-[16/9] bg-haze rounded-card overflow-hidden border-2 border-black-10 mb-12">
          <img src={event.imageSrc} alt={event.title} className="w-full h-full object-cover" />
        </div>

        <div className="prose text-lg text-black-80 max-w-none">
          {event.description}
        </div>
      </div>
    </article>
  );
}

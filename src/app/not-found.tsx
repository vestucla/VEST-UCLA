import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page not found",
};

export default function NotFound() {
  return (
    <section className="section flex min-h-[70vh] items-center bg-haze pt-32">
      <div className="container-content flex flex-col items-start gap-6">
        <p className="eyebrow">404</p>
        <h1 className="font-display text-display text-blue">
          This page has taken flight.
        </h1>
        <p className="max-w-[420px] text-black-80">
          The link may be out of date, or the page may have moved. Try the homepage or head
          straight to what’s coming up.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link href="/" className="btn btn-primary">
            Back home
          </Link>
          <Link href="/events" className="btn btn-inverse border-black-10">
            See events
          </Link>
        </div>
      </div>
    </section>
  );
}

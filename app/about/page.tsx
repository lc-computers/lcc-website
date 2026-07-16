import type { Metadata } from "next";
import Link from "next/link";
import Cta from "@/components/Cta";
import { BUSINESS } from "@/lib/site-data";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Lake Cumberland Computers is a local IT services company in Russell Springs, KY providing managed IT, networking, and computer services across the Lake Cumberland region.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <>
      <section className="mx-auto max-w-6xl px-4 py-16">
        <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
          About {BUSINESS.name}
        </h1>
        <div className="mt-6 max-w-3xl space-y-5 text-lg text-slate-600 dark:text-slate-300">
          <p>
            Lake Cumberland Computers is a local technology company based in Russell Springs,
            Kentucky, serving businesses and families across the Lake Cumberland region. We
            handle the full range of what keeps a modern business running — managed IT,
            networking, cybersecurity, WiFi, security cameras, and phone systems — along with
            honest computer repair for the whole community.
          </p>
          <p>
            Our approach is simple: be the local IT team this region deserves. That means
            answering the phone ourselves, showing up on-site when hands-on work is needed,
            explaining things in plain English, and recommending what’s right for you — not
            what pads an invoice. When something isn’t worth fixing, we say so.
          </p>
          <p>
            We work with the businesses that make this area run — offices, retailers, medical
            practices, farms, manufacturers, marinas, and lake-country operations — and we
            understand the specific challenges of doing business in south-central Kentucky,
            from spotty rural connectivity to covering docks and outbuildings with reliable
            WiFi.
          </p>
          <p>
            You’ll find us at {BUSINESS.street}, {BUSINESS.city}, {BUSINESS.state} {BUSINESS.zip},
            {" "}{BUSINESS.hours}. Or start with a call:{" "}
            <a
              href={BUSINESS.phoneHref}
              className="font-medium text-sky-600 hover:underline dark:text-sky-400"
            >
              {BUSINESS.phone}
            </a>
            .
          </p>
        </div>
        <p className="mt-8">
          <Link
            href="/services"
            className="font-medium text-sky-600 hover:underline dark:text-sky-400"
          >
            See everything we do →
          </Link>
        </p>
      </section>
      <Cta />
    </>
  );
}

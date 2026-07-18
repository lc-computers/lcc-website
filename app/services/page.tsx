import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Wrench, ShieldCheck, Mail, Wifi, PhoneCall, Camera } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { CtaBand } from "@/components/sections/CtaBand";
import { HeroBackdrop } from "@/components/sections/HeroBackdrop";
import { BookingsLink } from "@/components/ui/BookingsLink";
import { businessServices, site } from "@/lib/site";
import { servicePages } from "@/lib/content/services";

export const metadata: Metadata = {
  title: "Business & Government IT Services",
  description:
    "Managed IT, cybersecurity, Microsoft 365, networking, VoIP phones, and security cameras for offices across south-central Kentucky. Free consultations, written quotes.",
  alternates: { canonical: "/services" },
};

const icons = [Wrench, ShieldCheck, Mail, Wifi, PhoneCall, Camera] as const;

export default function ServicesPage() {
  return (
    <>
      <section className="relative isolate overflow-hidden bg-navy-950">
        <HeroBackdrop src="/photos/hero-dashboard.webp" priority />
        <Container className="py-14 sm:py-20">
          <p className="eyebrow-light">Business &amp; Government Services</p>
          <h1 className="mt-3 max-w-3xl font-serif text-4xl font-semibold text-cream-50 sm:text-5xl">
            Everything an office needs to run — from one accountable local team.
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-navy-100">
            We&apos;ve supported the offices of south-central Kentucky since {site.foundedYear}:
            county and city government, medical practices, and small businesses. No pushy sales
            process — a free consultation, a written quote, and work that speaks for itself.
          </p>
        </Container>
      </section>

      <section className="py-16 sm:py-20">
        <Container>
          <div className="grid gap-5 md:grid-cols-2">
            {businessServices.map((service, i) => {
              const Icon = icons[i] ?? Wrench;
              const page = servicePages.find((p) => p.slug === service.slug);
              return (
                <Reveal key={service.slug} delay={(i % 2) * 60}>
                  <Link
                    href={`/services/${service.slug}`}
                    className="group flex h-full items-start gap-5 rounded-lg border border-cream-200 bg-white p-6 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-card-hover motion-reduce:hover:translate-y-0 sm:p-7"
                  >
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-navy-50">
                      <Icon className="h-6 w-6 text-navy-700" aria-hidden="true" />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-serif text-xl font-semibold text-ink-900 group-hover:text-navy-700">
                        {service.name}
                      </span>
                      <span className="mt-2 text-sm text-ink-500">
                        {page?.metaDescription ?? service.short}
                      </span>
                      <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-navy-700">
                        Details
                        <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                      </span>
                    </div>
                  </Link>
                </Reveal>
              );
            })}
          </div>

          <div className="mt-14 rounded-lg border border-navy-200 bg-navy-50 p-6 sm:p-8">
            <div className="flex flex-col items-start justify-between gap-5 sm:flex-row sm:items-center">
              <div>
                <h2 className="font-serif text-2xl font-semibold text-ink-900">
                  Not sure where to start?
                </h2>
                <p className="mt-2 max-w-xl text-base text-ink-700">
                  Book a free consultation — we&apos;ll look at what you have, tell you what&apos;s
                  solid, and put anything that needs fixing in a written quote. No obligation.
                </p>
              </div>
              <BookingsLink
                bookingsUrl={process.env.BOOKINGS_URL ?? null}
                location="services_index"
              >
                Book a free consultation
              </BookingsLink>
            </div>
          </div>
        </Container>
      </section>

      <CtaBand
        title="Or start with the free health check."
        lede="Enter your organization's email domain and get letter grades on the security records that decide whether your email can be spoofed — in about fifteen seconds."
        cta={
          <Link
            href="/health-check"
            className="inline-flex items-center justify-center gap-2 rounded-md bg-cream-50 px-6 py-3 font-sans text-sm font-semibold text-navy-900 transition-colors hover:bg-cream-100"
          >
            Run the free M365 health check
          </Link>
        }
        location="services_cta"
      />
    </>
  );
}

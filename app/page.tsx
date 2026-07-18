import type { Metadata } from "next";
import Link from "next/link";
import {
  Building2,
  Home as HomeIcon,
  Wrench,
  ShieldCheck,
  Mail,
  Wifi,
  PhoneCall,
  Camera,
  ArrowRight,
  Landmark,
  CalendarCheck,
  CreditCard,
  BadgeDollarSign,
} from "lucide-react";
import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { PhoneLink } from "@/components/ui/PhoneLink";
import { TrustBar } from "@/components/sections/TrustBar";
import { HeroBackdrop } from "@/components/sections/HeroBackdrop";
import { Testimonials } from "@/components/sections/Testimonials";
import { PhotoSlot } from "@/components/sections/PhotoSlot";
import { CtaBand } from "@/components/sections/CtaBand";
import { site, businessServices, residentialServices } from "@/lib/site";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

const serviceIcons = [Wrench, ShieldCheck, Mail, Wifi, PhoneCall, Camera] as const;

export default function HomePage() {
  const featuredResidential = residentialServices.filter((s) =>
    ["in-home-tech-help", "virus-malware-removal", "remote-support"].includes(s.slug)
  );

  return (
    <>
      {/* Hero + path splitter, all above the fold */}
      <section className="relative isolate overflow-hidden bg-navy-900">
        <HeroBackdrop src="/photos/hero-home.webp" priority variant="light" />
        <Container className="pb-10 pt-14 sm:pb-14 sm:pt-20">
          <p className="eyebrow-light">Russell Springs, Kentucky · Since {site.foundedYear}</p>
          <h1 className="mt-4 max-w-3xl font-serif text-4xl font-semibold text-cream-50 sm:text-5xl">
            The IT department for the offices that keep south-central Kentucky running.
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-navy-100">
            County and city governments, medical practices, and small businesses trust our
            technicians with the systems their communities depend on — and the same team makes
            house calls, at flat rates you can see up front.
          </p>

          {/* Path splitter */}
          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            <Link
              href="/services"
              className="group flex flex-col rounded-lg border border-navy-700 bg-navy-800 p-6 transition-all hover:-translate-y-0.5 hover:border-brass-400 hover:bg-navy-950 hover:shadow-card-hover motion-reduce:hover:translate-y-0 sm:p-8"
            >
              <Building2 className="h-8 w-8 text-brass-300" aria-hidden="true" />
              <span className="mt-4 font-serif text-2xl font-semibold text-cream-50">
                For your business or office
              </span>
              <span className="mt-2 flex-1 text-base text-navy-100">
                Managed IT, cybersecurity, Microsoft 365, networks, phones, and cameras — with a
                free consultation to start.
              </span>
              <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-brass-300">
                Explore business services
                <ArrowRight
                  className="h-4 w-4 transition-transform group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </span>
            </Link>
            <Link
              href="/book"
              className="group flex flex-col rounded-lg border border-cream-200 bg-cream-50 p-6 transition-all hover:-translate-y-0.5 hover:border-brass-500 hover:bg-cream-200 hover:shadow-card-hover motion-reduce:hover:translate-y-0 sm:p-8"
            >
              <HomeIcon className="h-8 w-8 text-navy-700" aria-hidden="true" />
              <span className="mt-4 font-serif text-2xl font-semibold text-ink-900">
                For your home
              </span>
              <span className="mt-2 flex-1 text-base text-ink-700">
                Flat-rate tech help from $49 — pick a service, pick a real time slot, pay online,
                done. Confirmed appointments, not wait-around windows.
              </span>
              <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-navy-700">
                Book a home visit
                <ArrowRight
                  className="h-4 w-4 transition-transform group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </span>
            </Link>
          </div>
        </Container>
      </section>

      <TrustBar />

      {/* Services grid */}
      <section className="py-16 sm:py-24">
        <Container>
          <SectionHeading
            eyebrow="What we do"
            title="Every system your office depends on"
            lede="Six service lines, one accountable local team. If it plugs in and matters, it's ours to keep running."
          />
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {businessServices.map((service, i) => {
              const Icon = serviceIcons[i] ?? Wrench;
              return (
                <Reveal key={service.slug} delay={(i % 3) * 60}>
                  <Link
                    href={`/services/${service.slug}`}
                    className="group flex h-full flex-col rounded-lg border border-cream-200 bg-white p-6 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-card-hover motion-reduce:hover:translate-y-0"
                  >
                    <Icon className="h-7 w-7 text-navy-600" aria-hidden="true" />
                    <span className="mt-4 font-serif text-xl font-semibold text-ink-900 group-hover:text-navy-700">
                      {service.name}
                    </span>
                    <span className="mt-2 flex-1 text-sm text-ink-500">{service.short}</span>
                    <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-navy-700">
                      Learn more
                      <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                    </span>
                  </Link>
                </Reveal>
              );
            })}
          </div>
        </Container>
      </section>

      {/* Government callout */}
      <section className="border-y border-cream-200 bg-navy-950">
        <Container className="py-16 sm:py-20">
          <div className="grid items-center gap-10 lg:grid-cols-[1.2fr_1fr]">
            <div>
              <p className="eyebrow-light">For public entities</p>
              <h2 className="mt-3 font-serif text-3xl font-semibold text-cream-50 sm:text-4xl">
                County and city offices are our first specialty.
              </h2>
              <p className="mt-4 text-lg text-navy-100">
                Courthouses, clerks, utility districts, and departments run on systems that hold
                the public&apos;s records — and ransomware crews know it. We bring security-first
                support, procurement-friendly paperwork, and accountability you can drive to.
              </p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <ButtonLink href="/government" variant="onNavy">
                  How we serve government
                </ButtonLink>
                <ButtonLink href="/health-check" variant="brass">
                  Free security posture report
                </ButtonLink>
              </div>
            </div>
            <ul className="space-y-4">
              {[
                "Local legal entity, W-9 on request, quotes in writing",
                "Budget-cycle-aware planning — no surprise renewals",
                "Experience with records-holding and HIPAA-conscious offices",
                "A technician who shows up, not a ticket number",
              ].map((point) => (
                <li key={point} className="flex items-start gap-3 rounded-md border border-navy-800 bg-navy-900 p-4">
                  <Landmark className="mt-0.5 h-5 w-5 shrink-0 text-brass-300" aria-hidden="true" />
                  <span className="text-sm font-medium text-navy-100">{point}</span>
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </section>

      {/* Residential callout with visible prices */}
      <section className="py-16 sm:py-24">
        <Container>
          <div className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-end">
            <SectionHeading
              eyebrow="For your home"
              title="Flat rates. Real appointment times. No upselling."
              lede="The only local tech service you can book and pay for entirely online — and the price you see is the price you pay."
            />
            <ButtonLink href="/home-services" variant="secondary" className="shrink-0">
              See the full menu
            </ButtonLink>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {featuredResidential.map((service, i) => (
              <Reveal key={service.slug} delay={i * 60}>
                <div className="flex h-full flex-col rounded-lg border border-cream-200 bg-white p-6 shadow-card">
                  <div className="flex items-baseline justify-between gap-3">
                    <h3 className="font-serif text-lg font-semibold text-ink-900">
                      {service.name}
                    </h3>
                    <span className="font-serif text-2xl font-semibold text-navy-700">
                      {service.priceDisplay}
                    </span>
                  </div>
                  <p className="mt-3 flex-1 text-sm text-ink-500">{service.blurb}</p>
                  <ButtonLink
                    href={`/book?service=${service.slug}`}
                    className="mt-5 w-full"
                    variant="primary"
                  >
                    Book this
                  </ButtonLink>
                </div>
              </Reveal>
            ))}
          </div>
          <p className="mt-6 text-sm text-ink-500">
            {site.travelFee.explanation} Remote sessions never have a travel fee.
          </p>
        </Container>
      </section>

      {/* Why local matters */}
      <section className="border-y border-cream-200 bg-cream-100 py-16 sm:py-24">
        <Container>
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <div>
              <SectionHeading
                eyebrow="Why local matters"
                title="You know where to find us. That changes everything."
                lede={`Lake Cumberland Computers is Louis Stargel and a small team of technicians working from Lakeway Dr in Russell Springs — the same people, year after year, since ${site.foundedYear}.`}
              />
              <div className="mt-6 space-y-4 text-base text-ink-700">
                <p>
                  When your IT company is down the road instead of across the country, incentives
                  change. We see our clients at the grocery store. Our reputation lives in the
                  same six counties we do. A national help desk can afford to give you a bad
                  afternoon — we can&apos;t, and we don&apos;t want to.
                </p>
                <p>
                  That&apos;s why offices that handle deeds, dockets, and patient charts pick up
                  the phone and call us — and why, when your home computer is acting up, you get
                  the same technicians who protect those offices, at a flat rate posted right on
                  this site.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <PhotoSlot label="Louis at the shop" aspect="aspect-[3/4]" />
              <div className="mt-8 grid gap-4">
                <PhotoSlot label="The technician team" aspect="aspect-[4/3]" />
                <PhotoSlot label="The shop on Lakeway Dr" aspect="aspect-[4/3]" />
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* How it works */}
      <section className="py-16 sm:py-24">
        <Container>
          <SectionHeading
            eyebrow="How it works"
            title="Three steps, either way"
            align="center"
          />
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {[
              {
                icon: PhoneCall,
                step: "1. Tell us what's going on",
                text: "Call, use the chat on this site, book a home visit online, or request a free business consultation. Plain English is all we need.",
              },
              {
                icon: CalendarCheck,
                step: "2. Get a real plan and a real time",
                text: "Homes get a confirmed appointment slot — not a four-hour window. Offices get a free consultation and a written quote before any work starts.",
              },
              {
                icon: CreditCard,
                step: "3. It gets handled",
                text: "Home visits are flat-rate and paid online — no surprise totals at the door. Business work is done to the quote, documented, and supported after.",
              },
            ].map((item, i) => (
              <Reveal key={item.step} delay={i * 60} className="text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-navy-200 bg-navy-50">
                  <item.icon className="h-6 w-6 text-navy-700" aria-hidden="true" />
                </div>
                <h3 className="mt-5 font-serif text-xl font-semibold text-ink-900">{item.step}</h3>
                <p className="mx-auto mt-3 max-w-xs text-sm text-ink-500">{item.text}</p>
              </Reveal>
            ))}
          </div>
          <div className="mt-12 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <ButtonLink href="/book">Book a home visit</ButtonLink>
            <ButtonLink href="/contact" variant="secondary">
              Talk to us about your office
            </ButtonLink>
          </div>
        </Container>
      </section>

      <Testimonials />

      <CtaBand
        title="Ready when you are."
        lede={`Book a flat-rate home visit online, or start the conversation about your office. Either way, you're dealing with neighbors — ${site.address.city}, since ${site.foundedYear}.`}
        location="home_cta"
      />

      {/* Prefer-to-call strip */}
      <div className="border-t border-navy-800 bg-navy-950 py-4 text-center">
        <p className="text-sm text-navy-200">
          <BadgeDollarSign className="mr-1.5 inline h-4 w-4 text-brass-300" aria-hidden="true" />
          Prefer to talk it through? Call{" "}
          <PhoneLink location="home_footer_strip" className="font-bold text-cream-50 underline decoration-brass-400 underline-offset-4 hover:text-brass-300" />
          {" "}— {site.hours.display}.
        </p>
      </div>
    </>
  );
}

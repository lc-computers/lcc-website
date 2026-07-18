import type { Metadata } from "next";
import Link from "next/link";
import {
  Landmark,
  ShieldCheck,
  FileText,
  MapPin,
  Scale,
  Download,
  Check,
} from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { HeroBackdrop } from "@/components/sections/HeroBackdrop";
import { ButtonLink } from "@/components/ui/Button";
import { BookingsLink } from "@/components/ui/BookingsLink";
import { FaqSection } from "@/components/sections/FaqSection";
import { CtaBand } from "@/components/sections/CtaBand";
import { site, yearsInBusiness } from "@/lib/site";

export const metadata: Metadata = {
  title: "IT Support for County & City Government in Kentucky",
  description:
    "Security-first IT support for Kentucky county and city offices, courts, clerks, utility districts, and schools. Local vendor, procurement-friendly, W-9 on request. Free security posture report.",
  alternates: { canonical: "/government" },
};

const govFaq = [
  {
    question: "Can you work within our budget cycle and procurement process?",
    answer:
      "Yes — that's normal for us. We provide written, itemized quotes that hold long enough for fiscal-court or council approval, plan projects around fiscal years, and provide the documentation your process requires. Our legal entity is Stargel Technologies LLC (Lake Cumberland Computers is a service of Stargel Technologies LLC), and a W-9 is available on request.",
  },
  {
    question: "What is the security posture report, and what does it cost?",
    answer:
      "It's free, and it's passive. Enter your office's email domain and we read the public DNS records that control whether your email can be spoofed — SPF, DKIM, and DMARC — plus where your mail is hosted. You get letter grades and a plain-English explanation written for administrators, not engineers. We never scan, probe, or touch your systems.",
  },
  {
    question: "Do you require long-term contracts?",
    answer:
      "Terms are put in writing during the consultation, before you commit to anything — and they're written to survive an audit and a change of administration. We've kept public-sector clients for many years the same way we keep every client: by doing the work.",
  },
  {
    question: "We're a small office — two or three people. Is that too small?",
    answer:
      "No. Small clerks' offices and districts are exactly who gets overlooked by big vendors, and exactly who attackers count on being unprotected. Support is scoped to your actual size and budget.",
  },
];

export default function GovernmentPage() {
  return (
    <>
      <section className="relative isolate overflow-hidden bg-navy-950">
        <HeroBackdrop src="/photos/hero-government.webp" priority />
        <Container className="py-16 sm:py-24">
          <p className="eyebrow-light">For county &amp; city government</p>
          <h1 className="mt-4 max-w-3xl font-serif text-4xl font-semibold text-cream-50 sm:text-5xl">
            The public&apos;s records deserve better than &quot;whoever answers the ticket.&quot;
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-navy-100">
            Courthouses, clerks&apos; offices, utility districts, and city departments across
            south-central Kentucky run on systems that hold deeds, dockets, payrolls, and billing.
            We keep those systems secure, supported, and accountable — from{" "}
            {site.address.city}, since {site.foundedYear}.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <BookingsLink
              bookingsUrl={process.env.BOOKINGS_URL ?? null}
              location="government_hero"
              variant="onNavy"
            >
              Book a free consultation
            </BookingsLink>
            <ButtonLink href="/health-check" variant="brass">
              Get a free security posture report
            </ButtonLink>
          </div>
        </Container>
      </section>

      {/* Who we serve */}
      <section className="border-b border-cream-200 bg-cream-100">
        <Container className="py-10">
          <ul className="flex flex-wrap items-center gap-x-8 gap-y-3 text-sm font-semibold text-ink-700 lg:flex-nowrap lg:justify-between lg:gap-x-2 lg:text-xs xl:text-[0.8125rem]">
            <li className="eyebrow shrink-0">Built for:</li>
            {[
              "County fiscal courts",
              "Clerks & PVAs",
              "City halls & departments",
              "Courts & judicial offices",
              "Utility districts",
              "Schools & libraries",
            ].map((entity) => (
              <li key={entity} className="flex shrink-0 items-center gap-2 lg:gap-1.5">
                <Landmark className="h-4 w-4 text-navy-600" aria-hidden="true" />
                {entity}
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* Ransomware reality */}
      <section className="py-16 sm:py-24">
        <Container>
          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <SectionHeading
                eyebrow="The plain truth"
                title="Small governments are targets — not despite their size, because of it."
                lede="This isn't fear-mongering; it's public record. City and county governments across the country have had systems locked by ransomware, services interrupted, and recovery bills that dwarfed what prevention would have cost."
              />
              <div className="mt-6 space-y-4 text-base text-ink-700">
                <p>
                  The pattern is consistent: attackers don&apos;t break in — they log in, through a
                  phished password, an account with no multi-factor authentication, or a system
                  nobody was patching. Small public offices get hit because attackers assume,
                  usually correctly, that no one is minding those doors.
                </p>
                <p>
                  The defense isn&apos;t exotic. Multi-factor authentication, disciplined patching,
                  protected endpoints, staff who can spot a phish, and backups that have actually
                  been restore-tested. Unglamorous, proven, and affordable — it just has to be
                  somebody&apos;s job.
                </p>
                <p className="font-semibold text-ink-900">We make it our job.</p>
              </div>
            </div>
            <div className="space-y-4">
              {[
                {
                  icon: ShieldCheck,
                  title: "Security posture, documented",
                  text: "Where you stand, in writing, in plain English — what's solid, what's exposed, what we'd fix first and what it costs.",
                },
                {
                  icon: Scale,
                  title: "Compliance-aware practice",
                  text: "Experience supporting records-holding offices and HIPAA-conscious medical practices. We configure for retention, access control, and auditability — and we don't claim certifications we don't hold.",
                },
                {
                  icon: MapPin,
                  title: "Local accountability",
                  text: `Our shop is at ${site.address.full}. If something goes wrong, you know exactly where we are — and we've been there ${yearsInBusiness()} years.`,
                },
                {
                  icon: FileText,
                  title: "Procurement clarity",
                  text: `${site.legalLine}. Written itemized quotes, stable pricing through approval cycles, W-9 available on request.`,
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="flex items-start gap-4 rounded-lg border border-cream-200 bg-white p-6 shadow-card"
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-navy-50">
                    <item.icon className="h-5.5 w-5.5 text-navy-700" aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="font-serif text-lg font-semibold text-ink-900">{item.title}</h3>
                    <p className="mt-1.5 text-sm text-ink-700">{item.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* Posture report callout */}
      <section className="border-y border-cream-200 bg-navy-900">
        <Container className="py-16 sm:py-20">
          <div className="grid items-center gap-10 lg:grid-cols-[1.3fr_1fr]">
            <div>
              <p className="eyebrow-light">Free for public entities</p>
              <h2 className="mt-3 font-serif text-3xl font-semibold text-cream-50 sm:text-4xl">
                A security posture report your board can read.
              </h2>
              <p className="mt-4 text-lg text-navy-100">
                Enter your office&apos;s email domain. We passively read the public records that
                determine whether your office&apos;s email can be impersonated — SPF, DKIM, DMARC,
                and mail hosting — and grade each one, with explanations written for a county
                clerk, not a network engineer. Nothing touches your systems.
              </p>
              <ButtonLink href="/health-check" variant="brass" className="mt-7">
                Run the free report
              </ButtonLink>
            </div>
            <ul className="space-y-3">
              {[
                "Passive public-DNS checks only — we never scan or probe",
                "Letter grades per category, plus an overall grade",
                "Plain-English meaning and what to do about each finding",
                "Emailed to you as a document you can share with your board",
              ].map((point) => (
                <li key={point} className="flex items-start gap-3 text-sm font-medium text-navy-100">
                  <Check className="mt-0.5 h-4.5 w-4.5 shrink-0 text-brass-300" aria-hidden="true" />
                  {point}
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </section>

      {/* Capability statement */}
      <section className="py-16 sm:py-20">
        <Container>
          <div className="flex flex-col items-start justify-between gap-6 rounded-lg border border-cream-200 bg-white p-6 shadow-card sm:p-8 lg:flex-row lg:items-center">
            <div>
              <h2 className="font-serif text-2xl font-semibold text-ink-900">
                Capability statement for your files
              </h2>
              <p className="mt-2 max-w-2xl text-base text-ink-700">
                A one-page summary for procurement folders: services, legal entity, history,
                service area, and contact information. {site.legalLine}. W-9 available on request
                at {site.email}.
              </p>
            </div>
            <a
              href="/lake-cumberland-computers-capability-statement.pdf"
              className="inline-flex shrink-0 items-center gap-2 rounded-md bg-navy-700 px-6 py-3 font-sans text-sm font-semibold text-cream-50 transition-colors hover:bg-navy-800"
              download
            >
              <Download className="h-4 w-4" aria-hidden="true" />
              Download the PDF
            </a>
          </div>

          {/* Local-vendor advantages */}
          <div className="mt-16 grid gap-10 lg:grid-cols-3">
            <SectionHeading
              eyebrow="Why local"
              title="What a local vendor changes"
            />
            <div className="space-y-4 text-base text-ink-700 lg:col-span-2 lg:columns-2 lg:gap-10">
              <p>
                <strong className="text-ink-900">Response is a drive, not a dispatch queue.</strong>{" "}
                When a clerk&apos;s office can&apos;t issue plates or a court system is down, the
                difference between a technician twenty minutes away and a ticket escalation
                process is the difference between an inconvenient morning and a closed office.
              </p>
              <p>
                <strong className="text-ink-900">Accountability has an address.</strong> We answer
                to the same community you serve. Our name is on the work, our shop is on Lakeway
                Dr, and our clients can — and do — walk in.
              </p>
              <p>
                <strong className="text-ink-900">Public money stays local.</strong> Budgets spent
                with local vendors circulate in the counties that raised them — a point fiscal
                courts appreciate without any help from us.
              </p>
              <p>
                <strong className="text-ink-900">Continuity, not turnover.</strong> The team is
                small and stable. The technician who documents your network this year is the one
                who supports it next year — institutional knowledge that survives.
              </p>
            </div>
          </div>
        </Container>
      </section>

      <FaqSection items={govFaq} title="Questions public offices ask us" />

      <CtaBand
        title="Bring us in for a look."
        lede="A free consultation, on your schedule and on your premises if you prefer. We'll assess where things stand and give you a written, itemized picture your board can act on."
        cta={
          <BookingsLink
            bookingsUrl={process.env.BOOKINGS_URL ?? null}
            location="government_cta"
            variant="onNavy"
          >
            Book a free consultation
          </BookingsLink>
        }
        location="government_band"
      />
    </>
  );
}

import type { Metadata } from "next";
import { Eye, FileText, Lock, Timer } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { HeroBackdrop } from "@/components/sections/HeroBackdrop";
import { HealthCheckTool } from "@/components/health-check/HealthCheckTool";
import { FaqSection } from "@/components/sections/FaqSection";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Free M365 Security Health Check — 15 Seconds, No Access Needed",
  description:
    "Enter your domain and get letter grades on the email-security records that decide whether your organization can be impersonated — SPF, DKIM, DMARC, and mail hosting. Free, passive, plain-English.",
  alternates: { canonical: "/health-check" },
};

const faq = [
  {
    question: "Is this safe to run? Will it touch our systems?",
    answer:
      "It's completely passive. We read only public DNS records — the same records every mail system on the internet already checks each time it receives a message claiming to be from you. We never scan, probe, or connect to anything of yours.",
  },
  {
    question: "We're a government office. Is this appropriate for us?",
    answer:
      "It's built for you — think of it as a security posture report for public entities. The report is written so a clerk, treasurer, or judge-executive can read it and share it with a fiscal court or board without translation.",
  },
  {
    question: "What if we just use Gmail addresses?",
    answer:
      "Run it anyway with your Gmail address. Not having your own email domain is itself a meaningful finding — with credibility and security implications — and the report explains what moving to a business domain involves. It's not a rejection; it's the starting point.",
  },
  {
    question: "What's the catch?",
    answer:
      "No catch: you get a genuinely useful report, and we get to introduce ourselves. You'll receive the report, a couple of helpful follow-up emails you can unsubscribe from in one click, and an offer of a free 15-minute walkthrough. That's it — no obligation, no pressure, no reselling your information.",
  },
  {
    question: "A good grade means we're secure, right?",
    answer:
      "It means the specific public records we check look right — which matters, but it's one layer. Backups, MFA, endpoint protection, and staff awareness live inside your systems where a passive check can't see. That's what the free walkthrough and a fuller review are for.",
  },
];

export default function HealthCheckPage() {
  return (
    <>
      <section className="relative isolate overflow-hidden border-b border-cream-200 bg-navy-950">
        <HeroBackdrop src="/photos/hero-patch.webp" priority />
        <Container className="py-14 sm:py-20">
          <div className="grid items-start gap-10 lg:grid-cols-2">
            <div>
              <p className="eyebrow-light">Free M365 Security Health Check</p>
              <h1 className="mt-3 font-serif text-4xl font-semibold text-cream-50 sm:text-5xl">
                Can your organization&apos;s email be impersonated?
              </h1>
              <p className="mt-5 text-lg text-navy-100">
                Three public DNS records decide whether criminals can send email that looks
                exactly like it came from your office — fake invoices, fake payroll changes,
                fake notices. Enter your domain and get letter grades in about fifteen seconds,
                plus a plain-English report by email.
              </p>
              <ul className="mt-7 space-y-3">
                {[
                  { icon: Timer, text: "About 15 seconds — grades on this page instantly" },
                  { icon: Lock, text: "Passive public-record checks only — nothing touches your systems" },
                  { icon: FileText, text: "Written for office managers and county clerks, not engineers" },
                  { icon: Eye, text: "Checks MX hosting, SPF, DKIM, and DMARC" },
                ].map((item) => (
                  <li key={item.text} className="flex items-start gap-3 text-sm font-medium text-navy-100">
                    <item.icon className="mt-0.5 h-4.5 w-4.5 shrink-0 text-brass-300" aria-hidden="true" />
                    {item.text}
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative">
              <HealthCheckTool bookingsUrl={process.env.BOOKINGS_URL ?? null} />
            </div>
          </div>
        </Container>
      </section>

      <section className="py-16 sm:py-20">
        <Container>
          <SectionHeading
            eyebrow="Why these records matter"
            title="The fifteen-second explanation"
            lede="SPF is your list of approved senders. DKIM is a tamper-proof signature on every real message. DMARC is the instruction that tells the world's mail systems to reject the fakes. Most small organizations are missing at least one — and the missing one is usually DMARC, the enforcement piece."
          />
          <p className="mt-6 max-w-2xl text-base text-ink-700">
            Want the full plain-English version with envelopes-and-signatures metaphors? Read{" "}
            <a href="/blog/spf-dkim-dmarc-plain-english" className="font-semibold text-navy-700 underline underline-offset-4">
              Can your business email be spoofed?
            </a>{" "}
            on our blog — then come back and run your check.
          </p>
        </Container>
      </section>

      <FaqSection items={faq} title="Health check questions" />

      <div className="border-t border-navy-800 bg-navy-950 py-4 text-center">
        <p className="text-sm text-navy-200">
          Rather talk to a person? Call{" "}
          <a href={site.phone.tel} className="font-bold text-cream-50 underline decoration-brass-400 underline-offset-4">
            {site.phone.display}
          </a>{" "}
          — {site.hours.display}.
        </p>
      </div>
    </>
  );
}

import type { Metadata } from "next";
import {
  BadgeCheck,
  CalendarClock,
  CreditCard,
  HandHeart,
  MapPin,
  Phone,
  ShieldCheck,
  Car,
} from "lucide-react";
import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { PhoneLink } from "@/components/ui/PhoneLink";
import { Reveal } from "@/components/ui/Reveal";
import { Testimonials } from "@/components/sections/Testimonials";
import { FaqSection } from "@/components/sections/FaqSection";
import { JsonLd } from "@/components/JsonLd";
import { serviceJsonLd } from "@/lib/jsonld";
import { site } from "@/lib/site";
import { getServiceMenu } from "@/lib/booking/services";
import { formatBookingWindow } from "@/lib/format";

export const metadata: Metadata = {
  title: "In-Home Computer Help — Flat Rates, Book Online",
  description:
    "Flat-rate in-home and remote tech help in Russell Springs and surrounding counties. Posted prices, confirmed appointment times, pay online. Virus removal $149, in-home help $99, remote $49.",
  alternates: { canonical: "/home-services" },
};

const promises = [
  {
    icon: BadgeCheck,
    title: "Prices posted up front",
    text: "Every service is a flat rate, published right here. The price you see is the price you pay — no hourly meter, no surprise total at the door.",
  },
  {
    icon: CalendarClock,
    title: "Confirmed times, not windows",
    text: "You pick a real appointment slot online. No \"sometime between noon and five,\" no waiting around, no wondering.",
  },
  {
    icon: CreditCard,
    title: "Book and pay online",
    text: "The only local tech service where the whole thing — service, time slot, payment, confirmation — happens online in about two minutes.",
  },
  {
    icon: HandHeart,
    title: "No upselling. Ever.",
    text: "We fix what you booked us to fix. If something else genuinely needs attention, we'll tell you plainly and let you decide — no pressure, no scare talk.",
  },
  {
    icon: MapPin,
    title: "Technicians you'll recognize",
    text: "Local people from a local shop — the same small team, visit after visit. Not a marketplace stranger with a magnetic sign.",
  },
  {
    icon: ShieldCheck,
    title: "The team trusted with more",
    text: "The same technicians who protect county offices and medical practices are the ones untangling your Wi-Fi. Your home gets office-grade care.",
  },
];

const faq = [
  {
    question: "What if my problem takes longer than the visit?",
    answer:
      "Most jobs on our menu fit comfortably in the appointment. If we find something bigger mid-visit, we stop and talk to you first — what we found, what finishing costs, and whether it's worth it. You decide before anything continues. No silent meter running.",
  },
  {
    question: "What's the travel fee?",
    answer:
      "Nothing in Russell Springs or Jamestown — ZIP 42642 and 42629 pay the menu price, period. Addresses beyond those add a flat $25, shown clearly during booking before you pay. Remote sessions never have a travel fee no matter where you live.",
  },
  {
    question: "What if I need to cancel or reschedule?",
    answer:
      "Cancel 24 hours or more before your appointment for a full refund, automatically. Reschedule free anytime — the confirmation email has a link that does both. Inside 24 hours, call us and we'll work it out.",
  },
  {
    question: "How does the remote session work?",
    answer:
      "At your appointment time, a technician calls you and walks you through opening a secure, one-time screen-share link — you approve it on your end, and you can watch everything they do. When the session ends, the connection is gone. It's $49, 30 minutes, and there's never a travel fee.",
  },
  {
    question: "Do you work on Macs? Phones? Printers?",
    answer:
      "Windows and Mac computers, home networks and Wi-Fi, printers, email, and the tangle where your phone or tablet meets all of the above. If your problem doesn't fit the menu, call us and we'll tell you straight whether we're the right people for it.",
  },
];

// Hourly refresh so limited-time promos appear/expire on schedule without an
// admin edit (admin saves still revalidate immediately).
export const revalidate = 3600;

export default async function HomeServicesPage() {
  const menu = await getServiceMenu();
  return (
    <>
      <section className="border-b border-cream-200 bg-cream-100">
        <Container className="py-14 sm:py-20">
          <p className="eyebrow">For your home</p>
          <h1 className="mt-3 max-w-3xl font-serif text-4xl font-semibold text-ink-900 sm:text-5xl">
            Tech help at your house, at a price you saw coming.
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-ink-500">
            Flat rates, real appointment times, and online payment — from the same local
            technicians who look after the region&apos;s offices. Pick a service below and
            you can be booked in about two minutes.
          </p>
          <div className="mt-8 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
            <ButtonLink href="/book" className="px-8 py-3.5 text-base">
              Book now
            </ButtonLink>
            <p className="text-sm font-medium text-ink-700">
              Prefer to call?{" "}
              <PhoneLink
                location="home_services_hero"
                className="font-bold text-navy-700 underline decoration-brass-400 underline-offset-4 hover:text-navy-900"
              />
            </p>
          </div>
        </Container>
      </section>

      {/* Price menu */}
      <section className="py-16 sm:py-20">
        <Container>
          <SectionHeading
            eyebrow="The menu"
            title="Flat-rate services and prices"
            lede="Services only — no sales tax added. Every price below is the complete price, plus a flat $25 travel fee only if you're outside Russell Springs and Jamestown (never for remote sessions)."
          />
          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {menu.map((service, i) => (
              <Reveal key={service.slug} delay={(i % 3) * 60}>
                <div className="flex h-full flex-col rounded-lg border border-cream-200 bg-white p-6 shadow-card">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-serif text-lg font-semibold leading-snug text-ink-900">
                      {service.name}
                    </h3>
                    <span className="font-serif text-2xl font-semibold text-navy-700">
                      {service.priceDisplay}
                    </span>
                  </div>
                  {formatBookingWindow(service) ? (
                    <p className="mt-3 inline-flex items-center gap-1.5 self-start rounded-full bg-brass-500/15 px-2.5 py-1 text-xs font-bold text-brass-700">
                      <CalendarClock className="h-3.5 w-3.5" aria-hidden="true" />
                      Limited time — book for {formatBookingWindow(service)}
                    </p>
                  ) : null}
                  <p className="mt-3 text-sm text-ink-500">{service.blurb}</p>
                  <ul className="mt-4 flex-1 space-y-2">
                    {service.includes.map((inc) => (
                      <li key={inc} className="flex items-start gap-2 text-sm text-ink-700">
                        <BadgeCheck
                          className="mt-0.5 h-4 w-4 shrink-0 text-brass-600"
                          aria-hidden="true"
                        />
                        {inc}
                      </li>
                    ))}
                  </ul>
                  <ButtonLink href={`/book?service=${service.slug}`} className="mt-6 w-full">
                    Book — {service.priceDisplay}
                  </ButtonLink>
                </div>
              </Reveal>
            ))}

            {/* Travel fee card */}
            <div className="flex h-full flex-col justify-center rounded-lg border border-navy-200 bg-navy-50 p-6">
              <Car className="h-7 w-7 text-navy-700" aria-hidden="true" />
              <h3 className="mt-4 font-serif text-lg font-semibold text-ink-900">
                About the travel fee
              </h3>
              <p className="mt-3 text-sm text-ink-700">{site.travelFee.explanation}</p>
              <p className="mt-3 text-sm text-ink-700">
                Remote sessions have <strong>no travel fee, ever</strong> — a technician connects
                over a secure screen share instead of driving.
              </p>
              <p className="mt-3 text-sm font-semibold text-ink-900">{site.cancellation.policy}</p>
            </div>
          </div>
        </Container>
      </section>

      {/* Positioning promises */}
      <section className="border-y border-cream-200 bg-cream-100 py-16 sm:py-20">
        <Container>
          <SectionHeading
            eyebrow="Our promises"
            title="Why folks book us instead of waiting on a nephew"
          />
          <div className="mt-10 grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
            {promises.map((p, i) => (
              <Reveal key={p.title} delay={(i % 3) * 50}>
                <div>
                  <p.icon className="h-6 w-6 text-navy-700" aria-hidden="true" />
                  <h3 className="mt-3 font-serif text-lg font-semibold text-ink-900">{p.title}</h3>
                  <p className="mt-2 text-sm text-ink-700">{p.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* How a visit works */}
      <section className="py-16 sm:py-20">
        <Container>
          <SectionHeading eyebrow="What to expect" title="How an in-home visit works" />
          <ol className="mt-10 grid gap-8 md:grid-cols-4">
            {[
              {
                step: "Book online",
                text: "Pick your service and a time slot that's actually available — the calendar is live. Pay online and you're locked in.",
              },
              {
                step: "Get confirmed",
                text: "Instant confirmation by email and text, with a calendar invite and everything you need to know before we arrive.",
              },
              {
                step: "We show up on time",
                text: "A technician from our Russell Springs shop arrives at your confirmed time — not a window — and gets to work.",
              },
              {
                step: "Done, explained, backed",
                text: "You get a plain-English rundown of what we did. Questions later? Call the shop. We're not going anywhere.",
              },
            ].map((item, i) => (
              <li key={item.step}>
                <span className="font-serif text-4xl font-semibold text-brass-500">{i + 1}</span>
                <h3 className="mt-2 font-serif text-lg font-semibold text-ink-900">{item.step}</h3>
                <p className="mt-2 text-sm text-ink-700">{item.text}</p>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      <Testimonials />

      <FaqSection items={faq} title="Home service questions" />

      {/* Big book CTA */}
      <section className="bg-navy-900">
        <Container className="py-16 text-center sm:py-24">
          <h2 className="mx-auto max-w-2xl font-serif text-3xl font-semibold text-cream-50 sm:text-4xl">
            Two minutes from now, this could be handled.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-navy-100">
            Pick your service, pick your time, pay online. Confirmed instantly.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <ButtonLink href="/book" variant="onNavy" className="px-10 py-4 text-base">
              Book now
            </ButtonLink>
            <PhoneLink
              location="home_services_cta"
              className="inline-flex items-center gap-2 text-base font-semibold text-cream-50 hover:text-brass-300"
            >
              <Phone className="h-4.5 w-4.5" aria-hidden="true" />
              Prefer to call? {site.phone.display}
            </PhoneLink>
          </div>
        </Container>
      </section>

      <JsonLd
        data={serviceJsonLd({
          name: "In-Home & Remote Computer Services",
          description:
            "Flat-rate residential tech services: in-home tech help, virus removal, new computer setup, home Wi-Fi, and remote support.",
          slug: "home-services",
          path: "/home-services",
          offers: menu.map((s) => ({
            name: s.name,
            price: s.priceCents / 100,
          })),
        })}
      />
    </>
  );
}

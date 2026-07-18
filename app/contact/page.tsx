import type { Metadata } from "next";
import { MapPin, Clock, Mail, Phone, ExternalLink } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { PhoneLink } from "@/components/ui/PhoneLink";
import { ContactForm } from "@/components/forms/ContactForm";
import { RegionMap } from "@/components/sections/RegionMap";
import { HeroBackdrop } from "@/components/sections/HeroBackdrop";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Call (270) 866-8660, email info@lakecumberlandcomputers.com, or stop by 478 Lakeway Dr, Russell Springs, KY. Monday–Friday 8–5 CT.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
    `${site.name}, ${site.address.full}`
  )}`;

  return (
    <>
      <section className="relative isolate overflow-hidden bg-navy-950">
        <HeroBackdrop src="/photos/hero-phone.webp" priority variant="light" />
        <Container className="py-14 sm:py-18">
          <p className="eyebrow-light">Contact</p>
          <h1 className="mt-3 max-w-2xl font-serif text-4xl font-semibold text-cream-50 sm:text-5xl">
            Talk to a person. It&apos;s kind of our thing.
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-navy-100">
            Call during business hours and a human answers. Or send a message below and
            we&apos;ll get back to you — usually the same business day.
          </p>
        </Container>
      </section>

      <section className="py-14 sm:py-20">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr]">
            <div>
              <ul className="space-y-6">
                <li className="flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-navy-50">
                    <Phone className="h-5 w-5 text-navy-700" aria-hidden="true" />
                  </div>
                  <div>
                    <h2 className="font-sans text-sm font-bold uppercase tracking-wider text-ink-500">
                      Phone
                    </h2>
                    <PhoneLink
                      location="contact_page"
                      className="mt-1 block font-serif text-2xl font-semibold text-navy-700 hover:text-navy-900"
                    />
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-navy-50">
                    <Mail className="h-5 w-5 text-navy-700" aria-hidden="true" />
                  </div>
                  <div>
                    <h2 className="font-sans text-sm font-bold uppercase tracking-wider text-ink-500">
                      Email
                    </h2>
                    <a
                      href={`mailto:${site.email}`}
                      className="mt-1 block break-all text-lg font-semibold text-navy-700 hover:text-navy-900"
                    >
                      {site.email}
                    </a>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-navy-50">
                    <MapPin className="h-5 w-5 text-navy-700" aria-hidden="true" />
                  </div>
                  <div>
                    <h2 className="font-sans text-sm font-bold uppercase tracking-wider text-ink-500">
                      The shop
                    </h2>
                    <p className="mt-1 text-lg font-semibold text-ink-900">{site.address.full}</p>
                    <a
                      href={directionsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1 inline-flex items-center gap-1.5 text-sm font-semibold text-navy-700 hover:text-navy-900"
                    >
                      Get directions
                      <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                    </a>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-navy-50">
                    <Clock className="h-5 w-5 text-navy-700" aria-hidden="true" />
                  </div>
                  <div>
                    <h2 className="font-sans text-sm font-bold uppercase tracking-wider text-ink-500">
                      Hours
                    </h2>
                    <p className="mt-1 text-lg font-semibold text-ink-900">{site.hours.display}</p>
                  </div>
                </li>
              </ul>

              <div className="mt-10">
                <RegionMap className="w-full rounded-lg border border-cream-200" />
              </div>
            </div>

            <div className="relative rounded-lg border border-cream-200 bg-white p-6 shadow-card sm:p-8">
              <h2 className="font-serif text-2xl font-semibold text-ink-900">Send a message</h2>
              <p className="mt-2 text-sm text-ink-500">
                Business inquiries, home service questions, or anything in between.
              </p>
              <div className="mt-6">
                <ContactForm />
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}

import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";
import { Mark } from "@/components/brand/Mark";
import { site } from "@/lib/site";

export default function NotFound() {
  return (
    <section className="py-24 sm:py-32">
      <Container className="text-center">
        <Mark className="mx-auto h-14 w-14 text-navy-200" />
        <p className="eyebrow mt-6">404 — page not found</p>
        <h1 className="mt-3 font-serif text-4xl font-semibold text-ink-900 sm:text-5xl">
          Well, that link&apos;s broken.
        </h1>
        <p className="mx-auto mt-4 max-w-md text-lg text-ink-500">
          Fixing broken things is literally our job, but this page is gone for good. Here&apos;s
          where you probably meant to go:
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <ButtonLink href="/">Back to the homepage</ButtonLink>
          <ButtonLink href="/book" variant="secondary">
            Book a home visit
          </ButtonLink>
        </div>
        <p className="mt-8 text-sm text-ink-500">
          Or just call us:{" "}
          <a href={site.phone.tel} className="font-bold text-navy-700 hover:text-navy-900">
            {site.phone.display}
          </a>
        </p>
      </Container>
    </section>
  );
}

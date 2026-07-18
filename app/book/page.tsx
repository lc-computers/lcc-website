import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { BookingFlow } from "@/components/booking/BookingFlow";
import { getServiceMenu } from "@/lib/booking/services";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Book a Home Visit or Remote Session",
  description:
    "Pick a flat-rate service, pick a real time slot, pay online — confirmed instantly with email and text. In-home and remote tech help across the Lake Cumberland region.",
  alternates: { canonical: "/book" },
};

export default async function BookPage({
  searchParams,
}: {
  searchParams: Promise<{ service?: string; canceled?: string }>;
}) {
  const params = await searchParams;
  const services = await getServiceMenu();
  return (
    <>
      <section className="border-b border-cream-200 bg-cream-100">
        <Container className="py-10 sm:py-14">
          <p className="eyebrow">Book online</p>
          <h1 className="mt-3 max-w-2xl font-serif text-3xl font-semibold text-ink-900 sm:text-4xl">
            Two minutes, and it&apos;s on the calendar.
          </h1>
          <p className="mt-3 max-w-2xl text-base text-ink-500">
            Flat rates, real time slots, secure online payment. {site.cancellation.policy}
          </p>
        </Container>
      </section>
      <section className="py-10 sm:py-14">
        <Container>
          <BookingFlow services={services} preselect={params.service} canceled={params.canceled === "1"} />
        </Container>
      </section>
    </>
  );
}

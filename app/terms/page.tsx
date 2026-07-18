import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "The terms for using lakecumberlandcomputers.com and booking our services — cancellation policy, payments, SMS consent, and more, in plain English.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <section className="py-14 sm:py-20">
      <Container>
        <div className="max-w-3xl">
          <p className="eyebrow">Legal</p>
          <h1 className="mt-3 font-serif text-4xl font-semibold text-ink-900">Terms of Service</h1>
          <p className="mt-3 text-sm text-ink-500">Effective July 16, 2026</p>

          <div className="prose-site mt-8 text-base text-ink-700">
            <p>
              These are the terms for using this website and booking services from {site.name}.
              {" "}{site.legalLine} (&quot;we,&quot; &quot;us&quot;). We&apos;ve written them the
              way we talk. Using the site or booking a service means you accept them.
            </p>

            <h2>Residential bookings and payment</h2>
            <p>
              Residential services are flat-rate and paid in full online when you book, through
              Stripe. Prices are for the services themselves; no sales tax is added. In-home
              visits outside Russell Springs and Jamestown (ZIP 42642 and 42629) add a flat $25
              travel fee, which is shown clearly before you pay. Remote sessions never have a
              travel fee.
            </p>
            <p>
              Your appointment time is confirmed when payment completes. In the rare case two
              people book the last slot at nearly the same moment, the later booking is refunded
              in full automatically, with our apology — you&apos;ll never pay for a slot you
              didn&apos;t get.
            </p>

            <h2>Cancellations, rescheduling, and refunds</h2>
            <p>
              {site.cancellation.policy} Cancel using the link in your confirmation email and
              the refund is automatic to your original payment method. Inside 24 hours, call us
              at {site.phone.display} and we&apos;ll do our best to work something out. If{" "}
              <em>we</em> ever have to cancel on you, you get a full refund and first pick of
              the next available slot.
            </p>

            <h2>What a visit covers</h2>
            <p>
              Each menu service describes what&apos;s included. If we discover mid-visit that
              your problem is bigger than the service you booked, we stop and talk to you before
              doing anything more — what we found, what it would cost, and whether we think
              it&apos;s worth it. Nothing extra is ever performed or charged without your
              agreement.
            </p>
            <p>
              You&apos;re responsible for having the legal right to let us work on the equipment
              you hand us, and we strongly recommend keeping your own copies of important files.
              We take real care with data, but no repair shop can guarantee against all data
              loss — which is why we talk about backups so much.
            </p>

            <h2>Remote sessions</h2>
            <p>
              Remote support uses a secure, one-time screen-share connection that you approve on
              your end and that ends when the session ends. We can see only what you allow
              during the session. We&apos;ll never ask for your passwords in chat, email, or
              text; anything sensitive is typed by you, on your machine.
            </p>

            <h2>Text message (SMS) terms</h2>
            <p>
              Booking includes an optional checkbox consenting to appointment-related text
              messages: confirmation, a reminder before your visit, and a follow-up after.
              Consent is not a condition of booking. Message frequency is low; message and data
              rates may apply. Reply STOP to cancel texts at any time, or HELP for help. We
              don&apos;t send marketing by text.
            </p>

            <h2>The chat assistant</h2>
            <p>
              The chat on this site is an AI assistant. It&apos;s helpful, but it can be wrong —
              its answers aren&apos;t professional advice or a binding quote, and anything
              important (prices for business work, security questions, commitments about your
              specific systems) gets confirmed by a human. The published flat rates on this site
              are real; everything else deserves a phone call.
            </p>

            <h2>The free health check</h2>
            <p>
              The M365 Security Health Check reads only public DNS records and gives you an
              informational grade. It isn&apos;t a security audit, a compliance assessment, or a
              guarantee — a good grade means the specific public records we check look right,
              nothing more. Only submit domains you own or are authorized to check.
            </p>

            <h2>Business and government services</h2>
            <p>
              Business work is performed under written quotes and agreements we&apos;ll provide
              during the consultation process. Those documents govern that work; these website
              terms cover the site and residential bookings.
            </p>

            <h2>The honest legal part</h2>
            <p>
              We stand behind our work — if something we did isn&apos;t right, tell us and
              we&apos;ll make it right. Beyond that, our liability for any claim related to a
              residential service is limited to the amount you paid for that service. We&apos;re
              not liable for indirect damages like lost profits or lost data (again: backups).
              Some states don&apos;t allow certain limits, so parts of this may not apply to
              you. These terms are governed by Kentucky law, and any disputes will be handled in
              the courts of Russell County, Kentucky.
            </p>

            <h2>Changes and questions</h2>
            <p>
              If these terms change, we&apos;ll post the new version here with a new date.
              Questions? {site.phone.display} or {site.email}.
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}

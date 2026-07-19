import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How Lake Cumberland Computers collects, uses, and protects your information — in plain English.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <section className="py-14 sm:py-20">
      <Container>
        <div className="max-w-3xl">
          <p className="eyebrow">Legal</p>
          <h1 className="mt-3 font-serif text-4xl font-semibold text-ink-900">Privacy Policy</h1>
          <p className="mt-3 text-sm text-ink-500">Effective July 18, 2026</p>

          <div className="prose-site mt-8 text-base text-ink-700">
            <p>
              This policy explains what information {site.name} collects, why, and what we do
              with it — in plain English, because that&apos;s how we try to do everything.
              {" "}{site.legalLine}. Our address is {site.address.full}, and you can reach us at{" "}
              {site.phone.display} or {site.email}.
            </p>

            <h2>What we collect, and why</h2>
            <p>
              <strong>Contact form.</strong> Name, email, phone if you provide it, and your
              message. We use it to respond to you. It also creates a lead record in our system
              so we don&apos;t lose track of your request.
            </p>
            <p>
              <strong>The chat assistant.</strong> Our website chat is an AI assistant.
              Conversations are stored so we can follow up on requests and improve how the
              assistant helps people. If you share contact information in chat, we treat it as a
              service inquiry and may follow up. Chat messages are processed by Anthropic (the
              AI provider) to generate responses. Don&apos;t paste passwords or card numbers into
              chat — we&apos;ll never ask for them there.
            </p>
            <p>
              <strong>The free M365 Security Health Check.</strong> We collect the domain or
              email address you enter, your name and email, and optionally your phone number. We
              look up only public DNS records for the domain (MX, SPF, DKIM, DMARC) — the same
              records anyone on the internet can query. We never scan, probe, or connect to your
              systems. Results are stored and emailed to you, and we may follow up about them.
            </p>
            <p>
              <strong>Booking a home service.</strong> Name, email, phone, service address, the
              service you chose, and appointment details. Payment is handled by Stripe — your
              card number goes to Stripe, not to us, and we never see or store it. We store a
              reference to the transaction so we can issue refunds under our cancellation policy.
            </p>
            <p>
              <strong>Text messages (SMS).</strong> If you select the separate optional consent
              checkbox when booking or requesting service, Lake Cumberland Computers may send
              non-marketing customer-care text messages related to your appointment or requested
              IT services. Messages may include appointment confirmations, reminders, scheduling
              changes, technician arrival notifications, service updates, requests for
              information, estimates, repair completion notices, invoice notifications, and
              responses to support questions. Message frequency varies based on your
              appointments and service activity. Message and data rates may apply. Consent to
              receive text messages is not a condition of purchasing or booking a service. Reply
              STOP to opt out or HELP for assistance. Mobile information, including phone
              numbers and SMS opt-in data and consent, will not be sold, rented, or shared with
              third parties or affiliates for marketing or promotional purposes. Information may
              be provided to service providers solely as necessary to deliver our text messaging
              service.
            </p>
            <p>
              <strong>Analytics.</strong> We use privacy-friendly analytics to count visits and
              see which pages help people (for example, that someone clicked &quot;call&quot; —
              not who). We don&apos;t run third-party advertising trackers and we don&apos;t sell
              or share your data for advertising.
            </p>

            <h2>Email</h2>
            <p>
              <strong>Transactional email</strong> — booking confirmations, receipts, reminders,
              health-check reports — is sent because you asked for the service, and can&apos;t be
              unsubscribed from separately while the service is in progress.
            </p>
            <p>
              <strong>Marketing email</strong> — helpful follow-ups and our occasional
              newsletter — always includes our physical address and a one-click unsubscribe
              link, as the CAN-SPAM Act requires. Unsubscribing is instant and we honor it
              permanently. We never buy, sell, or rent email lists.
            </p>

            <h2>Who we share information with</h2>
            <p>
              Only the service providers needed to run this site and deliver what you asked for:
              Stripe (payments), Resend (email delivery), Twilio (text messages), Anthropic
              (the AI behind the chat assistant and report writing), Microsoft (calendar and
              consultation scheduling), Vercel (website hosting and analytics), and our database
              host. Each receives only what it needs to do its job. We do not sell personal
              information to anyone, ever.
            </p>

            <h2>How long we keep things</h2>
            <p>
              Booking and payment records are kept as long as needed for accounting and warranty
              questions. Leads, chat transcripts, and health-check results are kept while
              they&apos;re useful for serving you. Ask us to delete your information at{" "}
              {site.email} and we will, unless a record is required for tax, accounting, or
              legal reasons.
            </p>

            <h2>Security</h2>
            <p>
              Data is encrypted in transit, access is limited to our small team, and we apply
              the same practices we recommend to clients. No one can honestly promise perfect
              security, but protecting other people&apos;s information is literally our line of
              work.
            </p>

            <h2>Children</h2>
            <p>
              Our services are for adults. We don&apos;t knowingly collect information from
              children under 13, and if we learn we have, we&apos;ll delete it.
            </p>

            <h2>Changes and questions</h2>
            <p>
              If this policy changes, the new version will be posted here with a new effective
              date. Questions? Call {site.phone.display} or email {site.email} — a person
              answers both.
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}

import { emailLayout, emailButton, emailHeading } from "./layout";
import { markdownToEmailHtml } from "./markdown";
import { signEmailToken } from "@/lib/tokens";
import { site } from "@/lib/site";

/**
 * Nurture + newsletter templates. Every marketing email carries the physical
 * address (layout footer) and a one-click unsubscribe link (CAN-SPAM).
 */

export function unsubscribeUrl(email: string): string {
  const token = signEmailToken(email);
  if (!token) {
    // ADMIN_SECRET unset — fall back to a mailto unsubscribe (still CAN-SPAM
    // compliant; handled by a human) instead of a forgeable link.
    return `mailto:${site.email}?subject=${encodeURIComponent("Unsubscribe")}`;
  }
  return `${site.url}/unsubscribe?token=${encodeURIComponent(token)}`;
}

export function nurtureDay3Email(to: string, firstName: string | null): {
  subject: string;
  html: string;
  unsubscribeUrl: string;
} {
  const unsub = unsubscribeUrl(to);
  const greeting = firstName ? `${firstName}, here` : "Here";
  return {
    subject: "The 3 DNS records that decide if your email can be forged",
    unsubscribeUrl: unsub,
    html: emailLayout({
      preheader: "SPF, DKIM, and DMARC — explained with envelopes and signatures, not jargon.",
      unsubscribeUrl: unsub,
      bodyHtml: `
${emailHeading("Your grades, explained in plain English.")}
<p>${greeting}'s the follow-up we promised after your security health check.</p>
<p>The report you received grades three public DNS records — SPF, DKIM, and DMARC. Together they decide one thing: whether criminals can send email that looks exactly like it came from your organization. Fake invoices to your vendors. Fake instructions to your staff, "from the boss."</p>
<p>We wrote a plain-English walkthrough of what each record actually does — envelopes, signatures, and instructions, no jargon:</p>
${emailButton(`${site.url}/blog/spf-dkim-dmarc-plain-english`, "Read: Can your email be spoofed?")}
<p>Ten minutes of reading, and your health-check report will make complete sense — including exactly what to fix first.</p>
<p>Questions in the meantime? Just reply, or call ${site.phone.display}.</p>
<p>— Louis and the team at ${site.name}</p>`,
    }),
  };
}

export function nurtureDay7Email(to: string, firstName: string | null): {
  subject: string;
  html: string;
  unsubscribeUrl: string;
} {
  const unsub = unsubscribeUrl(to);
  const bookingsUrl = process.env.BOOKINGS_URL || `${site.url}/contact`;
  return {
    subject: "Want to walk through your report? 15 minutes, free",
    unsubscribeUrl: unsub,
    html: emailLayout({
      preheader: "A quick call to turn your grades into a to-do list — no pitch, no obligation.",
      unsubscribeUrl: unsub,
      bodyHtml: `
${emailHeading(`${firstName ? `${firstName}, want` : "Want"} a second set of eyes on those grades?`)}
<p>A week ago you ran our M365 security health check. If the report is still sitting in a tab somewhere — that's normal, and it's exactly why we offer this:</p>
<p><strong>A free 15-minute walkthrough.</strong> One of our technicians gets on the phone, goes through your report line by line, and tells you plainly what matters, what doesn't, and what fixing the gaps would involve. No pitch. If your setup is solid, we'll tell you that too — it happens, and it's a good call.</p>
${emailButton(bookingsUrl, "Book your 15-minute walkthrough")}
<p>Or just call ${site.phone.display} during business hours (${site.hours.short}) and mention your health check.</p>
<p>— Louis and the team at ${site.name}</p>`,
    }),
  };
}

export function newsletterEmail(
  to: string,
  subject: string,
  contentMd: string
): { subject: string; html: string; unsubscribeUrl: string } {
  const unsub = unsubscribeUrl(to);
  return {
    subject,
    unsubscribeUrl: unsub,
    html: emailLayout({
      preheader: subject,
      unsubscribeUrl: unsub,
      bodyHtml: markdownToEmailHtml(contentMd),
    }),
  };
}

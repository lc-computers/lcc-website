import { emailLayout, emailHeading, emailPanel, escapeHtml } from "./layout";
import { sendEmail } from "./send";
import { site } from "@/lib/site";

/** Internal notifications to Louis (LEAD_NOTIFY_EMAIL). */

export function leadNotifyAddress(): string {
  return process.env.LEAD_NOTIFY_EMAIL || "louis@lakecumberlandcomputers.com";
}

export async function notifyLead(opts: {
  source: string; // "Contact form" | "Chat agent" | "Health check" | "Booking"
  subject: string;
  fields: Record<string, string | null | undefined>;
  bodyHtml?: string;
}): Promise<{ ok: boolean }> {
  const rows = Object.entries(opts.fields)
    .filter(([, v]) => v)
    .map(
      ([k, v]) =>
        `<strong>${escapeHtml(k)}:</strong> ${escapeHtml(String(v))}`
    )
    .join("<br>");
  const html = emailLayout({
    preheader: `${opts.source} lead`,
    bodyHtml: `
${emailHeading(`${opts.source}: new lead`)}
${emailPanel(rows || "No fields captured")}
${opts.bodyHtml ?? ""}
<p style="font-size:12px;color:#4C5D76;">Sent automatically by ${site.domain}.</p>`,
  });
  return sendEmail({ to: leadNotifyAddress(), subject: opts.subject, html });
}

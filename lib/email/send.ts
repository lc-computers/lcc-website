import { Resend } from "resend";
import { site } from "@/lib/site";

/**
 * All outbound email goes through here. If RESEND_API_KEY is absent the
 * message is logged instead of sent (local dev / incomplete env) and the
 * call reports success so flows keep working end-to-end.
 */

export interface EmailAttachment {
  filename: string;
  content: string; // base64
  contentType?: string;
}

export interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  attachments?: EmailAttachment[];
  /** Adds List-Unsubscribe headers (marketing mail). */
  unsubscribeUrl?: string;
  replyTo?: string;
}

let _resend: Resend | null = null;

function getResend(): Resend | null {
  if (!process.env.RESEND_API_KEY) return null;
  if (!_resend) _resend = new Resend(process.env.RESEND_API_KEY);
  return _resend;
}

export function fromAddress(): string {
  const email = process.env.FROM_EMAIL || site.email;
  return `${site.name} <${email}>`;
}

export async function sendEmail(opts: SendEmailOptions): Promise<{ ok: boolean; id?: string }> {
  const resend = getResend();
  if (!resend) {
    console.log(
      `[email:log-mode] to=${opts.to} subject="${opts.subject}"` +
        (opts.attachments?.length ? ` attachments=${opts.attachments.map((a) => a.filename).join(",")}` : "")
    );
    return { ok: true };
  }
  try {
    const { data, error } = await resend.emails.send({
      from: fromAddress(),
      to: opts.to,
      subject: opts.subject,
      html: opts.html,
      replyTo: opts.replyTo ?? process.env.FROM_EMAIL ?? site.email,
      attachments: opts.attachments?.map((a) => ({
        filename: a.filename,
        content: a.content,
        contentType: a.contentType,
      })),
      headers: opts.unsubscribeUrl
        ? {
            "List-Unsubscribe": `<${opts.unsubscribeUrl}>`,
            "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
          }
        : undefined,
    });
    if (error) {
      console.error("email: send failed", error);
      return { ok: false };
    }
    return { ok: true, id: data?.id };
  } catch (err) {
    console.error("email: send threw", err);
    return { ok: false };
  }
}

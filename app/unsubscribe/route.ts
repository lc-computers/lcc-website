import { verifyEmailToken } from "@/lib/tokens";
import { getDb, hasDb } from "@/lib/db";
import { suppression } from "@/lib/db/schema";
import { escapeHtml } from "@/lib/email/layout";
import { site } from "@/lib/site";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Unsubscribe endpoint.
 * GET is side-effect-free (mail scanners and link-prefetchers hit GET
 * constantly) — it verifies the token and shows a one-button confirm form.
 * POST performs the suppression: both the confirm form and RFC 8058
 * List-Unsubscribe-Post clients land here. Suppression is permanent and
 * checked before every marketing send.
 */

function page(title: string, body: string): Response {
  return new Response(
    `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${title} — ${site.name}</title><meta name="robots" content="noindex"></head>
<body style="margin:0;background:#FBF9F5;font-family:Arial,Helvetica,sans-serif;color:#2E3D51;">
<div style="max-width:560px;margin:80px auto;padding:40px;background:#fff;border:1px solid #EAE3D5;border-radius:8px;text-align:center;">
<h1 style="font-family:Georgia,serif;color:#16202E;font-size:26px;margin:0 0 12px;">${title}</h1>
${body}
<p style="margin-top:24px;"><a href="${site.url}" style="color:#0C447C;font-weight:bold;">Back to ${site.domain}</a></p>
</div></body></html>`,
    { headers: { "Content-Type": "text/html; charset=utf-8" } }
  );
}

const INVALID = page(
  "That link didn't work",
  `<p style="font-size:15px;line-height:1.6;">The unsubscribe link looks incomplete. Email us at ${site.email} and a human will remove you right away.</p>`
);

export async function GET(req: Request) {
  const token = new URL(req.url).searchParams.get("token");
  const email = token ? verifyEmailToken(token) : null;
  if (!token || !email) return INVALID;
  return page(
    "Unsubscribe from our emails?",
    `<p style="font-size:15px;line-height:1.6;">Click below and <strong>${escapeHtml(email)}</strong> won't receive any more marketing email from us — effective immediately.</p>
<form method="POST" action="/unsubscribe?token=${encodeURIComponent(token)}" style="margin-top:20px;">
<button type="submit" style="background:#0C447C;color:#FBF9F5;border:none;border-radius:6px;padding:13px 28px;font-size:15px;font-weight:bold;cursor:pointer;">Unsubscribe me</button>
</form>`
  );
}

export async function POST(req: Request) {
  const token = new URL(req.url).searchParams.get("token");
  const email = token ? verifyEmailToken(token) : null;
  if (!email) return new Response("Invalid token", { status: 400 });
  if (hasDb()) {
    await getDb()
      .insert(suppression)
      .values({ email: email.toLowerCase(), reason: "unsubscribe" })
      .onConflictDoNothing();
  }
  return page(
    "You're unsubscribed",
    `<p style="font-size:15px;line-height:1.6;"><strong>${escapeHtml(email)}</strong> won't receive any more marketing email from us — effective immediately. (Booking confirmations and receipts still arrive when you use our services.)</p>`
  );
}

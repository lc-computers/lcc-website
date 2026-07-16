import { verifyEmailToken } from "@/lib/tokens";
import { getDb, hasDb } from "@/lib/db";
import { suppression } from "@/lib/db/schema";
import { site } from "@/lib/site";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * One-click unsubscribe. GET renders a confirmation page (and unsubscribes);
 * POST supports RFC 8058 List-Unsubscribe-Post from mail clients.
 * Suppression is permanent and checked before every marketing send.
 */

async function unsubscribe(token: string | null): Promise<{ ok: boolean; email?: string }> {
  if (!token) return { ok: false };
  const email = verifyEmailToken(token);
  if (!email) return { ok: false };
  if (hasDb()) {
    await getDb()
      .insert(suppression)
      .values({ email: email.toLowerCase(), reason: "unsubscribe" })
      .onConflictDoNothing();
  }
  return { ok: true, email };
}

function page(title: string, body: string): Response {
  return new Response(
    `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${title} — ${site.name}</title><meta name="robots" content="noindex"></head>
<body style="margin:0;background:#FBF9F5;font-family:Arial,Helvetica,sans-serif;color:#2E3D51;">
<div style="max-width:560px;margin:80px auto;padding:40px;background:#fff;border:1px solid #EAE3D5;border-radius:8px;text-align:center;">
<h1 style="font-family:Georgia,serif;color:#16202E;font-size:26px;margin:0 0 12px;">${title}</h1>
<p style="font-size:15px;line-height:1.6;">${body}</p>
<p style="margin-top:24px;"><a href="${site.url}" style="color:#0C447C;font-weight:bold;">Back to ${site.domain}</a></p>
</div></body></html>`,
    { headers: { "Content-Type": "text/html; charset=utf-8" } }
  );
}

export async function GET(req: Request) {
  const token = new URL(req.url).searchParams.get("token");
  const result = await unsubscribe(token);
  if (!result.ok) {
    return page(
      "That link didn't work",
      `The unsubscribe link looks incomplete. Email us at ${site.email} and a human will remove you right away.`
    );
  }
  return page(
    "You're unsubscribed",
    `<strong>${result.email}</strong> won't receive any more marketing email from us — effective immediately. (Booking confirmations and receipts still arrive when you use our services.)`
  );
}

export async function POST(req: Request) {
  const token = new URL(req.url).searchParams.get("token");
  const result = await unsubscribe(token);
  return new Response(result.ok ? "OK" : "Invalid token", { status: result.ok ? 200 : 400 });
}

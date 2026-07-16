import { NextResponse } from "next/server";
import { z } from "zod";
import { getDb, hasDb } from "@/lib/db";
import { leads } from "@/lib/db/schema";
import { notifyLead } from "@/lib/email/internal";
import { escapeHtml } from "@/lib/email/layout";
import { rateLimit, clientIp } from "@/lib/rate-limit";
import { site } from "@/lib/site";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const bodySchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.email().max(200),
  phone: z.string().trim().max(30).optional(),
  organization: z.string().trim().max(200).optional(),
  message: z.string().trim().min(5).max(5000),
});

export async function POST(req: Request) {
  const limit = await rateLimit({
    name: "contact",
    identifier: clientIp(req),
    limit: 10,
    windowSeconds: 3600,
  });
  if (!limit.ok) {
    return NextResponse.json(
      { error: `Too many messages — call us at ${site.phone.display} instead.` },
      { status: 429 }
    );
  }

  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Please fill in your name, email, and a short message." },
      { status: 400 }
    );
  }
  const input = parsed.data;

  if (hasDb()) {
    try {
      await getDb().insert(leads).values({
        name: input.name,
        email: input.email.toLowerCase(),
        phone: input.phone ?? null,
        organization: input.organization ?? null,
        source: "contact",
        message: input.message,
      });
    } catch (err) {
      console.error("contact: lead insert failed (still notifying)", err);
    }
  }

  await notifyLead({
    source: "Contact form",
    subject: `Contact form: ${input.name}${input.organization ? ` (${input.organization})` : ""}`,
    fields: {
      Name: input.name,
      Email: input.email,
      Phone: input.phone ?? null,
      Organization: input.organization ?? null,
    },
    bodyHtml: `<h2 style="font-family:Georgia,serif;font-size:18px;">Message</h2><p style="white-space:pre-wrap;">${escapeHtml(input.message)}</p>`,
  });

  return NextResponse.json({ ok: true });
}

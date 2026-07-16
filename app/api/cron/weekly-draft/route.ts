import { NextResponse } from "next/server";
import { getDb, hasDb } from "@/lib/db";
import { draftNextArticle } from "@/lib/content-engine";
import { sendEmail } from "@/lib/email/send";
import { leadNotifyAddress } from "@/lib/email/internal";
import { emailLayout, emailHeading, emailButton, escapeHtml } from "@/lib/email/layout";
import { site } from "@/lib/site";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 120;

/** Weekly cron (Mondays): auto-draft one article, tell Louis it's waiting. */
export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET;
  if (secret && req.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!hasDb()) {
    return NextResponse.json({ ok: false, reason: "no database configured" });
  }
  const result = await draftNextArticle(getDb());
  if (result.ok) {
    await sendEmail({
      to: leadNotifyAddress(),
      subject: `A blog draft is waiting: "${result.title}"`,
      html: emailLayout({
        preheader: "Review, tweak if you like, hit publish.",
        bodyHtml: `
${emailHeading("This week's draft is ready.")}
<p>The content engine drafted <strong>${escapeHtml(result.title ?? "a new article")}</strong> from your topic queue. It won't publish until you approve it.</p>
${emailButton(`${site.url}/admin`, "Review it in admin")}
<p style="font-size:13px;color:#4C5D76;">Drafts wait as long as you like — nothing goes live without you.</p>`,
      }),
    });
  } else {
    console.log(`weekly-draft: skipped — ${result.reason}`);
  }
  return NextResponse.json({ ok: result.ok, title: result.title, reason: result.reason });
}

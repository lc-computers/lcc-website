import { NextResponse } from "next/server";
import { getDb, hasDb } from "@/lib/db";
import { draftMonthlyNewsletter } from "@/lib/content-engine";
import { sendEmail } from "@/lib/email/send";
import { leadNotifyAddress } from "@/lib/email/internal";
import { emailLayout, emailHeading, emailButton, escapeHtml } from "@/lib/email/layout";
import { site } from "@/lib/site";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 120;

/**
 * Monthly cron (1st): draft the newsletter digest for approval. Nothing is
 * sent to subscribers until Louis approves it in /admin.
 */
export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET;
  if (secret && req.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!hasDb()) {
    return NextResponse.json({ ok: false, reason: "no database configured" });
  }
  const result = await draftMonthlyNewsletter(getDb());
  if (result.ok) {
    await sendEmail({
      to: leadNotifyAddress(),
      subject: `Newsletter draft ready: "${result.title}"`,
      html: emailLayout({
        preheader: "Approve it in admin and it goes to the nurture list.",
        bodyHtml: `
${emailHeading("This month's newsletter is drafted.")}
<p>Subject line: <strong>${escapeHtml(result.title ?? "")}</strong></p>
<p>Read it, edit anything you like, and hit &quot;Approve &amp; send&quot; — it goes to the nurture list with suppression respected. Nothing sends until you do.</p>
${emailButton(`${site.url}/admin`, "Review the newsletter")}`,
      }),
    });
  } else {
    console.log(`monthly-newsletter: skipped — ${result.reason}`);
  }
  return NextResponse.json({ ok: result.ok, subject: result.title, reason: result.reason });
}

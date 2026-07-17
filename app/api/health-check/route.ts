import { NextResponse, after } from "next/server";
import { z } from "zod";
import { getDb, hasDb } from "@/lib/db";
import { healthChecks, leads, nurtureQueue, suppression } from "@/lib/db/schema";
import { normalizeDomain, runDnsChecks } from "@/lib/health-check/dns";
import { gradeResults } from "@/lib/health-check/grade";
import { generateNarrative, buildReportEmail } from "@/lib/health-check/report";
import { sendEmail } from "@/lib/email/send";
import { notifyLead } from "@/lib/email/internal";
import { trackServer } from "@/lib/analytics/server";
import { rateLimit, clientIp } from "@/lib/rate-limit";
import { site } from "@/lib/site";
import { eq } from "drizzle-orm";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

const bodySchema = z.object({
  domainOrEmail: z.string().trim().min(3).max(254),
  name: z.string().trim().min(2).max(120),
  email: z.email().max(200),
  phone: z.string().trim().max(30).optional(),
  // Honeypot
  company_website: z.string().max(0).optional(),
});

export async function POST(req: Request) {
  // Spec: 5/hour/IP
  const limit = await rateLimit({
    name: "health-check",
    identifier: clientIp(req),
    limit: 5,
    windowSeconds: 3600,
  });
  if (!limit.ok) {
    return NextResponse.json(
      { error: `That's the hourly limit for checks. Call us at ${site.phone.display} and we'll run it together.` },
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
      { error: "Please check the form — we need a domain (or work email), your name, and your email." },
      { status: 400 }
    );
  }
  const input = parsed.data;

  const domain = normalizeDomain(input.domainOrEmail);
  if (!domain) {
    return NextResponse.json(
      { error: "That doesn't look like a domain or email address — try something like yourbusiness.com." },
      { status: 400 }
    );
  }

  // Passive public-DNS checks only — hard rule.
  const results = await runDnsChecks(domain);
  const graded = gradeResults(results);
  const narrative = await generateNarrative(results, graded, input.name);
  const report = buildReportEmail({ name: input.name, graded, narrative, domain });

  // Store lead + results, email report, notify, enqueue nurture — after the
  // response so the visitor sees their grades instantly.
  after(async () => {
    const recipient = input.email.toLowerCase();
    try {
      await sendEmail({ to: recipient, subject: report.subject, html: report.html });
    } catch (err) {
      console.error("health-check: report email failed", err);
    }
    if (hasDb()) {
      try {
        const db = getDb();
        const [lead] = await db
          .insert(leads)
          .values({
            name: input.name,
            email: recipient,
            phone: input.phone ?? null,
            source: "health_check",
            message: `Health check for ${domain} — overall ${graded.overall}`,
            meta: { domain, overall: graded.overall, freeMail: results.freeMailProvider },
          })
          .returning({ id: leads.id });
        await db.insert(healthChecks).values({
          domain,
          name: input.name,
          email: recipient,
          phone: input.phone ?? null,
          freeMailProvider: results.freeMailProvider,
          results: { checks: results, graded } as unknown as Record<string, unknown>,
          overallGrade: graded.overall,
          reportHtml: report.html,
          leadId: lead?.id ?? null,
        });

        // Nurture: day 3 article, day 7 walkthrough (suppression is also
        // re-checked at send time; this avoids queueing for known opt-outs).
        // Deduped: re-running the tool never multiplies the sequence.
        const [suppressed] = await db
          .select()
          .from(suppression)
          .where(eq(suppression.email, recipient));
        if (!suppressed) {
          const existing = await db
            .select({ templateKey: nurtureQueue.templateKey })
            .from(nurtureQueue)
            .where(eq(nurtureQueue.email, recipient));
          const alreadyQueued = new Set(existing.map((r) => r.templateKey));
          const day = 24 * 60 * 60 * 1000;
          const toQueue = [
            {
              email: recipient,
              name: input.name,
              templateKey: "hc_day3_article",
              sendAt: new Date(Date.now() + 3 * day),
              meta: { domain },
            },
            {
              email: recipient,
              name: input.name,
              templateKey: "hc_day7_walkthrough",
              sendAt: new Date(Date.now() + 7 * day),
              meta: { domain },
            },
          ].filter((row) => !alreadyQueued.has(row.templateKey));
          if (toQueue.length > 0) {
            await db.insert(nurtureQueue).values(toQueue);
          }
        }
      } catch (err) {
        console.error("health-check: persistence failed", err);
      }
    }
    try {
      await notifyLead({
        source: "Health check",
        subject: `Health check lead: ${input.name} — ${domain} (overall ${graded.overall})`,
        fields: {
          Name: input.name,
          Email: recipient,
          Phone: input.phone ?? null,
          Domain: domain,
          "Overall grade": graded.overall,
          "Free-mail user": results.freeMailProvider ? "Yes — no business domain" : "No",
          Grades: graded.categories.map((c) => `${c.title}: ${c.grade}`).join(" · "),
        },
      });
    } catch (err) {
      console.error("health-check: notify failed", err);
    }
    await trackServer("health_check_completed", {
      overall: graded.overall,
      free_mail: results.freeMailProvider ? 1 : 0,
    });
  });

  return NextResponse.json({
    domain,
    overall: graded.overall,
    freeMailProvider: graded.freeMailProvider,
    categories: graded.categories.map((c) => ({
      key: c.key,
      title: c.title,
      grade: c.grade,
      finding: narrative.categories[c.key] ?? c.finding,
    })),
    intro: narrative.intro,
    summary: narrative.summary,
  });
}

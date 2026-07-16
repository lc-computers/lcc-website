import Anthropic from "@anthropic-ai/sdk";
import type { DnsCheckResults } from "./dns";
import type { GradedResults, Grade } from "./grade";
import { buildHealthCheckPrompt } from "@/lib/prompts/health-check";
import { emailLayout, emailButton, emailHeading, escapeHtml } from "@/lib/email/layout";
import { site } from "@/lib/site";

export interface ReportNarrative {
  intro: string;
  categories: Record<"hosting" | "spf" | "dkim" | "dmarc", string>;
  summary: string;
}

const NARRATIVE_MODEL = "claude-sonnet-5";

/** Deterministic fallback narrative when the API is unavailable. */
function fallbackNarrative(graded: GradedResults, firstName: string): ReportNarrative {
  const byKey = Object.fromEntries(graded.categories.map((c) => [c.key, c.finding])) as Record<
    "hosting" | "spf" | "dkim" | "dmarc",
    string
  >;
  return {
    intro: `${firstName ? `${firstName}, here` : "Here"}'s what the public record says about your email security. These are the same checks every mail system on the internet runs against your domain constantly — we just read them and graded them.`,
    categories: byKey,
    summary:
      graded.overall === "A"
        ? "Overall, your email records are in strong shape. Keep them maintained, and consider a fuller review of the things public records can't show — backups, MFA, and endpoint protection."
        : "The gaps above are well-understood, well-defined fixes — configuration, not new hardware or big spending. Start with whichever category graded lowest, and if you'd like a hand, the walkthrough is free.",
  };
}

export async function generateNarrative(
  results: DnsCheckResults,
  graded: GradedResults,
  name: string
): Promise<ReportNarrative> {
  const firstName = name.split(" ")[0] ?? name;
  if (!process.env.ANTHROPIC_API_KEY) return fallbackNarrative(graded, firstName);
  try {
    const client = new Anthropic();
    const response = await client.messages.create({
      model: NARRATIVE_MODEL,
      max_tokens: 1200,
      system: buildHealthCheckPrompt(),
      messages: [
        {
          role: "user",
          content: JSON.stringify({
            readerFirstName: firstName,
            domain: results.domain,
            freeMailProvider: graded.freeMailProvider,
            overallGrade: graded.overall,
            categories: graded.categories.map((c) => ({
              key: c.key,
              title: c.title,
              grade: c.grade,
              finding: c.finding,
            })),
            rawSignals: {
              mxProvider: results.mx.provider,
              spfPolicy: results.spf.policy,
              dkimNote: results.dkim.note,
              dmarcPolicy: results.dmarc.policy,
            },
          }),
        },
      ],
    });
    const text = response.content.find((b) => b.type === "text")?.text ?? "";
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("no JSON in narrative response");
    const parsed = JSON.parse(jsonMatch[0]) as Partial<ReportNarrative>;
    if (!parsed.intro || !parsed.categories || !parsed.summary) {
      throw new Error("incomplete narrative");
    }
    return parsed as ReportNarrative;
  } catch (err) {
    console.error("health-check: narrative generation failed, using fallback", err);
    return fallbackNarrative(graded, firstName);
  }
}

const gradeColors: Record<Grade, { bg: string; fg: string }> = {
  A: { bg: "#E8F2E8", fg: "#2D5A2D" },
  B: { bg: "#F2F6FB", fg: "#0C447C" },
  C: { bg: "#FBF3DF", fg: "#93712B" },
  D: { bg: "#FAECE0", fg: "#9A5B23" },
  F: { bg: "#F9E7E4", fg: "#A03426" },
};

function gradeChip(grade: Grade, size = 34): string {
  const c = gradeColors[grade];
  return `<span style="display:inline-block;width:${size}px;height:${size}px;line-height:${size}px;text-align:center;border-radius:8px;background:${c.bg};color:${c.fg};font-family:Georgia,serif;font-size:${Math.round(size * 0.55)}px;font-weight:bold;">${grade}</span>`;
}

export function buildReportEmail(opts: {
  name: string;
  graded: GradedResults;
  narrative: ReportNarrative;
  domain: string;
}): { subject: string; html: string } {
  const { graded, narrative } = opts;
  const bookingsUrl = process.env.BOOKINGS_URL || `${site.url}/contact`;

  const rows = graded.categories
    .map((c) => {
      const body = narrative.categories[c.key] ?? c.finding;
      return `<tr>
<td style="padding:14px 0;border-bottom:1px solid #EAE3D5;vertical-align:top;width:44px;">${gradeChip(c.grade)}</td>
<td style="padding:14px 0 14px 14px;border-bottom:1px solid #EAE3D5;vertical-align:top;">
  <strong style="color:#16202E;">${escapeHtml(c.title)}</strong><br>
  <span style="font-size:14px;color:#2E3D51;">${escapeHtml(body)}</span>
</td></tr>`;
    })
    .join("");

  const html = emailLayout({
    preheader: `Overall grade for ${opts.domain}: ${graded.overall}. Plain-English details inside.`,
    bodyHtml: `
${emailHeading(`Email security report for ${escapeHtml(opts.domain)}`)}
<table role="presentation" cellpadding="0" cellspacing="0" style="margin:6px 0 18px;"><tr>
<td style="padding-right:16px;">${gradeChip(graded.overall, 56)}</td>
<td style="font-family:Arial,Helvetica,sans-serif;"><strong style="font-size:16px;color:#16202E;">Overall grade</strong><br>
<span style="font-size:13px;color:#4C5D76;">From public DNS records only — nothing on your systems was touched.</span></td>
</tr></table>
<p>${escapeHtml(narrative.intro)}</p>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0">${rows}</table>
<p style="margin-top:18px;">${escapeHtml(narrative.summary)}</p>
<h2 style="margin:26px 0 10px;font-family:Georgia,serif;font-size:19px;color:#16202E;">What this report can't see</h2>
<p style="font-size:14px;">Public records tell us whether your email can be impersonated. A full internal review also covers the things that decide how a bad day actually goes: <strong>endpoint protection</strong> on your computers, <strong>backups</strong> (and whether they restore), <strong>multi-factor authentication</strong>, <strong>staff phishing awareness</strong>, and <strong>who has access to what</strong>. That review is a conversation, not a scan — and the first one is free.</p>
${emailButton(bookingsUrl, "Book a free 15-minute walkthrough")}
<p style="font-size:14px;">Or call ${site.phone.display} (${site.hours.short}) and mention this report — we'll go through it line by line, no obligation.</p>
<p style="font-size:14px;">— Louis and the team at ${site.name}</p>`,
  });

  return {
    subject: `Your email security grades for ${opts.domain}: ${graded.overall} overall`,
    html,
  };
}

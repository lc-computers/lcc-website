import type { DnsCheckResults } from "./dns";

/**
 * Deterministic grading — computed in code so grades are consistent and
 * auditable. Claude writes the plain-English narrative around them, never
 * the grades themselves.
 */

export type Grade = "A" | "B" | "C" | "D" | "F";

export interface CategoryGrade {
  key: "hosting" | "spf" | "dkim" | "dmarc";
  title: string;
  grade: Grade;
  /** One-line factual finding used in the report and as Claude's grounding. */
  finding: string;
}

export interface GradedResults {
  categories: CategoryGrade[];
  overall: Grade;
  freeMailProvider: boolean;
}

const gpa: Record<Grade, number> = { A: 4, B: 3, C: 2, D: 1, F: 0 };

function fromGpa(value: number): Grade {
  if (value >= 3.5) return "A";
  if (value >= 2.5) return "B";
  if (value >= 1.5) return "C";
  if (value >= 0.75) return "D";
  return "F";
}

export function gradeResults(results: DnsCheckResults): GradedResults {
  if (results.freeMailProvider) {
    // The "domain" is a consumer mail service — the finding IS the grade.
    return {
      freeMailProvider: true,
      overall: "D",
      categories: [
        {
          key: "hosting",
          title: "Business email domain",
          grade: "D",
          finding:
            "The business runs on a personal/free email service rather than its own domain — a credibility and security gap, and none of the protections below can be configured.",
        },
        {
          key: "spf",
          title: "SPF (approved senders)",
          grade: "F",
          finding: "Not applicable without your own domain — you can't control who sends as you.",
        },
        {
          key: "dkim",
          title: "DKIM (message signing)",
          grade: "F",
          finding: "Not applicable without your own domain.",
        },
        {
          key: "dmarc",
          title: "DMARC (enforcement)",
          grade: "F",
          finding: "Not applicable without your own domain.",
        },
      ],
    };
  }

  const categories: CategoryGrade[] = [];

  // Mail hosting
  let hostingGrade: Grade;
  let hostingFinding: string;
  if (!results.mx.found) {
    hostingGrade = "F";
    hostingFinding = "No mail servers (MX records) were found — email to this domain doesn't have a home.";
  } else if (results.mx.provider === "microsoft365") {
    hostingGrade = "A";
    hostingFinding = "Email is hosted on Microsoft 365 — professional hosting with strong security available.";
  } else if (results.mx.provider === "google") {
    hostingGrade = "A";
    hostingFinding = "Email is hosted on Google Workspace — professional hosting with strong security available.";
  } else if (results.mx.provider === "godaddy") {
    hostingGrade = "B";
    hostingFinding = "Email is hosted on GoDaddy's mail service — functional, though most offices eventually outgrow it.";
  } else {
    hostingGrade = "B";
    hostingFinding = "Email is hosted with a provider we didn't immediately recognize — worth confirming it's business-grade.";
  }
  categories.push({ key: "hosting", title: "Mail hosting", grade: hostingGrade, finding: hostingFinding });

  // SPF
  let spfGrade: Grade;
  let spfFinding: string;
  if (!results.spf.found) {
    spfGrade = "F";
    spfFinding = "No SPF record exists — receiving mail systems have no list of your approved senders.";
  } else if (results.spf.multipleRecords) {
    spfGrade = "D";
    spfFinding = "Multiple SPF records were found — that's invalid and can make SPF fail entirely.";
  } else if (results.spf.policy === "strict") {
    spfGrade = "A";
    spfFinding = "SPF is published with a strict policy (-all) — the strongest setting.";
  } else if (results.spf.policy === "softfail") {
    spfGrade = "B";
    spfFinding = "SPF is published with a soft-fail policy (~all) — good, one notch below strict.";
  } else if (results.spf.policy === "pass-all") {
    spfGrade = "F";
    spfFinding = "SPF ends in +all, which approves EVERY server on the internet to send as you.";
  } else {
    spfGrade = "D";
    spfFinding = "SPF exists but its policy is neutral — it lists senders without asking anyone to act on it.";
  }
  categories.push({ key: "spf", title: "SPF (approved senders)", grade: spfGrade, finding: spfFinding });

  // DKIM
  let dkimGrade: Grade;
  if (results.mx.provider === "microsoft365") {
    dkimGrade = results.dkim.m365SelectorsFound === 2 ? "A" : results.dkim.m365SelectorsFound === 1 ? "B" : "D";
  } else if (results.mx.provider === "google") {
    dkimGrade = results.dkim.googleSelectorFound ? "A" : "D";
  } else if (results.dkim.m365SelectorsFound > 0 || results.dkim.googleSelectorFound) {
    dkimGrade = "B";
  } else if (!results.dkim.verifiable) {
    dkimGrade = "C";
  } else {
    dkimGrade = "D";
  }
  categories.push({ key: "dkim", title: "DKIM (message signing)", grade: dkimGrade, finding: results.dkim.note });

  // DMARC
  let dmarcGrade: Grade;
  let dmarcFinding: string;
  if (!results.dmarc.found) {
    dmarcGrade = "F";
    dmarcFinding = "No DMARC record exists — receiving systems get no instructions about forged mail, so most deliver it.";
  } else if (results.dmarc.policy === "reject") {
    dmarcGrade = "A";
    dmarcFinding = "DMARC is set to reject — forged mail claiming to be you is refused outright.";
  } else if (results.dmarc.policy === "quarantine") {
    dmarcGrade = "B";
    dmarcFinding = "DMARC is set to quarantine — forged mail is sent to junk folders.";
  } else {
    dmarcGrade = results.dmarc.hasReporting ? "C" : "C";
    dmarcFinding = results.dmarc.hasReporting
      ? "DMARC exists in monitoring mode (p=none) with reporting on — a fine starting point, but fakes still get delivered until the policy is tightened."
      : "DMARC exists but is set to p=none with no reporting — it neither blocks fakes nor tells you about them.";
  }
  categories.push({ key: "dmarc", title: "DMARC (enforcement)", grade: dmarcGrade, finding: dmarcFinding });

  // Overall — SPF and DMARC carry the most weight for spoofability.
  const weights: Record<CategoryGrade["key"], number> = { hosting: 1, spf: 1.5, dkim: 1, dmarc: 1.5 };
  let totalWeight = 0;
  let sum = 0;
  for (const c of categories) {
    sum += gpa[c.grade] * weights[c.key];
    totalWeight += weights[c.key];
  }
  return { categories, overall: fromGpa(sum / totalWeight), freeMailProvider: false };
}

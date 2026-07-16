import { resolveMx, resolveTxt, resolveCname } from "node:dns/promises";

/**
 * Passive checks ONLY: public DNS lookups any mail server on the internet
 * performs constantly. We never scan, probe, or connect to target
 * infrastructure — that's a hard rule.
 */

export const FREE_MAIL_DOMAINS = new Set([
  "gmail.com",
  "googlemail.com",
  "yahoo.com",
  "ymail.com",
  "hotmail.com",
  "outlook.com",
  "live.com",
  "msn.com",
  "aol.com",
  "icloud.com",
  "me.com",
  "mac.com",
  "protonmail.com",
  "proton.me",
  "att.net",
  "bellsouth.net",
  "comcast.net",
  "charter.net",
  "twc.com",
  "roadrunner.com",
  "windstream.net",
  "duo-county.com",
]);

export type MailProvider = "microsoft365" | "google" | "godaddy" | "other" | "none";

export interface DnsCheckResults {
  domain: string;
  freeMailProvider: boolean;
  mx: {
    found: boolean;
    provider: MailProvider;
    hosts: string[];
    error?: string;
  };
  spf: {
    found: boolean;
    record: string | null;
    policy: "strict" | "softfail" | "neutral" | "pass-all" | "none";
    multipleRecords: boolean;
  };
  dkim: {
    m365SelectorsFound: number; // 0-2 (selector1/selector2 CNAMEs)
    googleSelectorFound: boolean;
    verifiable: boolean;
    note: string;
  };
  dmarc: {
    found: boolean;
    record: string | null;
    policy: "reject" | "quarantine" | "none" | "missing";
    hasReporting: boolean;
  };
}

/** "User@Example.COM" | "example.com" → "example.com" (or null if invalid). */
export function normalizeDomain(input: string): string | null {
  let value = input.trim().toLowerCase();
  const at = value.lastIndexOf("@");
  if (at >= 0) value = value.slice(at + 1);
  value = value.replace(/^https?:\/\//, "").replace(/^www\./, "").split("/")[0] ?? "";
  if (!/^[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?(\.[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?)+$/.test(value)) {
    return null;
  }
  return value;
}

async function txtRecords(name: string): Promise<string[]> {
  try {
    const records = await resolveTxt(name);
    return records.map((chunks) => chunks.join(""));
  } catch {
    return [];
  }
}

async function cnameExists(name: string): Promise<boolean> {
  try {
    const result = await resolveCname(name);
    return result.length > 0;
  } catch {
    return false;
  }
}

function detectProvider(hosts: string[]): MailProvider {
  const joined = hosts.join(" ").toLowerCase();
  if (joined.includes("mail.protection.outlook.com")) return "microsoft365";
  if (joined.includes("google.com") || joined.includes("googlemail.com")) return "google";
  if (joined.includes("secureserver.net")) return "godaddy";
  return hosts.length > 0 ? "other" : "none";
}

export async function runDnsChecks(domain: string): Promise<DnsCheckResults> {
  const freeMailProvider = FREE_MAIL_DOMAINS.has(domain);

  // MX
  let mxHosts: string[] = [];
  let mxError: string | undefined;
  try {
    const mx = await resolveMx(domain);
    mxHosts = mx.sort((a, b) => a.priority - b.priority).map((r) => r.exchange.toLowerCase());
  } catch (err) {
    mxError = err instanceof Error ? err.message : "lookup failed";
  }
  const provider = detectProvider(mxHosts);

  // SPF
  const rootTxt = await txtRecords(domain);
  const spfRecords = rootTxt.filter((r) => r.toLowerCase().startsWith("v=spf1"));
  const spfRecord = spfRecords[0] ?? null;
  let spfPolicy: DnsCheckResults["spf"]["policy"] = "none";
  if (spfRecord) {
    const lower = spfRecord.toLowerCase();
    if (lower.includes("-all")) spfPolicy = "strict";
    else if (lower.includes("~all")) spfPolicy = "softfail";
    else if (lower.includes("?all")) spfPolicy = "neutral";
    else if (lower.includes("+all")) spfPolicy = "pass-all";
    else spfPolicy = "neutral";
  }

  // DKIM — selector1/selector2 CNAMEs (Microsoft 365), google._domainkey TXT
  const [sel1, sel2] = await Promise.all([
    cnameExists(`selector1._domainkey.${domain}`),
    cnameExists(`selector2._domainkey.${domain}`),
  ]);
  const googleTxt = await txtRecords(`google._domainkey.${domain}`);
  const googleSelectorFound = googleTxt.some((r) => r.toLowerCase().includes("v=dkim1"));
  const m365SelectorsFound = (sel1 ? 1 : 0) + (sel2 ? 1 : 0);
  let dkimNote: string;
  let verifiable = true;
  if (provider === "microsoft365") {
    dkimNote =
      m365SelectorsFound === 2
        ? "Both Microsoft 365 DKIM selectors are published."
        : m365SelectorsFound === 1
          ? "Only one of the two Microsoft 365 DKIM selectors is published."
          : "Microsoft 365 DKIM selectors (selector1/selector2) are not published.";
  } else if (provider === "google") {
    dkimNote = googleSelectorFound
      ? "Google Workspace DKIM key is published."
      : "Google Workspace DKIM key (google._domainkey) was not found.";
  } else if (m365SelectorsFound > 0 || googleSelectorFound) {
    dkimNote = "DKIM keys were found for a major provider.";
  } else {
    verifiable = false;
    dkimNote =
      "This mail provider uses selector names we can't guess passively — DKIM may still be configured. A full review confirms it.";
  }

  // DMARC
  const dmarcTxt = await txtRecords(`_dmarc.${domain}`);
  const dmarcRecord =
    dmarcTxt.find((r) => r.toLowerCase().replace(/\s/g, "").startsWith("v=dmarc1")) ?? null;
  let dmarcPolicy: DnsCheckResults["dmarc"]["policy"] = "missing";
  let hasReporting = false;
  if (dmarcRecord) {
    const lower = dmarcRecord.toLowerCase().replace(/\s/g, "");
    const policyMatch = lower.match(/;p=([a-z]+)/) ?? lower.match(/\bp=([a-z]+)/);
    const policy = policyMatch?.[1];
    dmarcPolicy = policy === "reject" ? "reject" : policy === "quarantine" ? "quarantine" : "none";
    hasReporting = lower.includes("rua=");
  }

  return {
    domain,
    freeMailProvider,
    mx: { found: mxHosts.length > 0, provider, hosts: mxHosts.slice(0, 5), error: mxError },
    spf: {
      found: Boolean(spfRecord),
      record: spfRecord,
      policy: spfPolicy,
      multipleRecords: spfRecords.length > 1,
    },
    dkim: { m365SelectorsFound, googleSelectorFound, verifiable, note: dkimNote },
    dmarc: {
      found: Boolean(dmarcRecord),
      record: dmarcRecord,
      policy: dmarcPolicy,
      hasReporting,
    },
  };
}

/**
 * Idempotent database seed: residential service menu, 20 content-engine
 * topics, and the 4 launch articles (published).
 *
 * Usage: DATABASE_URL must be set. Run: npm run db:seed
 * (the npm script loads .env via tsx --env-file)
 */
import { getDb } from "../lib/db";
import { services, keywordQueue, posts } from "../lib/db/schema";
import { residentialServices } from "../lib/site";
import { launchArticles } from "../lib/content/articles";
import { eq } from "drizzle-orm";

const keywords: { topic: string; angle: string; sortOrder: number }[] = [
  { topic: "What ransomware actually costs a small Kentucky county", angle: "Government IT — written for Russell County fiscal-court readers; prevention vs. recovery math without fear-mongering", sortOrder: 1 },
  { topic: "MFA for courthouse offices: a plain-English rollout guide", angle: "Government IT — Jamestown / county-seat offices; how to roll out MFA without staff revolt", sortOrder: 2 },
  { topic: "The cyber-insurance questionnaire: how small offices should prepare", angle: "Government & business — what insurers ask and what honest answers require", sortOrder: 3 },
  { topic: "Microsoft 365 backup: what local businesses assume wrong", angle: "M365 security — Somerset businesses; retention vs. backup in plain terms", sortOrder: 4 },
  { topic: "Shared mailboxes done right in Microsoft 365", angle: "M365 — clerk's offices and front desks that share one inbox", sortOrder: 5 },
  { topic: "Email spoofing: why local businesses get fake invoice emails", angle: "Small-business security — Monticello angle; ties to the free health check", sortOrder: 6 },
  { topic: "Public Wi-Fi at city buildings: doing it safely", angle: "Government + networking — Columbia city buildings and libraries", sortOrder: 7 },
  { topic: "Guest Wi-Fi for restaurants and marinas around Lake Cumberland", angle: "Business Wi-Fi — seasonal lake businesses; keeping guests off the POS network", sortOrder: 8 },
  { topic: "VoIP for county offices: cutting the phone bill without cutting reliability", angle: "Phones — Albany / Clinton County offices watching every budget dollar", sortOrder: 9 },
  { topic: "What a business phone auto-attendant should say (and not say)", angle: "Phones — small-town offices; scripts that route callers without maddening them", sortOrder: 10 },
  { topic: "Security cameras for small-town shops: what actually matters", angle: "Cameras — Russell Springs storefronts; coverage, retention, and night image quality", sortOrder: 11 },
  { topic: "Fobs vs. keys: door access control for public buildings", angle: "Access control — courthouses and county buildings; lost-key math", sortOrder: 12 },
  { topic: "Windows end-of-support: what offices need to plan for", angle: "Business & government — planning replacements around budget cycles", sortOrder: 13 },
  { topic: "HIPAA-conscious IT habits for small medical practices", angle: "Medical offices — Somerset/Columbia practices; habits, not certifications", sortOrder: 14 },
  { topic: "Utility district IT: keeping billing systems safe and supported", angle: "Government — water/utility districts in the six-county area", sortOrder: 15 },
  { topic: "What a managed IT agreement should include (and what to avoid)", angle: "Business — plain-English contract literacy for office managers", sortOrder: 16 },
  { topic: "Scam calls claiming to be Microsoft: what locals should know", angle: "Residential — protecting parents and grandparents; what real support never does", sortOrder: 17 },
  { topic: "Backing up family photos: a simple plan that survives a dead laptop", angle: "Residential — lake-area households; the 3-2-1 idea at home", sortOrder: 18 },
  { topic: "Slow internet vs. slow Wi-Fi: telling the difference before you call your ISP", angle: "Residential — rural connections around the lake; router placement and honest limits", sortOrder: 19 },
  { topic: "Smart TVs and streaming on lake-house Wi-Fi", angle: "Residential — Jamestown/lake rentals and seasonal homes; buffering fixes", sortOrder: 20 },
];

async function main() {
  const db = getDb();

  console.log("Seeding services…");
  for (const s of residentialServices) {
    await db
      .insert(services)
      .values({
        slug: s.slug,
        name: s.name,
        priceCents: s.priceCents,
        kind: s.kind,
        durationMinutes: s.durationMinutes,
        bufferMinutes: s.bufferMinutes,
        active: true,
        sortOrder: residentialServices.indexOf(s),
      })
      .onConflictDoUpdate({
        target: services.slug,
        set: {
          name: s.name,
          priceCents: s.priceCents,
          kind: s.kind,
          durationMinutes: s.durationMinutes,
          bufferMinutes: s.bufferMinutes,
        },
      });
  }

  console.log("Seeding keyword queue…");
  const existing = await db.select({ topic: keywordQueue.topic }).from(keywordQueue);
  const existingTopics = new Set(existing.map((k) => k.topic));
  for (const k of keywords) {
    if (!existingTopics.has(k.topic)) {
      await db.insert(keywordQueue).values(k);
    }
  }

  console.log("Seeding launch articles…");
  for (const a of launchArticles) {
    const found = await db.select({ id: posts.id }).from(posts).where(eq(posts.slug, a.slug));
    if (found.length === 0) {
      await db.insert(posts).values({
        slug: a.slug,
        title: a.title,
        description: a.description,
        contentMd: a.contentMd,
        status: "published",
        source: "launch",
        publishedAt: new Date(`${a.publishedAt}T12:00:00Z`),
      });
    }
  }

  console.log("Seed complete.");
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

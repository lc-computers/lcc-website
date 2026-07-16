import Anthropic from "@anthropic-ai/sdk";
import { and, asc, desc, eq, gte } from "drizzle-orm";
import type { Db } from "@/lib/db";
import { keywordQueue, posts, newsletters, leads, suppression, nurtureQueue } from "@/lib/db/schema";
import { buildArticlePrompt, buildNewsletterPrompt } from "@/lib/prompts/draft";
import { site } from "@/lib/site";

const DRAFT_MODEL = "claude-sonnet-5";

export interface DraftResult {
  ok: boolean;
  postId?: string;
  title?: string;
  reason?: string;
}

/** Draft the next queued topic into the posts table (status: draft). */
export async function draftNextArticle(db: Db): Promise<DraftResult> {
  if (!process.env.ANTHROPIC_API_KEY) {
    return { ok: false, reason: "ANTHROPIC_API_KEY is not configured" };
  }
  const [keyword] = await db
    .select()
    .from(keywordQueue)
    .where(eq(keywordQueue.status, "pending"))
    .orderBy(asc(keywordQueue.sortOrder), asc(keywordQueue.createdAt))
    .limit(1);
  if (!keyword) {
    return { ok: false, reason: "Keyword queue is empty — add topics in the database" };
  }

  const client = new Anthropic();
  const response = await client.messages.create({
    model: DRAFT_MODEL,
    max_tokens: 4000,
    system: buildArticlePrompt(),
    messages: [
      {
        role: "user",
        content: `Topic: ${keyword.topic}\nAngle: ${keyword.angle}`,
      },
    ],
    tools: [
      {
        name: "submit_article",
        description: "Submit the finished article draft",
        input_schema: {
          type: "object" as const,
          properties: {
            title: { type: "string", description: "Article headline" },
            slug: {
              type: "string",
              description: "URL slug: lowercase words separated by hyphens",
            },
            description: {
              type: "string",
              description: "Meta description, 120-160 characters, plain and enticing",
            },
            contentMd: { type: "string", description: "Full article body in markdown, 700-1000 words" },
          },
          required: ["title", "slug", "description", "contentMd"],
        },
      },
    ],
    tool_choice: { type: "tool", name: "submit_article" },
  });

  const toolUse = response.content.find((b) => b.type === "tool_use");
  if (!toolUse || toolUse.type !== "tool_use") {
    return { ok: false, reason: "Model returned no draft" };
  }
  const draft = toolUse.input as { title: string; slug: string; description: string; contentMd: string };
  const slug = draft.slug
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 80);

  // Keep slugs unique — suffix if a post already claimed it.
  const [existing] = await db.select({ id: posts.id }).from(posts).where(eq(posts.slug, slug));
  const finalSlug = existing ? `${slug}-${Date.now().toString(36)}` : slug;

  const [inserted] = await db
    .insert(posts)
    .values({
      slug: finalSlug,
      title: draft.title,
      description: draft.description,
      contentMd: draft.contentMd,
      status: "draft",
      source: "ai",
      keywordId: keyword.id,
    })
    .returning({ id: posts.id });

  await db
    .update(keywordQueue)
    .set({ status: "drafted", usedAt: new Date() })
    .where(eq(keywordQueue.id, keyword.id));

  return { ok: true, postId: inserted?.id, title: draft.title };
}

/** Draft the monthly newsletter digest (status: draft) for admin approval. */
export async function draftMonthlyNewsletter(db: Db): Promise<DraftResult> {
  if (!process.env.ANTHROPIC_API_KEY) {
    return { ok: false, reason: "ANTHROPIC_API_KEY is not configured" };
  }
  const monthAgo = new Date(Date.now() - 31 * 24 * 3600_000);
  const recent = await db
    .select({ title: posts.title, description: posts.description, slug: posts.slug })
    .from(posts)
    .where(and(eq(posts.status, "published"), gte(posts.publishedAt, monthAgo)))
    .orderBy(desc(posts.publishedAt))
    .limit(6);

  const client = new Anthropic();
  const response = await client.messages.create({
    model: DRAFT_MODEL,
    max_tokens: 2000,
    system: buildNewsletterPrompt(),
    messages: [
      {
        role: "user",
        content:
          recent.length > 0
            ? `This month's published posts:\n${recent
                .map((p) => `- "${p.title}" — ${p.description} — ${site.url}/blog/${p.slug}`)
                .join("\n")}`
            : `No new posts were published this month — skip the blog section and make the security tip the centerpiece, plus a reminder that the blog lives at ${site.url}/blog.`,
      },
    ],
    tools: [
      {
        name: "submit_newsletter",
        description: "Submit the finished newsletter draft",
        input_schema: {
          type: "object" as const,
          properties: {
            subject: { type: "string", description: "Subject line, under 60 chars" },
            contentMd: { type: "string", description: "Newsletter body in markdown" },
          },
          required: ["subject", "contentMd"],
        },
      },
    ],
    tool_choice: { type: "tool", name: "submit_newsletter" },
  });

  const toolUse = response.content.find((b) => b.type === "tool_use");
  if (!toolUse || toolUse.type !== "tool_use") {
    return { ok: false, reason: "Model returned no draft" };
  }
  const draft = toolUse.input as { subject: string; contentMd: string };
  const [inserted] = await db
    .insert(newsletters)
    .values({ subject: draft.subject, contentMd: draft.contentMd, status: "draft" })
    .returning({ id: newsletters.id });
  return { ok: true, postId: inserted?.id, title: draft.subject };
}

/**
 * Queue an approved newsletter to the nurture list: distinct health-check
 * lead emails, minus suppression (re-checked again at send time).
 */
export async function sendNewsletter(db: Db, newsletterId: string): Promise<{ ok: boolean; queued: number; reason?: string }> {
  const [newsletter] = await db.select().from(newsletters).where(eq(newsletters.id, newsletterId));
  if (!newsletter) return { ok: false, queued: 0, reason: "Newsletter not found" };
  if (newsletter.status === "sent") return { ok: false, queued: 0, reason: "Already sent" };

  const rows = await db
    .selectDistinct({ email: leads.email, name: leads.name })
    .from(leads)
    .where(and(eq(leads.source, "health_check")));
  const suppressed = await db.select({ email: suppression.email }).from(suppression);
  const suppressedSet = new Set(suppressed.map((s) => s.email));

  const seen = new Set<string>();
  const recipients: { email: string; name: string | null }[] = [];
  for (const row of rows) {
    const email = row.email?.toLowerCase();
    if (!email || seen.has(email) || suppressedSet.has(email)) continue;
    seen.add(email);
    recipients.push({ email, name: row.name });
  }

  if (recipients.length > 0) {
    await db.insert(nurtureQueue).values(
      recipients.map((r) => ({
        email: r.email,
        name: r.name,
        templateKey: "newsletter",
        sendAt: new Date(),
        meta: { newsletterId },
      }))
    );
  }
  await db
    .update(newsletters)
    .set({ status: "sent", sentAt: new Date(), recipientCount: recipients.length })
    .where(eq(newsletters.id, newsletterId));
  return { ok: true, queued: recipients.length };
}

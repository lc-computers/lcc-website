import { and, eq, isNull, lt } from "drizzle-orm";
import type { Db } from "@/lib/db";
import { chatSessions } from "@/lib/db/schema";
import { notifyLead } from "@/lib/email/internal";
import { escapeHtml } from "@/lib/email/layout";

/**
 * Closes chat sessions idle for 1+ hour. Safety net: if a session captured a
 * lead but the per-turn notification never went out, the transcript summary
 * is emailed at close time.
 */
export async function closeStaleChatSessions(db: Db): Promise<Record<string, number>> {
  const counts: Record<string, number> = { closed: 0, lead_emails: 0 };
  const cutoff = new Date(Date.now() - 60 * 60 * 1000);

  const stale = await db
    .select()
    .from(chatSessions)
    .where(and(isNull(chatSessions.closedAt), lt(chatSessions.lastActiveAt, cutoff)))
    .limit(100);

  for (const session of stale) {
    await db
      .update(chatSessions)
      .set({ closedAt: new Date() })
      .where(eq(chatSessions.id, session.id));
    counts.closed = (counts.closed ?? 0) + 1;

    if (session.leadCaptured && !session.leadEmailSentAt && session.messages.length > 0) {
      try {
        const transcript = session.messages
          .map(
            (m) =>
              `<p style="margin:0 0 8px;"><strong>${m.role === "user" ? "Visitor" : "Assistant"}:</strong> ${escapeHtml(m.content)}</p>`
          )
          .join("");
        const sent = await notifyLead({
          source: "Chat agent",
          subject: "Chat lead (captured at session close)",
          fields: { "Session started": session.createdAt.toISOString() },
          bodyHtml: `<h2 style="font-family:Georgia,serif;font-size:18px;">Transcript</h2>${transcript}`,
        });
        if (sent.ok) {
          await db
            .update(chatSessions)
            .set({ leadEmailSentAt: new Date() })
            .where(eq(chatSessions.id, session.id));
          counts.lead_emails = (counts.lead_emails ?? 0) + 1;
        }
      } catch (err) {
        console.error(`chat-closeout: lead email failed for ${session.id}`, err);
      }
    }
  }
  return counts;
}

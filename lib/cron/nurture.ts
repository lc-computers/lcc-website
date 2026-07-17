import { and, eq, isNull, lte } from "drizzle-orm";
import type { Db } from "@/lib/db";
import { nurtureQueue, suppression, newsletters } from "@/lib/db/schema";
import { sendEmail } from "@/lib/email/send";
import { nurtureDay3Email, nurtureDay7Email, newsletterEmail } from "@/lib/email/marketing";

/**
 * Processes due nurture_queue rows. The suppression table is checked before
 * EVERY send — suppressed addresses are marked canceled, never mailed.
 * Transactional email does not pass through here.
 */
export async function runNurtureQueue(db: Db): Promise<Record<string, number>> {
  const counts: Record<string, number> = { sent: 0, suppressed: 0, errors: 0 };

  const due = await db
    .select()
    .from(nurtureQueue)
    .where(and(lte(nurtureQueue.sendAt, new Date()), isNull(nurtureQueue.sentAt), isNull(nurtureQueue.canceledAt)))
    .limit(50);

  for (const item of due) {
    const email = item.email.toLowerCase();

    // Claim first — concurrent runs can't double-send.
    const claimed = await db
      .update(nurtureQueue)
      .set({ sentAt: new Date() })
      .where(and(eq(nurtureQueue.id, item.id), isNull(nurtureQueue.sentAt), isNull(nurtureQueue.canceledAt)))
      .returning({ id: nurtureQueue.id });
    if (claimed.length === 0) continue;

    // Suppression check at send time.
    const [suppressed] = await db.select().from(suppression).where(eq(suppression.email, email));
    if (suppressed) {
      await db
        .update(nurtureQueue)
        .set({ sentAt: null, canceledAt: new Date() })
        .where(eq(nurtureQueue.id, item.id));
      counts.suppressed = (counts.suppressed ?? 0) + 1;
      continue;
    }

    try {
      const firstName = item.name ? (item.name.split(" ")[0] ?? null) : null;
      let message: { subject: string; html: string; unsubscribeUrl: string } | null = null;

      if (item.templateKey === "hc_day3_article") {
        message = nurtureDay3Email(email, firstName);
      } else if (item.templateKey === "hc_day7_walkthrough") {
        message = nurtureDay7Email(email, firstName);
      } else if (item.templateKey === "newsletter") {
        const newsletterId = item.meta?.newsletterId;
        if (typeof newsletterId === "string") {
          const [n] = await db.select().from(newsletters).where(eq(newsletters.id, newsletterId));
          if (n) message = newsletterEmail(email, n.subject, n.contentMd);
        }
      }

      if (!message) {
        console.error(`nurture: unknown/incomplete template ${item.templateKey} (${item.id})`);
        await db
          .update(nurtureQueue)
          .set({ sentAt: null, canceledAt: new Date() })
          .where(eq(nurtureQueue.id, item.id));
        continue;
      }

      const result = await sendEmail({
        to: email,
        subject: message.subject,
        html: message.html,
        unsubscribeUrl: message.unsubscribeUrl,
      });
      if (result.ok) {
        counts.sent = (counts.sent ?? 0) + 1;
      } else {
        // Release the claim so the next run retries instead of recording a
        // failed send as delivered.
        await db
          .update(nurtureQueue)
          .set({ sentAt: null })
          .where(eq(nurtureQueue.id, item.id));
        counts.errors = (counts.errors ?? 0) + 1;
      }
    } catch (err) {
      console.error(`nurture: send failed for ${item.id}`, err);
      try {
        await db.update(nurtureQueue).set({ sentAt: null }).where(eq(nurtureQueue.id, item.id));
      } catch {
        // claim stays — better one lost retry than a double-send loop
      }
      counts.errors = (counts.errors ?? 0) + 1;
    }
  }

  return counts;
}

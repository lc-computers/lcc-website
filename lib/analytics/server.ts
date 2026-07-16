import { getDb, hasDb } from "@/lib/db";
import { events } from "@/lib/db/schema";

/**
 * Server-side conversion event tracking → events table.
 * Never throws; analytics must never break a request.
 */
export async function trackServer(
  name: string,
  props?: Record<string, string | number>
): Promise<void> {
  try {
    if (!hasDb()) {
      console.log(`[event] ${name}`, props ?? {});
      return;
    }
    await getDb().insert(events).values({ name, props: props ?? {} });
  } catch (err) {
    console.error(`analytics: failed to record ${name}`, err);
  }
}

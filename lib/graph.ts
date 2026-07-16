import { site } from "@/lib/site";
import { formatDateTime } from "@/lib/format";

/**
 * Microsoft Graph integration for the shared "Service Appointments" calendar.
 * Uses the client-credentials flow against the Graph REST API directly.
 *
 * Graceful degradation: if the MSGRAPH_* env vars are absent, isGraphConfigured()
 * is false, availability falls back to DB-only, and event writes are no-ops.
 * Graph failures never block a booking — they log and continue.
 */

export function isGraphConfigured(): boolean {
  return Boolean(
    process.env.MSGRAPH_TENANT_ID &&
      process.env.MSGRAPH_CLIENT_ID &&
      process.env.MSGRAPH_CLIENT_SECRET &&
      process.env.MSGRAPH_CALENDAR_USER
  );
}

let tokenCache: { token: string; expiresAt: number } | null = null;

async function getToken(): Promise<string> {
  if (tokenCache && tokenCache.expiresAt > Date.now() + 60_000) {
    return tokenCache.token;
  }
  const tenant = process.env.MSGRAPH_TENANT_ID;
  const res = await fetch(`https://login.microsoftonline.com/${tenant}/oauth2/v2.0/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: process.env.MSGRAPH_CLIENT_ID ?? "",
      client_secret: process.env.MSGRAPH_CLIENT_SECRET ?? "",
      scope: "https://graph.microsoft.com/.default",
      grant_type: "client_credentials",
    }),
  });
  if (!res.ok) {
    throw new Error(`graph: token request failed (${res.status})`);
  }
  const data = (await res.json()) as { access_token: string; expires_in: number };
  tokenCache = { token: data.access_token, expiresAt: Date.now() + data.expires_in * 1000 };
  return data.access_token;
}

function calendarBase(): string {
  const user = encodeURIComponent(process.env.MSGRAPH_CALENDAR_USER ?? "");
  return `https://graph.microsoft.com/v1.0/users/${user}`;
}

export interface GraphBusyBlock {
  id: string;
  start: Date;
  end: Date;
}

/**
 * Busy events on the shared calendar in [from, to). Returns [] when Graph is
 * not configured or errors (callers already count DB bookings).
 */
export async function getBusyBlocks(from: Date, to: Date): Promise<GraphBusyBlock[]> {
  if (!isGraphConfigured()) return [];
  try {
    const token = await getToken();
    const params = new URLSearchParams({
      startDateTime: from.toISOString(),
      endDateTime: to.toISOString(),
      $select: "id,showAs,start,end",
      $top: "200",
    });
    const res = await fetch(`${calendarBase()}/calendarView?${params}`, {
      headers: { Authorization: `Bearer ${token}`, Prefer: 'outlook.timezone="UTC"' },
    });
    if (!res.ok) {
      console.error(`graph: calendarView failed (${res.status})`);
      return [];
    }
    const data = (await res.json()) as {
      value: {
        id: string;
        showAs?: string;
        start: { dateTime: string };
        end: { dateTime: string };
      }[];
    };
    return data.value
      .filter((e) => e.showAs !== "free")
      .map((e) => ({
        id: e.id,
        start: new Date(`${e.start.dateTime}Z`),
        end: new Date(`${e.end.dateTime}Z`),
      }));
  } catch (err) {
    console.error("graph: getBusyBlocks failed", err);
    return [];
  }
}

export interface GraphEventInput {
  customerName: string;
  serviceName: string;
  phone: string;
  address?: string;
  start: Date;
  end: Date;
  bookingId: string;
}

/** Create the appointment on the shared calendar. Returns event id or null. */
export async function createCalendarEvent(input: GraphEventInput): Promise<string | null> {
  if (!isGraphConfigured()) return null;
  try {
    const token = await getToken();
    const res = await fetch(`${calendarBase()}/events`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        subject: `${input.serviceName} — ${input.customerName}`,
        body: {
          contentType: "text",
          content: [
            `Customer: ${input.customerName}`,
            `Service: ${input.serviceName}`,
            input.address ? `Address: ${input.address}` : `Remote session — call ${input.phone}`,
            `Phone: ${input.phone}`,
            `When: ${formatDateTime(input.start)}`,
            `Booking: ${site.url}/admin (id ${input.bookingId})`,
          ].join("\n"),
        },
        start: { dateTime: input.start.toISOString(), timeZone: "UTC" },
        end: { dateTime: input.end.toISOString(), timeZone: "UTC" },
        showAs: "busy",
        transactionId: input.bookingId, // idempotency: Graph dedupes on retry
      }),
    });
    if (!res.ok) {
      console.error(`graph: create event failed (${res.status})`, await res.text());
      return null;
    }
    const data = (await res.json()) as { id: string };
    return data.id;
  } catch (err) {
    console.error("graph: createCalendarEvent failed", err);
    return null;
  }
}

export async function updateCalendarEvent(
  eventId: string,
  start: Date,
  end: Date
): Promise<boolean> {
  if (!isGraphConfigured()) return false;
  try {
    const token = await getToken();
    const res = await fetch(`${calendarBase()}/events/${encodeURIComponent(eventId)}`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        start: { dateTime: start.toISOString(), timeZone: "UTC" },
        end: { dateTime: end.toISOString(), timeZone: "UTC" },
      }),
    });
    return res.ok;
  } catch (err) {
    console.error("graph: updateCalendarEvent failed", err);
    return false;
  }
}

export async function deleteCalendarEvent(eventId: string): Promise<boolean> {
  if (!isGraphConfigured()) return false;
  try {
    const token = await getToken();
    const res = await fetch(`${calendarBase()}/events/${encodeURIComponent(eventId)}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.ok || res.status === 404;
  } catch (err) {
    console.error("graph: deleteCalendarEvent failed", err);
    return false;
  }
}

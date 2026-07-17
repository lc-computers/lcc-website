import { NextResponse, after } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";
import { and, eq } from "drizzle-orm";
import { getDb, hasDb } from "@/lib/db";
import { chatSessions, leads } from "@/lib/db/schema";
import { buildChatSystemPrompt } from "@/lib/prompts/chat";
import { extractLead } from "@/lib/chat/extract";
import { notifyLead } from "@/lib/email/internal";
import { escapeHtml } from "@/lib/email/layout";
import { trackServer } from "@/lib/analytics/server";
import { rateLimit, clientIp } from "@/lib/rate-limit";
import { site } from "@/lib/site";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

const CHAT_MODEL = "claude-sonnet-5";
/** Messages sent to the model per turn (persistence keeps more). */
const MODEL_CONTEXT = 24;
/** Messages retained in the stored transcript. */
const STORED_LIMIT = 60;

const bodySchema = z.object({
  sessionKey: z.string().min(10).max(64).regex(/^[\w-]+$/),
  message: z.string().trim().min(1).max(2000),
  // Used only when no database is configured (stateless fallback).
  history: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().max(4000),
      })
    )
    .max(MODEL_CONTEXT)
    .optional(),
});

type ChatMessage = { role: "user" | "assistant"; content: string; at: string };

const FALLBACK = `I'm having trouble connecting right now — please call us at ${site.phone.display} (${site.hours.short}) and a real person will help.`;

export async function POST(req: Request) {
  const limit = await rateLimit({
    name: "chat",
    identifier: clientIp(req),
    limit: 40,
    windowSeconds: 3600,
  });
  if (!limit.ok) {
    return NextResponse.json(
      { error: `You've reached the chat limit for now — call us at ${site.phone.display}.` },
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
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
  const { sessionKey, message } = parsed.data;

  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ error: FALLBACK }, { status: 503 });
  }

  // Load or create the server-side transcript (source of truth when DB exists)
  let fullHistory: ChatMessage[] = [];
  let sessionId: string | null = null;
  if (hasDb()) {
    try {
      const db = getDb();
      const [existing] = await db
        .select()
        .from(chatSessions)
        .where(eq(chatSessions.sessionKey, sessionKey));
      if (existing) {
        sessionId = existing.id;
        fullHistory = existing.messages;
      } else {
        const [created] = await db
          .insert(chatSessions)
          .values({ sessionKey, messages: [] })
          .onConflictDoNothing()
          .returning({ id: chatSessions.id });
        if (created) {
          sessionId = created.id;
        } else {
          const [raced] = await db
            .select()
            .from(chatSessions)
            .where(eq(chatSessions.sessionKey, sessionKey));
          sessionId = raced?.id ?? null;
          fullHistory = raced?.messages ?? [];
        }
      }
    } catch (err) {
      console.error("chat: session load failed (continuing stateless)", err);
    }
  } else if (parsed.data.history) {
    fullHistory = parsed.data.history.map((m) => ({ ...m, at: new Date().toISOString() }));
  }

  const userMessage: ChatMessage = {
    role: "user",
    content: message,
    at: new Date().toISOString(),
  };
  const modelContext = [...fullHistory, userMessage].slice(-MODEL_CONTEXT);

  const anthropic = new Anthropic();
  let assistantText = "";
  let clientGone = false;
  let resolveDone!: () => void;
  const done = new Promise<void>((resolve) => {
    resolveDone = resolve;
  });

  const encoder = new TextEncoder();
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        const runner = anthropic.messages.stream({
          model: CHAT_MODEL,
          max_tokens: 700,
          system: buildChatSystemPrompt(),
          messages: modelContext.map((m) => ({ role: m.role, content: m.content })),
        });
        runner.on("text", (text) => {
          assistantText += text;
          if (clientGone) return;
          try {
            controller.enqueue(encoder.encode(text));
          } catch {
            clientGone = true; // client disconnected mid-stream
          }
        });
        await runner.finalMessage();
      } catch (err) {
        console.error("chat: stream failed", err);
        if (assistantText.length === 0) {
          assistantText = FALLBACK;
          if (!clientGone) {
            try {
              controller.enqueue(encoder.encode(FALLBACK));
            } catch {
              clientGone = true;
            }
          }
        }
      } finally {
        // Resolve FIRST — close() throws if the client already canceled, and
        // persistence below must run either way.
        resolveDone();
        try {
          controller.close();
        } catch {
          // stream already canceled by the client
        }
      }
    },
    cancel() {
      clientGone = true;
    },
  });

  // Persistence + lead extraction after the response finishes streaming.
  after(async () => {
    await done;
    if (!hasDb() || !assistantText) return;
    try {
      const db = getDb();
      const assistantMessage: ChatMessage = {
        role: "assistant",
        content: assistantText,
        at: new Date().toISOString(),
      };
      const fullTranscript = [...fullHistory, userMessage, assistantMessage];
      if (sessionId) {
        await db
          .update(chatSessions)
          .set({
            messages: fullTranscript.slice(-STORED_LIMIT),
            lastActiveAt: new Date(),
            closedAt: null,
          })
          .where(eq(chatSessions.id, sessionId));
      }

      if (!sessionId) return;

      // Atomically claim lead capture for this session so overlapping turns
      // can never double-extract or double-notify.
      const claimed = await db
        .update(chatSessions)
        .set({ leadCaptured: true })
        .where(and(eq(chatSessions.id, sessionId), eq(chatSessions.leadCaptured, false)))
        .returning({ id: chatSessions.id });
      if (claimed.length === 0) return; // already captured (or being captured)

      const extracted = await extractLead(
        fullTranscript.map((m) => ({ role: m.role, content: m.content }))
      );
      if (!extracted?.hasContactInfo || (!extracted.email && !extracted.phone)) {
        // Nothing captured yet — release the claim for future turns.
        await db
          .update(chatSessions)
          .set({ leadCaptured: false })
          .where(eq(chatSessions.id, sessionId));
        return;
      }

      await db.insert(leads).values({
        name: extracted.name,
        email: extracted.email,
        phone: extracted.phone,
        organization: extracted.organization,
        source: "chat",
        message: extracted.summary,
        meta: { track: extracted.track, urgency: extracted.urgency, sessionKey },
      });
      const transcriptHtml = fullTranscript
        .slice(-16)
        .map(
          (m) =>
            `<p style="margin:0 0 8px;"><strong>${m.role === "user" ? "Visitor" : "Assistant"}:</strong> ${escapeHtml(m.content)}</p>`
        )
        .join("");
      const sent = await notifyLead({
        source: "Chat agent",
        subject: `Chat lead: ${extracted.name ?? extracted.email ?? extracted.phone}${extracted.urgency === "emergency" ? " — URGENT" : ""}`,
        fields: {
          Name: extracted.name,
          Email: extracted.email,
          Phone: extracted.phone,
          Organization: extracted.organization,
          Track: extracted.track,
          Urgency: extracted.urgency,
          Summary: extracted.summary,
        },
        bodyHtml: `<h2 style="font-family:Georgia,serif;font-size:18px;">Recent transcript</h2>${transcriptHtml}`,
      });
      if (sent.ok) {
        // Only stamp on real delivery — otherwise the chat-closeout cron's
        // safety net re-sends the summary at session close.
        await db
          .update(chatSessions)
          .set({ leadEmailSentAt: new Date() })
          .where(eq(chatSessions.id, sessionId));
      }
      await trackServer("chat_lead_captured", { track: extracted.track });
    } catch (err) {
      console.error("chat: post-turn processing failed", err);
    }
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Accel-Buffering": "no",
    },
  });
}

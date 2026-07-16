"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
import { Loader2, SendHorizonal } from "lucide-react";
import { Mark } from "@/components/brand/Mark";
import { site } from "@/lib/site";

interface Msg {
  role: "user" | "assistant";
  content: string;
}

const GREETING = `Hi — you've reached ${site.name} in Russell Springs. Tell me what's going on with your computers (home or office) and I'll point you the right way.`;

function getSessionKey(): string {
  try {
    const existing = localStorage.getItem("lcc-chat-key");
    if (existing) return existing;
    const key = crypto.randomUUID();
    localStorage.setItem("lcc-chat-key", key);
    return key;
  } catch {
    return `s-${Math.random().toString(36).slice(2)}${Date.now().toString(36)}`;
  }
}

function loadStored(key: string): Msg[] {
  try {
    const raw = sessionStorage.getItem(`lcc-chat-${key}`);
    if (!raw) return [];
    return JSON.parse(raw) as Msg[];
  } catch {
    return [];
  }
}

/** Renders assistant text: markdown links, bare site paths, phone, bold. */
function renderMessage(text: string): ReactNode[] {
  const out: ReactNode[] = [];
  // [label](url-or-path)
  const linkRe = /\[([^\]]+)\]\((\/[^\s)]*|https?:\/\/[^\s)]+)\)/g;
  let last = 0;
  let match: RegExpExecArray | null;
  let key = 0;
  const pushText = (chunk: string) => {
    // bare internal paths
    const pathRe = /(\/(?:book|health-check|home-services|services|government|contact|about|blog|areas)[\w\-/?=&]*)/g;
    let t = 0;
    let m: RegExpExecArray | null;
    while ((m = pathRe.exec(chunk)) !== null) {
      if (m.index > t) out.push(renderPlain(chunk.slice(t, m.index), key++));
      out.push(
        <a key={`l${key++}`} href={m[1]} className="font-semibold text-navy-700 underline underline-offset-2">
          {m[1]}
        </a>
      );
      t = m.index + m[0].length;
    }
    if (t < chunk.length) out.push(renderPlain(chunk.slice(t), key++));
  };
  while ((match = linkRe.exec(text)) !== null) {
    if (match.index > last) pushText(text.slice(last, match.index));
    const href = match[2] ?? "";
    const external = href.startsWith("http");
    out.push(
      <a
        key={`a${key++}`}
        href={href}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        className="font-semibold text-navy-700 underline underline-offset-2"
      >
        {match[1]}
      </a>
    );
    last = match.index + match[0].length;
  }
  if (last < text.length) pushText(text.slice(last));
  return out;
}

function renderPlain(chunk: string, key: number): ReactNode {
  // phone number → tel link; **bold** → strong
  const parts: ReactNode[] = [];
  const phoneRe = /\(270\)\s?866-8660/g;
  let t = 0;
  let m: RegExpExecArray | null;
  let k = 0;
  while ((m = phoneRe.exec(chunk)) !== null) {
    if (m.index > t) parts.push(renderBold(chunk.slice(t, m.index), k++));
    parts.push(
      <a key={`p${k++}`} href={site.phone.tel} className="font-bold text-navy-700 underline underline-offset-2">
        {m[0]}
      </a>
    );
    t = m.index + m[0].length;
  }
  if (t < chunk.length) parts.push(renderBold(chunk.slice(t), k++));
  return <span key={`s${key}`}>{parts}</span>;
}

function renderBold(chunk: string, key: number): ReactNode {
  const pieces = chunk.split(/\*\*([^*]+)\*\*/g);
  if (pieces.length === 1) return <span key={`b${key}`}>{chunk}</span>;
  return (
    <span key={`b${key}`}>
      {pieces.map((piece, i) =>
        i % 2 === 1 ? <strong key={i}>{piece}</strong> : <span key={i}>{piece}</span>
      )}
    </span>
  );
}

export function ChatPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [sessionKey] = useState(getSessionKey);
  const [messages, setMessages] = useState<Msg[]>(() => loadStored(getSessionKey()));
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // persist thread across page navigations
  useEffect(() => {
    try {
      sessionStorage.setItem(`lcc-chat-${sessionKey}`, JSON.stringify(messages.slice(-40)));
    } catch {
      // storage full/blocked — chat still works for this page view
    }
  }, [messages, sessionKey]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const scrollDown = useCallback(() => {
    requestAnimationFrame(() => {
      listRef.current?.scrollTo({ top: listRef.current.scrollHeight });
    });
  }, []);

  useEffect(scrollDown, [messages, scrollDown]);

  async function send(e: FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text || streaming) return;
    setInput("");
    const history = messages;
    setMessages((prev) => [...prev, { role: "user", content: text }, { role: "assistant", content: "" }]);
    setStreaming(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionKey,
          message: text,
          history: history.slice(-20),
        }),
      });
      if (!res.ok || !res.body) {
        const data = (await res.json().catch(() => null)) as { error?: string } | null;
        throw new Error(data?.error ?? "");
      }
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        setMessages((prev) => {
          const next = [...prev];
          const lastMsg = next[next.length - 1];
          if (lastMsg?.role === "assistant") {
            next[next.length - 1] = { ...lastMsg, content: lastMsg.content + chunk };
          }
          return next;
        });
      }
    } catch (err) {
      const fallback =
        err instanceof Error && err.message
          ? err.message
          : `I'm having trouble connecting — call us at ${site.phone.display} and a real person will help.`;
      setMessages((prev) => {
        const next = [...prev];
        const lastMsg = next[next.length - 1];
        if (lastMsg?.role === "assistant" && lastMsg.content === "") {
          next[next.length - 1] = { ...lastMsg, content: fallback };
        }
        return next;
      });
    } finally {
      setStreaming(false);
      inputRef.current?.focus();
    }
  }

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-label={`Chat with ${site.name}`}
      className="fixed bottom-24 right-4 z-50 flex max-h-[min(38rem,calc(100dvh-8rem))] w-[min(24rem,calc(100vw-2rem))] flex-col overflow-hidden rounded-lg border border-cream-200 bg-white shadow-card-hover"
    >
      <header className="flex items-center gap-3 border-b-2 border-brass-500 bg-navy-900 px-4 py-3">
        <Mark className="h-7 w-7 text-cream-50" />
        <div>
          <h2 className="font-serif text-base font-semibold leading-tight text-cream-50">
            {site.name}
          </h2>
          <p className="text-xs text-navy-200">
            Instant answers · or call {site.phone.display}
          </p>
        </div>
      </header>

      <div
        ref={listRef}
        className="flex-1 space-y-3 overflow-y-auto scroll-smooth px-4 py-4"
        aria-live="polite"
      >
        <Bubble role="assistant">{renderMessage(GREETING)}</Bubble>
        {messages.map((m, i) => (
          <Bubble key={i} role={m.role}>
            {m.content === "" && m.role === "assistant" && streaming ? (
              <span className="inline-flex items-center gap-1.5 text-ink-500">
                <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
                typing…
              </span>
            ) : (
              renderMessage(m.content)
            )}
          </Bubble>
        ))}
      </div>

      <form onSubmit={send} className="flex items-center gap-2 border-t border-cream-200 p-3">
        <label htmlFor="chat-input" className="sr-only">
          Type your message
        </label>
        <input
          id="chat-input"
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          maxLength={2000}
          placeholder="Type your question…"
          autoComplete="off"
          className="min-w-0 flex-1 rounded-md border border-cream-300 px-3.5 py-2.5 text-sm text-ink-900 placeholder:text-ink-500/50 focus:border-navy-500"
        />
        <button
          type="submit"
          disabled={streaming || input.trim().length === 0}
          aria-label="Send message"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-navy-700 text-cream-50 transition-colors hover:bg-navy-800 disabled:opacity-50"
        >
          <SendHorizonal className="h-4.5 w-4.5" aria-hidden="true" />
        </button>
      </form>
      <p className="border-t border-cream-100 px-4 py-2 text-[0.68rem] leading-snug text-ink-500">
        AI assistant — it can make mistakes. Never share passwords or card numbers in chat.
      </p>
    </div>
  );
}

function Bubble({ role, children }: { role: "user" | "assistant"; children: ReactNode }) {
  return (
    <div className={role === "user" ? "flex justify-end" : "flex justify-start"}>
      <div
        className={`max-w-[85%] whitespace-pre-wrap rounded-lg px-3.5 py-2.5 text-sm leading-relaxed ${
          role === "user"
            ? "bg-navy-700 text-cream-50"
            : "border border-cream-200 bg-cream-100 text-ink-900"
        }`}
      >
        {children}
      </div>
    </div>
  );
}

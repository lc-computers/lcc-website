"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { MessageCircle, X } from "lucide-react";
import { track } from "@/lib/analytics/client";

// The panel (and its logic) loads only when someone opens the chat —
// zero cost to first paint on every page.
const ChatPanel = dynamic(() => import("./ChatPanel").then((m) => m.ChatPanel), {
  ssr: false,
  loading: () => (
    <div className="fixed bottom-24 right-4 z-50 w-[min(24rem,calc(100vw-2rem))] rounded-lg border border-cream-200 bg-white p-6 text-sm text-ink-500 shadow-card-hover">
      Opening chat…
    </div>
  ),
});

export function ChatLauncher() {
  const [open, setOpen] = useState(false);
  const [everOpened, setEverOpened] = useState(false);

  function toggle() {
    const next = !open;
    setOpen(next);
    if (next && !everOpened) {
      setEverOpened(true);
      track("chat_opened");
    }
  }

  return (
    <>
      {everOpened ? <ChatPanel open={open} onClose={() => setOpen(false)} /> : null}
      <button
        type="button"
        onClick={toggle}
        aria-expanded={open}
        aria-label={open ? "Close chat" : "Chat with us"}
        className="fixed bottom-4 right-4 z-50 flex h-14 items-center gap-2 rounded-full bg-navy-700 px-5 text-cream-50 shadow-card-hover transition-colors hover:bg-navy-800"
      >
        {open ? (
          <X className="h-6 w-6" aria-hidden="true" />
        ) : (
          <>
            <MessageCircle className="h-6 w-6" aria-hidden="true" />
            <span className="text-sm font-semibold">Chat with us</span>
          </>
        )}
      </button>
    </>
  );
}

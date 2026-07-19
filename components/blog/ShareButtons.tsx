"use client";

import { useEffect, useState } from "react";
import { Mail, Link2, Check, Share2 } from "lucide-react";
import { track } from "@/lib/analytics/client";

/** Facebook "f" glyph as a single-color inline mark (Lucide dropped brand
 *  icons in v1). Rendered monochrome in currentColor to match the site's
 *  institutional palette — never Facebook blue. */
function FacebookMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.79-4.69 4.53-4.69 1.31 0 2.68.24 2.68.24v2.97h-1.51c-1.49 0-1.96.93-1.96 1.89v2.25h3.33l-.53 3.49h-2.8V24C19.61 23.1 24 18.1 24 12.07Z" />
    </svg>
  );
}

/** Small share bar for blog posts. No third-party SDKs or trackers — plain
 *  share-intent links plus the native Web Share sheet where the browser
 *  supports it. Every share fires a `post_shared` analytics event. */
export function ShareButtons({
  url,
  title,
  slug,
  className = "",
}: {
  url: string;
  title: string;
  slug: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);
  const [canNativeShare, setCanNativeShare] = useState(false);

  // Detect Web Share support after mount so SSR and first client render match.
  useEffect(() => {
    setCanNativeShare(typeof navigator !== "undefined" && typeof navigator.share === "function");
  }, []);

  function fire(network: string) {
    track("post_shared", { network, slug });
  }

  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
  const emailUrl = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(
    `Thought this might be useful:\n\n${title}\n${url}`
  )}`;

  async function copyLink() {
    let ok = false;
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(url);
        ok = true;
      } else {
        // Fallback for non-secure contexts / older browsers.
        const ta = document.createElement("textarea");
        ta.value = url;
        ta.style.position = "fixed";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.select();
        ok = document.execCommand("copy");
        document.body.removeChild(ta);
      }
    } catch {
      ok = false;
    }
    if (ok) {
      fire("copy");
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    }
  }

  async function nativeShare() {
    try {
      await navigator.share({ title, url });
      fire("native");
    } catch {
      // User dismissed the sheet, or the browser blocked it — nothing to do.
    }
  }

  const itemClass =
    "inline-flex items-center gap-2 rounded-full border border-cream-200 bg-white px-4 py-2 text-sm font-semibold text-navy-800 shadow-sm transition-colors hover:border-navy-300 hover:bg-navy-50 hover:text-navy-900";

  return (
    <div className={`flex flex-wrap items-center gap-3 ${className}`}>
      <span className="text-sm font-semibold text-ink-500">Share this article</span>

      <a
        href={facebookUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => fire("facebook")}
        className={itemClass}
      >
        <FacebookMark className="h-4 w-4" />
        Facebook
      </a>

      <a href={emailUrl} onClick={() => fire("email")} className={itemClass}>
        <Mail className="h-4 w-4" aria-hidden="true" />
        Email
      </a>

      <button type="button" onClick={copyLink} className={itemClass} aria-live="polite">
        {copied ? (
          <>
            <Check className="h-4 w-4 text-green-600" aria-hidden="true" />
            <span>Copied!</span>
          </>
        ) : (
          <>
            <Link2 className="h-4 w-4" aria-hidden="true" />
            <span>Copy link</span>
          </>
        )}
      </button>

      {canNativeShare ? (
        <button type="button" onClick={nativeShare} className={itemClass}>
          <Share2 className="h-4 w-4" aria-hidden="true" />
          More…
        </button>
      ) : null}
    </div>
  );
}

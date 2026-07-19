import { ImageResponse } from "next/og";
import { getPostBySlug } from "@/lib/blog";
import { site } from "@/lib/site";

export const alt = "Lake Cumberland Computers";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Cache each post's card so fonts are fetched at most once per slug per day,
// not on every social-crawler hit (and so a Google Fonts slowdown can't stall
// generation repeatedly).
export const revalidate = 86400;

/** fetch with a hard timeout so a slow-but-open connection aborts into the
 *  caller's catch instead of hanging past the function's maxDuration — a plain
 *  fetch only rejects on a network error, never on a slow response. */
async function fetchWithTimeout(url: string, init: RequestInit, ms: number) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ms);
  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Fetch a Google Font as TTF data for satori (the Vercel-documented pattern:
 * request the css2 stylesheet with a UA that gets TTF URLs, then fetch the
 * file). Returns null on any failure — including a timeout — so the image
 * falls back to the default bundled font instead of erroring.
 */
async function loadGoogleFont(family: string, weight: number, text: string) {
  try {
    const cssRes = await fetchWithTimeout(
      `https://fonts.googleapis.com/css2?family=${encodeURIComponent(family)}:wght@${weight}&text=${encodeURIComponent(text)}`,
      { headers: { "User-Agent": "Mozilla/5.0" } },
      2500
    );
    const css = await cssRes.text();
    const url = css.match(/src: url\((.+?)\) format\('(?:truetype|opentype)'\)/)?.[1];
    if (!url) return null;
    const res = await fetchWithTimeout(url, {}, 2500);
    if (!res.ok) return null;
    return await res.arrayBuffer();
  } catch {
    return null;
  }
}

export default async function OgImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  const title = post?.title ?? "Plain answers about computers, security, and IT";

  const brandLine = "LAKE CUMBERLAND COMPUTERS";
  const footerLine = `${site.domain}  ·  Russell Springs, Kentucky  ·  since ${site.foundedYear}`;
  const [serif, sans] = await Promise.all([
    loadGoogleFont("Source Serif 4", 600, title),
    loadGoogleFont("Public Sans", 600, brandLine + footerLine),
  ]);

  const fonts = [
    ...(serif ? [{ name: "serif", data: serif, weight: 600 as const }] : []),
    ...(sans ? [{ name: "sans", data: sans, weight: 600 as const }] : []),
  ];

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#071d36",
          padding: "72px 80px",
        }}
      >
        {/* Brand lockup: shield mark + letterspaced name */}
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <svg width="56" height="56" viewBox="0 0 32 32" fill="none">
            <path
              d="M16 3.5 26.5 7.2v8.6c0 6-4.1 10.1-10.5 12.7C9.6 25.9 5.5 21.8 5.5 15.8V7.2L16 3.5Z"
              stroke="#d9bc7e"
              strokeWidth="2"
              strokeLinejoin="round"
            />
            <path
              d="M10.5 14.2c1.05-1.3 2.6-1.3 3.65 0s2.6 1.3 3.65 0 2.6-1.3 3.65 0"
              stroke="#d9bc7e"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              d="M12.9 19.2c0.9-1.1 2.2-1.1 3.1 0s2.2 1.1 3.1 0"
              stroke="#d9bc7e"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
          <div
            style={{
              fontFamily: sans ? "sans" : undefined,
              fontSize: 28,
              fontWeight: 600,
              letterSpacing: "0.22em",
              color: "#d9bc7e",
            }}
          >
            {brandLine}
          </div>
        </div>

        <div
          style={{
            fontFamily: serif ? "serif" : undefined,
            fontSize: title.length > 70 ? 56 : 66,
            fontWeight: 600,
            lineHeight: 1.15,
            color: "#fbf9f5",
            maxWidth: 1000,
          }}
        >
          {title}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          <div style={{ width: 96, height: 4, backgroundColor: "#c9a55a" }} />
          <div
            style={{
              fontFamily: sans ? "sans" : undefined,
              fontSize: 26,
              fontWeight: 600,
              color: "#c3d6ea",
            }}
          >
            {footerLine}
          </div>
        </div>
      </div>
    ),
    { ...size, fonts: fonts.length > 0 ? fonts : undefined }
  );
}

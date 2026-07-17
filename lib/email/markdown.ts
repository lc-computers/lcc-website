import { escapeHtml } from "./layout";

/**
 * Tiny markdown-subset → email-safe HTML converter for newsletter/nurture
 * content (headings, paragraphs, bold, italics, links, lists, hr). Content is
 * admin-authored; everything is escaped before inline markup is applied.
 */
export function markdownToEmailHtml(md: string): string {
  const inline = (text: string): string =>
    escapeHtml(text)
      .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
      .replace(/\*([^*]+)\*/g, "<em>$1</em>")
      .replace(
        /\[([^\]]+)\]\((https?:\/\/[^)\s]+|\/[^)\s]*)\)/g,
        '<a href="$2" style="color:#0C447C;">$1</a>'
      );

  const blocks = md.replace(/\r\n/g, "\n").split(/\n{2,}/);
  const html: string[] = [];
  for (const block of blocks) {
    const trimmed = block.trim();
    if (!trimmed) continue;
    if (/^---+$/.test(trimmed)) {
      html.push('<hr style="border:none;border-top:1px solid #EAE3D5;margin:24px 0;">');
      continue;
    }
    const heading = trimmed.match(/^(#{1,3})\s+(.*)$/);
    if (heading && heading[1] && heading[2]) {
      const level = heading[1].length;
      const size = level === 1 ? 22 : level === 2 ? 19 : 16;
      html.push(
        `<h${level + 1} style="margin:24px 0 10px;font-family:Georgia,serif;font-size:${size}px;color:#16202E;">${inline(heading[2])}</h${level + 1}>`
      );
      continue;
    }
    if (/^[-*]\s+/m.test(trimmed)) {
      // Mixed blocks keep every line: consecutive bullets group into a list,
      // any surrounding text lines render as paragraphs.
      const lines = trimmed.split("\n");
      let bullets: string[] = [];
      const flush = () => {
        if (bullets.length > 0) {
          html.push(
            `<ul style="margin:0 0 16px;padding-left:22px;">${bullets
              .map((b) => `<li style="margin-bottom:6px;">${inline(b)}</li>`)
              .join("")}</ul>`
          );
          bullets = [];
        }
      };
      for (const line of lines) {
        const t = line.trim();
        if (!t) continue;
        if (/^[-*]\s+/.test(t)) {
          bullets.push(t.replace(/^[-*]\s+/, ""));
        } else {
          flush();
          html.push(`<p style="margin:0 0 16px;">${inline(t)}</p>`);
        }
      }
      flush();
      continue;
    }
    html.push(
      `<p style="margin:0 0 16px;">${inline(trimmed).replace(/\n/g, "<br>")}</p>`
    );
  }
  return html.join("\n");
}

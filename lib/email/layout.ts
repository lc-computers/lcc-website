import { site } from "@/lib/site";

/**
 * Branded HTML email shell — table-based, inline styles, renders everywhere.
 * Marketing mail must pass unsubscribeUrl (CAN-SPAM: physical address is
 * always in the footer; unsubscribe link appears when provided).
 */
export function emailLayout(opts: {
  preheader?: string;
  bodyHtml: string;
  unsubscribeUrl?: string;
}): string {
  const year = new Date().getFullYear();
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${site.name}</title>
</head>
<body style="margin:0;padding:0;background-color:#F5F1E9;">
${
  opts.preheader
    ? `<div style="display:none;max-height:0;overflow:hidden;mso-hide:all;">${opts.preheader}</div>`
    : ""
}
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#F5F1E9;padding:24px 12px;">
<tr><td align="center">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
  <tr>
    <td style="background-color:#0A2C50;border-radius:8px 8px 0 0;padding:22px 32px;border-bottom:3px solid #B08D3E;">
      <span style="font-family:Georgia,'Times New Roman',serif;font-size:22px;font-weight:bold;color:#FBF9F5;">Lake Cumberland</span><br>
      <span style="font-family:Arial,Helvetica,sans-serif;font-size:10px;font-weight:bold;letter-spacing:5px;color:#D9BC7E;">COMPUTERS</span>
    </td>
  </tr>
  <tr>
    <td style="background-color:#FFFFFF;padding:32px;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.65;color:#2E3D51;">
      ${opts.bodyHtml}
    </td>
  </tr>
  <tr>
    <td style="background-color:#FBF9F5;border-radius:0 0 8px 8px;border-top:1px solid #EAE3D5;padding:20px 32px;font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:1.6;color:#4C5D76;">
      <strong style="color:#16202E;">${site.name}</strong><br>
      ${site.address.full}<br>
      ${site.phone.display} · <a href="mailto:${site.email}" style="color:#0C447C;">${site.email}</a><br>
      ${site.hours.display}
      <br><br>
      <span style="color:#8A94A6;">© ${year} ${site.legalEntity}. ${site.legalLine}.</span>
      ${
        opts.unsubscribeUrl
          ? `<br><a href="${opts.unsubscribeUrl}" style="color:#4C5D76;text-decoration:underline;">Unsubscribe from these emails</a> — one click, effective immediately.`
          : ""
      }
    </td>
  </tr>
</table>
</td></tr>
</table>
</body>
</html>`;
}

export function emailButton(href: string, label: string): string {
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:20px 0;"><tr>
<td style="background-color:#0C447C;border-radius:6px;">
<a href="${href}" style="display:inline-block;padding:13px 28px;font-family:Arial,Helvetica,sans-serif;font-size:15px;font-weight:bold;color:#FBF9F5;text-decoration:none;">${label}</a>
</td></tr></table>`;
}

export function emailHeading(text: string): string {
  return `<h1 style="margin:0 0 16px;font-family:Georgia,'Times New Roman',serif;font-size:24px;line-height:1.3;color:#16202E;">${text}</h1>`;
}

export function emailPanel(html: string): string {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:18px 0;"><tr>
<td style="background-color:#F2F6FB;border:1px solid #C3D6EA;border-radius:8px;padding:18px 22px;font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:1.7;color:#2E3D51;">${html}</td>
</tr></table>`;
}

export function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

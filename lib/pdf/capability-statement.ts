import { PDFDocument, StandardFonts, rgb, type PDFFont } from "pdf-lib";
import { site, businessServices, type ResidentialService } from "@/lib/site";

/**
 * One-page capability statement, generated on demand so the residential menu
 * always matches /admin/services. Served by
 * app/lake-cumberland-computers-capability-statement.pdf/route.ts.
 */

const NAVY = rgb(0x0c / 255, 0x44 / 255, 0x7c / 255);
const NAVY_DARK = rgb(0x0a / 255, 0x2c / 255, 0x50 / 255);
const INK = rgb(0x16 / 255, 0x20 / 255, 0x2e / 255);
const MUTED = rgb(0x4c / 255, 0x5d / 255, 0x76 / 255);
const BRASS = rgb(0x93 / 255, 0x71 / 255, 0x2b / 255);
const CREAM = rgb(0xfb / 255, 0xf9 / 255, 0xf5 / 255);
const CREAM_DARK = rgb(0xea / 255, 0xe3 / 255, 0xd5 / 255);

const PAGE_W = 612; // Letter
const PAGE_H = 792;
const MARGIN = 54;

function wrap(text: string, font: PDFFont, size: number, maxWidth: number): string[] {
  const words = text.split(" ");
  const lines: string[] = [];
  let line = "";
  for (const word of words) {
    const candidate = line ? `${line} ${word}` : word;
    if (font.widthOfTextAtSize(candidate, size) > maxWidth && line) {
      lines.push(line);
      line = word;
    } else {
      line = candidate;
    }
  }
  if (line) lines.push(line);
  return lines;
}

export async function generateCapabilityStatementPdf(
  residentialMenu: Pick<ResidentialService, "name" | "priceDisplay">[]
): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  doc.setTitle("Lake Cumberland Computers — Capability Statement");
  doc.setAuthor(site.legalEntity);
  const page = doc.addPage([PAGE_W, PAGE_H]);

  const serif = await doc.embedFont(StandardFonts.TimesRomanBold);
  const serifItalic = await doc.embedFont(StandardFonts.TimesRomanItalic);
  const sans = await doc.embedFont(StandardFonts.Helvetica);
  const sansBold = await doc.embedFont(StandardFonts.HelveticaBold);

  // Background
  page.drawRectangle({ x: 0, y: 0, width: PAGE_W, height: PAGE_H, color: CREAM });

  // ── Header band ──
  const headerH = 118;
  page.drawRectangle({ x: 0, y: PAGE_H - headerH, width: PAGE_W, height: headerH, color: NAVY_DARK });
  page.drawRectangle({ x: 0, y: PAGE_H - headerH - 4, width: PAGE_W, height: 4, color: BRASS });

  // Shield mark (simplified geometry)
  const mx = MARGIN + 2;
  const my = PAGE_H - 38;
  page.drawSvgPath("M16 3.5 26.5 7.2v8.6c0 6-4.1 10.1-10.5 12.7C9.6 25.9 5.5 21.8 5.5 15.8V7.2L16 3.5Z", {
    x: mx,
    y: my,
    scale: 1.55,
    borderColor: CREAM,
    borderWidth: 1.6,
  });
  page.drawSvgPath("M10.5 14.2c1.05-1.3 2.6-1.3 3.65 0s2.6 1.3 3.65 0 2.6-1.3 3.65 0", {
    x: mx,
    y: my,
    scale: 1.55,
    borderColor: CREAM,
    borderWidth: 1.6,
  });
  page.drawSvgPath("M12.9 19.2c0.9-1.1 2.2-1.1 3.1 0s2.2 1.1 3.1 0", {
    x: mx,
    y: my,
    scale: 1.55,
    borderColor: CREAM,
    borderWidth: 1.6,
  });

  page.drawText("Lake Cumberland", {
    x: MARGIN + 62,
    y: PAGE_H - 52,
    size: 26,
    font: serif,
    color: CREAM,
  });
  page.drawText("C O M P U T E R S", {
    x: MARGIN + 63,
    y: PAGE_H - 68,
    size: 9,
    font: sansBold,
    color: rgb(0xd9 / 255, 0xbc / 255, 0x7e / 255),
  });
  page.drawText("CAPABILITY STATEMENT", {
    x: PAGE_W - MARGIN - sansBold.widthOfTextAtSize("CAPABILITY STATEMENT", 10),
    y: PAGE_H - 52,
    size: 10,
    font: sansBold,
    color: CREAM,
  });
  page.drawText(`Serving south-central Kentucky since ${site.foundedYear}`, {
    x: PAGE_W - MARGIN - serifItalic.widthOfTextAtSize(`Serving south-central Kentucky since ${site.foundedYear}`, 10),
    y: PAGE_H - 68,
    size: 10,
    font: serifItalic,
    color: rgb(0.78, 0.84, 0.92),
  });

  let y = PAGE_H - headerH - 34;
  const colGap = 22;
  const leftW = 316;
  const rightX = MARGIN + leftW + colGap;
  const rightW = PAGE_W - MARGIN - rightX;

  const sectionTitle = (text: string, x: number, yy: number): number => {
    page.drawText(text.toUpperCase(), { x, y: yy, size: 8.5, font: sansBold, color: BRASS });
    page.drawLine({
      start: { x, y: yy - 5 },
      end: { x: x + 24, y: yy - 5 },
      thickness: 1.4,
      color: BRASS,
    });
    return yy - 18;
  };

  // ── Left column ──
  y = sectionTitle("Who we are", MARGIN, y);
  const about = `${site.name} provides managed IT support, cybersecurity, Microsoft 365, networking, business phone systems, and camera/door-access systems to county and city government offices, medical practices, and small businesses — plus flat-rate in-home technology services for residents. Locally owned and operated from Russell Springs, Kentucky, with a small, stable team of technicians serving the region since ${site.foundedYear}.`;
  for (const line of wrap(about, sans, 9.5, leftW)) {
    page.drawText(line, { x: MARGIN, y, size: 9.5, font: sans, color: INK, lineHeight: 13 });
    y -= 13;
  }

  y -= 14;
  y = sectionTitle("Core services — business & government", MARGIN, y);
  for (const s of businessServices) {
    page.drawCircle({ x: MARGIN + 3, y: y + 3, size: 1.6, color: NAVY });
    page.drawText(s.name, { x: MARGIN + 12, y, size: 10, font: sansBold, color: INK });
    y -= 13;
    for (const line of wrap(s.short, sans, 8.5, leftW - 12)) {
      page.drawText(line, { x: MARGIN + 12, y, size: 8.5, font: sans, color: MUTED });
      y -= 11;
    }
    y -= 4;
  }

  y -= 10;
  y = sectionTitle("Residential (flat-rate, book online)", MARGIN, y);
  // The one-page layout fits ~8 menu rows alongside the fixed sections.
  for (const s of residentialMenu.slice(0, 8)) {
    page.drawText(s.name, { x: MARGIN, y, size: 9, font: sans, color: INK });
    page.drawText(s.priceDisplay, {
      x: MARGIN + leftW - sansBold.widthOfTextAtSize(s.priceDisplay, 9),
      y,
      size: 9,
      font: sansBold,
      color: NAVY,
    });
    y -= 13;
  }

  y -= 14;
  y = sectionTitle("Differentiators", MARGIN, y);
  const differentiators = [
    "Local accountability — technicians based in Russell Springs; response is a drive, not a dispatch queue",
    "Security-first practice — MFA, tested backups, patching discipline, staff training",
    "Compliance-aware — experience with records-holding offices and HIPAA-conscious practices",
    "Continuity — the same small, stable team year over year, with documented systems",
  ];
  for (const d of differentiators) {
    page.drawCircle({ x: MARGIN + 3, y: y + 3, size: 1.6, color: NAVY });
    const lines = wrap(d, sans, 8.8, leftW - 12);
    for (const line of lines) {
      page.drawText(line, { x: MARGIN + 12, y, size: 8.8, font: sans, color: INK });
      y -= 11;
    }
    y -= 4;
  }

  // ── Right column ──
  let ry = PAGE_H - headerH - 34;

  const infoCard = (title: string, rows: [string, string][], yy: number): number => {
    const cardTop = yy + 12;
    let innerY = yy;
    innerY = sectionTitle(title, rightX + 12, innerY - 8);
    const lines: { label: string; text: string[] }[] = rows.map(([label, value]) => ({
      label,
      text: wrap(value, sans, 8.8, rightW - 24),
    }));
    const contentH = lines.reduce((acc, l) => acc + 10 + l.text.length * 11 + 5, 0);
    page.drawRectangle({
      x: rightX,
      y: innerY - contentH - 2,
      width: rightW,
      height: cardTop - (innerY - contentH) - 4,
      borderColor: CREAM_DARK,
      borderWidth: 1,
    });
    for (const l of lines) {
      page.drawText(l.label.toUpperCase(), { x: rightX + 12, y: innerY, size: 7, font: sansBold, color: MUTED });
      innerY -= 10;
      for (const t of l.text) {
        page.drawText(t, { x: rightX + 12, y: innerY, size: 8.8, font: sans, color: INK });
        innerY -= 11;
      }
      innerY -= 5;
    }
    return innerY - 18;
  };

  ry = infoCard(
    "Entity & procurement",
    [
      ["Legal entity", site.legalEntity],
      ["Doing business as", `${site.name} (a service of ${site.legalEntity})`],
      ["Established", `${site.foundedYear} — locally owned and operated`],
      ["W-9", `Available on request: ${site.email}`],
      ["Quotes", "Written, itemized, held through approval cycles"],
    ],
    ry
  );

  ry = infoCard(
    "Service area",
    [
      ["Towns", site.serviceArea.towns.join(", ")],
      ["Counties", `${site.serviceArea.counties.join(", ")} (KY)`],
    ],
    ry
  );

  ry = infoCard(
    "Contact",
    [
      ["Phone", site.phone.display],
      ["Email", site.email],
      ["Address", site.address.full],
      ["Hours", site.hours.display],
      ["Web", site.domain],
    ],
    ry
  );

  // ── Footer ──
  page.drawRectangle({ x: 0, y: 0, width: PAGE_W, height: 40, color: NAVY_DARK });
  const footer = `${site.name}  ·  ${site.phone.display}  ·  ${site.email}  ·  ${site.address.full}`;
  page.drawText(footer, {
    x: (PAGE_W - sans.widthOfTextAtSize(footer, 8.5)) / 2,
    y: 16,
    size: 8.5,
    font: sans,
    color: CREAM,
  });

  return doc.save();
}

/**
 * Single source of truth for business facts.
 * Every page, email, prompt, and schema pulls from here — never hard-code
 * these values elsewhere, and never invent facts that are not in this file.
 */

export const site = {
  name: "Lake Cumberland Computers",
  legalEntity: "Stargel Technologies LLC",
  legalLine: "Lake Cumberland Computers is a service of Stargel Technologies LLC",
  owner: "Louis Stargel",
  foundedYear: 2001,
  tagline: "Serving south-central Kentucky since 2001",
  phone: {
    display: "(270) 866-8660",
    e164: "+12708668660",
    tel: "tel:+12708668660",
  },
  email: "info@lakecumberlandcomputers.com",
  domain: "lakecumberlandcomputers.com",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://lakecumberlandcomputers.com",
  address: {
    street: "478 Lakeway Dr",
    city: "Russell Springs",
    state: "KY",
    zip: "42642",
    full: "478 Lakeway Dr, Russell Springs, KY 42642",
  },
  geo: {
    // Russell Springs, KY city center
    latitude: 37.0562,
    longitude: -85.0886,
  },
  hours: {
    display: "Monday–Friday, 8:00 AM–5:00 PM CT",
    short: "Mon–Fri 8–5 CT",
    opens: "08:00",
    closes: "17:00",
    days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
  },
  timezone: "America/Chicago",
  serviceArea: {
    towns: [
      "Russell Springs",
      "Jamestown",
      "Somerset",
      "Columbia",
      "Monticello",
      "Albany",
    ],
    counties: ["Russell", "Pulaski", "Adair", "Wayne", "Clinton", "Casey"],
    sentence:
      "Russell Springs, Jamestown, Somerset, Columbia, Monticello, Albany, and the surrounding counties — Russell, Pulaski, Adair, Wayne, Clinton, and Casey.",
  },
  travelFee: {
    inTown: 0,
    surrounding: 25,
    explanation:
      "No travel fee in Russell Springs or Jamestown (ZIP 42642 and 42629). Addresses beyond those add a flat $25 — shown before you pay, never after.",
  },
  cancellation: {
    policy:
      "Full refund if you cancel 24 hours or more before your appointment. Reschedule free anytime.",
  },
} as const;

export function yearsInBusiness(): number {
  return new Date().getFullYear() - site.foundedYear;
}

/** Business & government service lines (Track A). */
export const businessServices = [
  {
    slug: "managed-it",
    name: "Managed IT Support",
    short: "Ongoing care for your computers, servers, and staff — one call, handled.",
  },
  {
    slug: "cybersecurity",
    name: "Cybersecurity",
    short: "Practical protection against ransomware, phishing, and account takeover.",
  },
  {
    slug: "microsoft-365",
    name: "Microsoft 365",
    short: "Email, files, and Teams set up right — secured, backed up, supported.",
  },
  {
    slug: "networking-wifi",
    name: "Network & Wi-Fi",
    short: "Wired and wireless networks that stay up, in every corner of the building.",
  },
  {
    slug: "phone-systems-voip",
    name: "Business Phone Systems (VoIP)",
    short: "Modern phone service with auto-attendants, mobile apps, and real support.",
  },
  {
    slug: "cameras-access-control",
    name: "Security Cameras & Door Access",
    short: "See your building and control who gets in — footage you can actually pull up.",
  },
] as const;

export type ResidentialServiceKind = "in_home" | "remote";

export interface ResidentialService {
  slug: string;
  name: string;
  priceCents: number;
  priceDisplay: string;
  kind: ResidentialServiceKind;
  /** Customer-facing appointment length in minutes. */
  durationMinutes: number;
  /** Technician travel buffer blocked after in-home visits, minutes. */
  bufferMinutes: number;
  blurb: string;
  includes: string[];
}

/** Residential flat-rate menu (Track B). Prices are final — services only, no sales tax. */
export const residentialServices: ResidentialService[] = [
  {
    slug: "in-home-tech-help",
    name: "In-Home Tech Help (first hour)",
    priceCents: 9900,
    priceDisplay: "$99",
    kind: "in_home",
    durationMinutes: 90,
    bufferMinutes: 30,
    blurb:
      "A technician comes to your home and works the problem — slow computer, printer that won't print, email trouble, TV or streaming setup, or 'it just stopped working.'",
    includes: [
      "Up to one hour of hands-on work at your home",
      "Plain-English explanation of what was wrong",
      "Honest advice if something isn't worth fixing",
      "No upselling — if it takes ten minutes, we still stay the hour if you have questions",
    ],
  },
  {
    slug: "virus-malware-removal",
    name: "Virus & Malware Removal",
    priceCents: 14900,
    priceDisplay: "$149",
    kind: "in_home",
    durationMinutes: 90,
    bufferMinutes: 30,
    blurb:
      "Pop-ups, fake warning screens, a browser that hijacks itself, or a machine that's suddenly crawling — we clean the infection and lock the machine back down.",
    includes: [
      "Full malware scan and removal",
      "Browser cleanup — extensions, hijacked search, notification spam",
      "Security updates applied and protection verified",
      "A walkthrough of what to avoid so it doesn't come back",
    ],
  },
  {
    slug: "computer-setup",
    name: "New Computer Setup & Data Transfer",
    priceCents: 12900,
    priceDisplay: "$129",
    kind: "in_home",
    durationMinutes: 90,
    bufferMinutes: 30,
    blurb:
      "New machine out of the box to fully yours — files, photos, printers, email, and the programs you actually use, moved over and working.",
    includes: [
      "Out-of-box setup and updates",
      "Files, photos, and documents transferred from your old machine",
      "Email, printer, and Wi-Fi connected",
      "Old-computer advice: wipe it, donate it, or keep it as a spare",
    ],
  },
  {
    slug: "home-wifi",
    name: "Home Wi-Fi Setup / Fix",
    priceCents: 12900,
    priceDisplay: "$129",
    kind: "in_home",
    durationMinutes: 90,
    bufferMinutes: 30,
    blurb:
      "Dead spots, buffering, or a router still running the password on the sticker — we set your home network up properly and make it reach where you live.",
    includes: [
      "Router placement, setup, and secure configuration",
      "Coverage check through the whole house",
      "Smart TVs, cameras, and devices reconnected",
      "Network name and password you actually chose, written down for you",
    ],
  },
  {
    slug: "remote-support",
    name: "Remote Support Session (30 min)",
    priceCents: 4900,
    priceDisplay: "$49",
    kind: "remote",
    durationMinutes: 30,
    bufferMinutes: 0,
    blurb:
      "A technician calls you at your appointment time and connects to your computer over a secure screen-share link. No travel fee, ever — great for software questions, email trouble, and quick fixes.",
    includes: [
      "A real local technician on the phone, not a call center",
      "Secure, one-time screen-share session you approve on your end",
      "30 minutes of focused help",
      "No travel fee, ever",
    ],
  },
];

export function getResidentialService(slug: string): ResidentialService | undefined {
  return residentialServices.find((s) => s.slug === slug);
}

export function formatCents(cents: number): string {
  const dollars = cents / 100;
  return Number.isInteger(dollars) ? `$${dollars}` : `$${dollars.toFixed(2)}`;
}

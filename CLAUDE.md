# BUILD PROMPT v2 — Lake Cumberland Computers Lead-Generation Website

Build this entire project start to finish in one continuous effort. Do not stop at phase boundaries or ask whether to continue. Only stop for genuine blockers (missing credential, contradictory requirement). Deliver the Definition of Done checklist at the end.

## What this is

A lead-generation and online-booking website for Lake Cumberland Computers, an IT services company in Russell Springs, Kentucky, in business since 2001 with a small team of technicians. Two customer tracks:

- TRACK A — Business & Government (primary positioning): county/city government offices first, then small businesses and medical practices. No pricing shown. Leads captured via an AI chat agent and a free M365 Security Health Check, converted to free consultations booked through Microsoft Bookings.
- TRACK B — Residential: flat-rate in-home and remote tech services with a custom self-service booking system — pick a service, pick a real available time slot, pay in full online (Stripe), get confirmed instantly with email + SMS.

The owner (Louis) is technical. Communicate directly, exact commands, no beginner explanations.

## Business facts (use exactly — never invent others)

- Brand: Lake Cumberland Computers
- Legal entity: Stargel Technologies LLC — footer line: "Lake Cumberland Computers is a service of Stargel Technologies LLC"
- Owner/public face: Louis Stargel. Team: Louis + 2 technicians. Site copy uses "our technicians" / team language.
- Founded: 2001 — "Serving south-central Kentucky since 2001" / "25 years"
- Address: 478 Lakeway Dr, Russell Springs, KY 42642
- Phone (publish everywhere, header of every page): (270) 866-8660
- Public email: info@lakecumberlandcomputers.com
- Lead notifications to: louis@lakecumberlandcomputers.com
- Domain: lakecumberlandcomputers.com
- Hours: Monday–Friday 8:00 AM–5:00 PM CT
- Service area: Russell Springs, Jamestown, Somerset, Columbia, Monticello, Albany, and surrounding counties (Russell, Pulaski, Adair, Wayne, Clinton, Casey)
- Business services: managed IT support, cybersecurity, Microsoft 365, network & Wi-Fi, business phone systems (VoIP), security cameras, door access control
- Residential services and prices (flat-rate, no sales tax applied — services only):
  - In-Home Tech Help (first hour) — $99
  - Virus & Malware Removal — $149
  - New Computer Setup & Data Transfer — $129
  - Home Wi-Fi Setup / Fix — $129
  - Remote Support Session (30 min) — $49 (no travel fee ever)
- Travel fee: $0 inside Russell Springs; +$25 for surrounding-county addresses. Determine by customer-entered city/zip at booking; show the fee clearly before payment.
- Cancellation policy: full refund if canceled 24+ hours before the appointment; free reschedule anytime. State this at checkout and in confirmations.
- Certifications and client names: DO NOT fabricate anything — no fake testimonials, review counts, credentials, or statistics. Build testimonial components with clearly-marked TODO placeholder slots (real named-client quotes are being collected).

## Positioning & voice

- Government-first messaging for Track A: stability, security, local accountability, compliance-aware (mention experience with medical offices and HIPAA-conscious practices; claim no certifications).
- Residential positioning: flat rates posted up front · confirmed appointment times, not wait-around windows · pay online, book online — the only local tech service where you can · no upselling · local technicians you'll recognize · the same team that protects county offices and medical practices.
- Voice: plain-spoken, direct, local, confident. Banned words: leverage, seamless, world-class, solutions provider, cutting-edge, empower. Write like a trusted local expert.

## Design requirements — this must look top-notch

The bar: indistinguishable from the work of a top design firm. Specifically:

- Palette: deep navy primary (#0C447C family) on warm off-white, one restrained accent, generous whitespace. Institutional and calm — law firm, not startup.
- Typography: two typefaces max via Google Fonts — a characterful serif or sharp grotesque for headings, a clean humanist sans for body. Establish a strict type scale and spacing scale in Tailwind config and never deviate. Typography and layout carry the design.
- Logo: create a typographic wordmark — "Lake Cumberland Computers" set with care, optionally with one simple geometric mark (abstract shield/water form, restrained). Deliver as SVG (header + footer variants + favicon). No clip-art, no gradients-heavy icon.
- Photography: NONE at launch — do not use stock photos of people, do not generate fake people or fake premises. Design must look intentional and complete photo-free (color blocks, typography, iconography, subtle texture at most). Include clearly-marked component slots + TODO comments where real photos (owner, team, storefront) drop in later.
- Iconography: one consistent professional set (e.g., Lucide), single stroke weight throughout.
- Micro-interactions: subtle only — gentle hover states, restrained scroll reveals. Nothing bouncy.
- Mobile-first responsive; flawless at 360px. WCAG 2.1 AA: contrast, focus-visible states, keyboard nav, semantic HTML, alt text, reduced-motion respected.
- Performance: Lighthouse ≥ 90 mobile on all public pages.

## Tech stack

- Next.js (latest stable, App Router) + TypeScript strict; Tailwind CSS
- Vercel hosting (GitHub repo lc-computers/lcc-website, auto-deploy from main); Vercel cron for scheduled jobs
- Postgres (Vercel Postgres/Neon) + Drizzle ORM
- Anthropic API (@anthropic-ai/sdk): chat agent, health-check reports, article drafting
- Stripe: residential payments (Stripe Checkout), webhook-confirmed bookings, refunds
- Resend: all transactional + nurture email (React Email or clean inline HTML templates)
- Twilio: SMS confirmations/reminders — graceful degradation: if Twilio env vars absent, log SMS and continue (A2P 10DLC registration may still be pending)
- Microsoft Graph: free/busy read + event creation on a shared "Service Appointments" M365 calendar (app registration; env-var credentials; graceful degradation to DB-only availability if not configured)
- Microsoft Bookings: business consults via BOOKINGS_URL link/embed. No Calendly or paid schedulers.
- zod validation on every API input; rate limiting on all public APIs
- Analytics: privacy-friendly (Vercel Analytics or Plausible) + custom conversion events: health_check_completed, chat_lead_captured, booking_paid, bookings_link_clicked, phone_clicked

## Environment variables (.env.example required)

ANTHROPIC_API_KEY, RESEND_API_KEY, DATABASE_URL, STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET, NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY, TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_FROM_NUMBER, MSGRAPH_TENANT_ID, MSGRAPH_CLIENT_ID, MSGRAPH_CLIENT_SECRET, MSGRAPH_CALENDAR_USER, BOOKINGS_URL, LEAD_NOTIFY_EMAIL=louis@lakecumberlandcomputers.com, FROM_EMAIL=info@lakecumberlandcomputers.com, NEXT_PUBLIC_SITE_URL, ADMIN_SECRET

## Site structure (full final copy on every page — zero lorem ipsum)

1. / — Home. Hero with government-first headline naming the region, then immediately a PATH SPLITTER above the fold: two large clear cards — "For your business or office" → Track A journey, and "For your home" → /book. Trust bar (locally owned since 2001 · Russell Springs, KY · serving local government & business). Services grid. Government callout. Residential callout with 2–3 menu prices visible. "Why local matters" section featuring Louis + team (photo slots). How-it-works. Testimonial section (TODO slots). Final CTA band. Phone number in header sitewide.
2. /services + detail pages: /services/managed-it, /services/cybersecurity, /services/microsoft-365, /services/networking-wifi, /services/phone-systems-voip, /services/cameras-access-control — each 400–700 words: problem-focused intro, what's included, who it's for, FAQ (FAQPage schema), consult CTA.
3. /government — flagship page. Speaks to county/city offices, courts, clerks, utility districts, schools: budget-cycle and procurement-friendly language, ransomware risk to small governments (factual, not fear-mongering), security posture and accountability, local-vendor advantages, entity/legal name stated for procurement clarity, "W-9 available on request." Health check framed as a "security posture report" for public entities. Downloadable one-page capability statement PDF (generate it: services, entity, since-2001, service area, contact — same design language). CTA: book a consult.
4. /home-services — residential landing: flat-rate menu with prices, the positioning promises (posted prices, confirmed times, no upselling, local team), how in-home visits work, travel-fee explanation, testimonial slots, big Book Now CTA. "Prefer to call? (270) 866-8660" prominent.
5. /book — the booking flow (details below).
6. /health-check — the free M365 Security Health Check tool (details below).
7. /about — Louis + team story, since-2001 history, local roots, values, photo slots.
8. /contact — phone, email, address, hours, static map (no API-key map services), contact form → lead + notification.
9. /blog — MDX index + article template. Write 4 complete launch articles: (a) ransomware and small Kentucky governments — what a clerk's office should ask its IT vendor; (b) M365 security basics every small business gets wrong; (c) can your business email be spoofed? SPF/DKIM/DMARC in plain English; (d) slow computer? what a $99 in-home visit actually fixes.
10. /areas/[slug] — russell-springs, jamestown, somerset, columbia, monticello, albany — each genuinely differentiated, 300+ words, mentions both tracks and the surrounding-county travel fee where relevant.
11. /privacy + /terms — plain-English; cover chat agent, health-check data, SMS consent (TCPA: booking form includes a checkbox consenting to appointment-related texts), payments/refund policy, email marketing (CAN-SPAM).
12. 404 (on-brand), sitemap.xml, robots.txt.

SEO on every page: unique title/description, OG/Twitter cards, canonicals; JSON-LD: LocalBusiness sitewide (exact NAP, geo, hours, areaServed), Service on service pages, FAQPage on FAQs, Article on posts; internal linking areas ↔ services ↔ blog.

## System 1 — Residential booking + payments (custom build)

Flow: /book → choose service (cards with prices) → enter name, email, phone, street address, city, zip (travel fee computed and displayed immediately; Remote Session skips address/travel fee) → SMS-consent checkbox → calendar/slot picker → Stripe Checkout (full payment) → webhook confirms → booking locked → confirmation email (details, what-to-expect, reschedule/cancel link, ICS attachment) + confirmation SMS → Graph event created → Louis notified (email).

Availability engine:
- Slots Mon–Fri 8:00–5:00 CT; 90-minute in-home slots with 30-minute travel buffer; Remote Sessions 30-minute slots without buffer
- CAPACITY = 2 concurrent appointments (two technicians). A slot shows available while fewer than 2 confirmed bookings overlap it.
- If Graph is configured: subtract busy blocks from the shared "Service Appointments" calendar; write confirmed bookings to it (customer name, service, address, phone in the event body). Customers never pick a specific technician — jobs are assigned internally.
- Concurrency guard: reserve the slot in a DB transaction at checkout creation with a 15-minute hold; release on expiry/abandonment; double-check capacity in the Stripe webhook before final confirmation; refund automatically with an apology email in the rare race-loss case.

Lifecycle:
- Reminders: email + SMS at 24h ("reply or call to reschedule — free") — Vercel cron.
- Cancel/reschedule: tokenized self-service link in confirmation; cancellations 24h+ auto-refund via Stripe API; inside 24h shows "call us" message.
- Abandoned recovery: contact info is captured before payment; if checkout not completed within a few hours, send ONE "still need help with that [service]? Your slot may still be open" email. Never more than one.
- Review flywheel: cron sends a next-day post-appointment email + SMS: thanks + direct Google review link (env var GOOGLE_REVIEW_URL; TODO note for Louis to supply from Google Business Profile).
- "Prefer to call? (270) 866-8660" visible on every step of the flow.
- Remote Session confirmations explain exactly how it works: a technician calls at the appointment time and connects via a secure screen-share link.

## System 2 — AI intake chat agent (conversion-focused)

- Custom lightweight floating chat widget, all pages, streamed responses, accessible. No third-party chat SaaS.
- POST /api/chat → Claude with server-side system prompt (in /lib/prompts/) containing all business facts, both tracks, the residential menu with prices, travel-fee rule, and hours.
- Core behavior — every conversation is steered toward a booked appointment, helpfully, never pushy:
  - Residential visitors: diagnose the problem in plain English, recommend the exact flat-rate service and price, then hand off with a deep link /book?service=<slug> ("I can get that booked for you right now — pick a time here"). Always offer the phone number as an alternative.
  - Business/government visitors: qualify (organization type, employee count, current IT situation, M365 status, urgency, contact info) → present BOOKINGS_URL for a free consult.
  - EMERGENCY detection: business-down / urgent language → immediately give the phone number ("Call us right now at (270) 866-8660") — never a calendar link.
  - Never state business/government pricing — route to a call. Residential flat rates: state freely.
  - Never make security guarantees, give environment-specific security advice, or claim certifications. Off-topic → polite redirect.
  - Graceful close: if the visitor is done, end warmly with phone number + relevant booking path.
- Persist transcripts (DB, session-keyed); on contact capture or session end, email summary + extracted lead fields to LEAD_NOTIFY_EMAIL.
- Rate limiting, input caps, prompt-injection hygiene (user text is data; system prompt never exposed).

## System 3 — M365 Security Health Check (/health-check)

Flow: domain-or-email + name + email + optional phone → POST /api/health-check (zod; rate-limit 5/hour/IP) → passive checks → Claude writes graded report → email via Resend → store lead + results → on-page grade summary + Bookings CTA.

- ACCEPT free-mail users: if the visitor's business runs on gmail/yahoo/etc. or they have no domain, that becomes a graded finding — "your business doesn't have its own email domain: credibility + security implications" — not a rejection. Capture the lead regardless.
- Checks (passive DNS/public lookups ONLY — never scan, probe, or connect to target infrastructure): MX (identify M365/Google/other), SPF presence + policy, DKIM selectors (selector1/selector2 CNAMEs for M365; note when provider differs), DMARC presence + policy. Node dns/promises.
- Report: letter grade per category + overall; plain-English meaning for a non-technical office manager or county clerk; closing "what a full internal review also covers" (endpoint protection, backups, MFA, staff training, access control) + booking CTA. Helpful expert tone, zero fear-mongering. Branded HTML email from FROM_EMAIL.

## System 4 — Content engine (admin)

- /admin gated by ADMIN_SECRET (simple cookie/header gate)
- keyword_queue seeded with 20 locally-relevant topics (government IT, M365 security, small-business security, residential tech help, VoIP, cameras, Wi-Fi — each with a town/county angle)
- POST /api/admin/draft: next queue item → Claude drafts 700–1,000 words in site voice, local angle, internal links, CTA → drafts table
- Admin UI: list, preview rendered, edit title/body, approve → published (store approved posts in DB and render /blog from DB — simplest reliable path; document it)
- Weekly cron: auto-draft one article, email Louis "a draft is waiting"
- Monthly cron: newsletter digest draft (month's posts + one security tip) → Louis approves in admin → sends to the nurture list (suppression respected)

## System 5 — Nurture

- Health-check leads: instant report → day 3 relevant article → day 7 "want to walk through your report? 15 minutes" + Bookings link → monthly newsletter list
- nurture_queue table + cron; every marketing email: physical address footer + one-click unsubscribe → suppression table checked before every send. Transactional email (bookings, reports) exempt from suppression.

## Database (Drizzle)

leads, chat_sessions, health_checks, bookings (status: pending_payment/confirmed/canceled/refunded/completed), booking_holds, services (seeded with the menu), nurture_queue, suppression, keyword_queue, drafts/posts, events (analytics conversions)

## Hard rules

1. TypeScript strict; zod everywhere; rate limits on all public POST APIs
2. Secrets via env only; .env.example complete
3. Zero fabrication: no fake testimonials/reviews/credentials/clients/statistics/photos of people. TODO-marked slots instead.
4. Health check = passive public DNS lookups only
5. Stripe amounts in integer cents; webhook signature verified; idempotent webhook handling
6. Every user-facing money amount, date, and time rendered in America/Chicago timezone, formatted correctly
7. Dependencies limited to the stack above; ask before adding others
8. Conventional commits, small logical units

## Build order (continuous)

1. Scaffold + Tailwind design tokens + wordmark/favicon + layout shell
2. All public pages, full copy, SEO/schema, sitemap/robots, capability-statement PDF
3. DB schema + seeds
4. Booking system end-to-end (availability, holds, Stripe, webhook, Graph, confirmations, ICS, SMS, cancel/reschedule, reminders, abandoned recovery, review-request cron)
5. Chat agent end-to-end (widget, streaming, deep-links to /book, lead summaries, emergency path)
6. Health check end-to-end
7. Contact form; analytics events wired
8. Content engine + nurture + crons
9. 4 launch articles as final content
10. QA: lighthouse, 360px mobile pass, full booking test in Stripe test mode, all emails/SMS (log mode where keys absent), accessibility sweep
11. README: env setup; Vercel deploy; Stripe webhook setup; Twilio + A2P note; Graph app-registration steps (least-privilege: Calendars.ReadWrite scoped to the shared mailbox/calendar); GoDaddy DNS changes (A @ → 76.76.21.21, CNAME www → cname.vercel-dns.com) with explicit DO-NOT-TOUCH list (MX, SPF TXT, autodiscover, DKIM — these keep M365 email alive); Resend domain-verification DNS; redirect mapping instructions for old indexed URLs; launch-day checklist (test $1 booking + refund, flip DNS, verify mail flow, align Google Business Profile NAP, fix stray directories, set GOOGLE_REVIEW_URL, announce)

## Definition of done

- npm run build clean; zero TS errors
- Every page final copy; zero lorem ipsum; zero invented facts; zero fake imagery of people
- Complete test-mode booking: pay → confirm → ICS + email (+ SMS or log) → cancel → auto-refund
- Capacity works: a slot with 2 confirmed bookings is unavailable; hold-expiry releases slots
- Chat agent correctly handles: a residential virus problem (recommends $149 service + deep link), a county-clerk inquiry (qualifies → Bookings), an urgent business-down message (phone number immediately)
- Health check grades a real domain and handles a gmail-only user as a finding, not a rejection
- Draft → approve → publish works; nurture emails queue and respect suppression
- Lighthouse ≥ 90 mobile on /, /government, /home-services, /book, /health-check
- README complete enough to deploy without questions

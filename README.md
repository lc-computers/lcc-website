# Lake Cumberland Computers — lakecumberlandcomputers.com

Lead-generation and online-booking website for Lake Cumberland Computers
(a service of Stargel Technologies LLC), Russell Springs, KY.

Two customer tracks:

- **Business & Government** — no pricing shown; leads captured via the AI chat
  agent and the free M365 Security Health Check, converted to free consults
  through Microsoft Bookings.
- **Residential** — flat-rate services booked and paid online end-to-end:
  pick a service → real time slot → Stripe Checkout → instant email + SMS
  confirmation with calendar invite.

**Stack:** Next.js 16 (App Router, TypeScript strict) · Tailwind CSS v4 ·
Neon Postgres + Drizzle ORM · Anthropic API · Stripe · Resend · Twilio ·
Microsoft Graph · Vercel.

---

## Current deployment state

| Piece | State |
|---|---|
| GitHub | `lc-computers/lcc-website` (public), auto-deploys `main` → Vercel. Old build attempt preserved on branch `previous-build`. |
| Vercel | Project `lccomputers/lcc-website`, Hobby plan |
| Database | Neon Postgres via Vercel Marketplace — `DATABASE_URL` set in all environments; schema pushed; seeds run |
| Waiting on env vars | `ANTHROPIC_API_KEY`, `RESEND_API_KEY`, `STRIPE_*`, `CRON_SECRET`, `ADMIN_SECRET`, `BOOKINGS_URL`, `GOOGLE_REVIEW_URL`, Twilio, MS Graph (all optional-degrade: see below) |
| DNS | Not yet pointed at Vercel (see Launch day) |

Everything degrades gracefully: with a var missing, email/SMS log to the
console instead of sending, Graph is skipped, chat falls back to the phone
number, and booking payment returns a friendly "call us" message.

## Local development

```bash
npm install
npx vercel env pull .env.local        # brings DATABASE_URL (Neon) down
npm run db:push                       # push schema (drizzle-kit)
npm run db:seed                       # services menu, 20 topics, 4 launch articles
npm run dev                           # http://localhost:3000
```

Useful scripts:

```bash
npm run build            # production build (must stay clean)
npm run typecheck        # tsc --noEmit
npx tsx scripts/test-booking-engine.ts   # availability/capacity/holds test (needs DATABASE_URL)
npm run pdf:capability   # regenerate the capability-statement PDF into /public
```

> **Toolchain note:** `typescript` is pinned to `^5.9` — TS 7.x currently
> breaks `next build`. Don't bump it until Next supports TS 7.

## Environment variables

Copy `.env.example` for the full annotated list. Set production values in
Vercel → Project → Settings → Environment Variables (or `npx vercel env add`).

| Variable | Purpose | If missing |
|---|---|---|
| `DATABASE_URL` | Neon Postgres | booking 503s politely; blog falls back to launch articles |
| `ANTHROPIC_API_KEY` | chat agent, health-check narrative, article drafts | chat offers phone; reports use template text |
| `RESEND_API_KEY` | all email | emails logged to console |
| `FROM_EMAIL` / `LEAD_NOTIFY_EMAIL` | sender / Louis's inbox | defaults info@ / louis@ |
| `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | payments | booking checkout 503s politely |
| `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_FROM_NUMBER` | SMS | SMS logged (fine while A2P 10DLC registration is pending) |
| `MSGRAPH_TENANT_ID`, `MSGRAPH_CLIENT_ID`, `MSGRAPH_CLIENT_SECRET`, `MSGRAPH_CALENDAR_USER` | shared calendar | availability is DB-only; no calendar events |
| `BOOKINGS_URL` | Microsoft Bookings consult page | consult CTAs fall back to /contact |
| `NEXT_PUBLIC_SITE_URL` | canonical URL | defaults to https://lakecumberlandcomputers.com |
| `ADMIN_SECRET` | /admin gate + unsubscribe-token signing | admin disabled; marketing mail uses mailto unsubscribe |
| `CRON_SECRET` | cron auth (Vercel sends it automatically) | cron endpoints stay OFF (fail closed) |
| `GOOGLE_REVIEW_URL` | post-visit review requests | review emails skipped (logged) |

## Stripe setup

1. In the Stripe dashboard (test mode first): copy the **secret key** and
   **publishable key** into Vercel env.
2. Developers → Webhooks → **Add endpoint**:
   `https://lakecumberlandcomputers.com/api/webhooks/stripe`
   Events: `checkout.session.completed`, `checkout.session.expired`.
3. Copy the endpoint's **signing secret** → `STRIPE_WEBHOOK_SECRET`.
4. Local testing: `stripe listen --forward-to localhost:3000/api/webhooks/stripe`
   (the CLI prints a temporary signing secret for `.env.local`).

**Full test-mode booking check:** book any service with card `4242 4242 4242
4242` → confirmation email (or console log) with ICS attachment + SMS log →
open the manage link → cancel → refund appears automatically in Stripe test
mode. Capacity: book the same slot twice more — the third attempt must not
see the slot.

Amounts are integer cents everywhere; the webhook is signature-verified and
idempotent (`stripe_events` table), re-checks slot capacity before
confirming, and auto-refunds with an apology email if the slot was lost in a
race.

## Resend (email) setup

1. Resend dashboard → Domains → add `lakecumberlandcomputers.com`.
2. Add the DNS records Resend shows at GoDaddy — these are **additional**
   records (a DKIM CNAME/TXT set for Resend and an SPF include on the
   *bounce subdomain* Resend specifies). They do not replace the M365 records.
3. Wait for "Verified", then set `RESEND_API_KEY`.

> If Resend asks to modify the root SPF record, add its include to the
> existing record — never create a second `v=spf1` TXT record.

## Twilio (SMS) setup

1. Buy/port a local number → `TWILIO_FROM_NUMBER` (+1 format).
2. **A2P 10DLC**: register the brand + campaign (Twilio console → Messaging →
   Regulatory compliance). Until approved, carriers filter business SMS —
   leave the env vars unset and the site logs SMS instead of sending; flows
   still work.
3. Set `TWILIO_ACCOUNT_SID` / `TWILIO_AUTH_TOKEN` once approved.

SMS is consent-gated (TCPA checkbox at booking), appointment-related only,
and every message ends with "Reply STOP to opt out."

## Microsoft Graph (shared calendar) setup — least privilege

1. Create a shared mailbox (e.g. `appointments@lakecumberlandcomputers.com`)
   in M365 admin; its default calendar is the "Service Appointments" calendar.
2. Entra admin center → App registrations → **New registration**
   ("LCC Website Calendar"). Single tenant. No redirect URI.
3. API permissions → Microsoft Graph → **Application** →
   `Calendars.ReadWrite` → Grant admin consent.
4. **Scope it down** (this is the least-privilege step) — in Exchange Online
   PowerShell:
   ```powershell
   New-DistributionGroup -Name "LCC Website Calendar Access" -Type Security
   Add-DistributionGroupMember "LCC Website Calendar Access" -Member appointments@lakecumberlandcomputers.com
   New-ApplicationAccessPolicy -AppId <CLIENT_ID> -PolicyScopeGroupId "LCC Website Calendar Access" -AccessRight RestrictAccess
   Test-ApplicationAccessPolicy -AppId <CLIENT_ID> -Identity appointments@lakecumberlandcomputers.com   # Granted
   Test-ApplicationAccessPolicy -AppId <CLIENT_ID> -Identity louis@lakecumberlandcomputers.com          # Denied
   ```
5. Certificates & secrets → new client secret → env vars:
   `MSGRAPH_TENANT_ID`, `MSGRAPH_CLIENT_ID`, `MSGRAPH_CLIENT_SECRET`,
   `MSGRAPH_CALENDAR_USER=appointments@lakecumberlandcomputers.com`.

The engine subtracts the calendar's busy blocks from availability and writes
confirmed bookings to it (customer, service, address, phone in the body).
Technicians manage assignments internally; customers never pick a person.

## Microsoft Bookings

Create the "Free IT Consultation" service in Bookings (30 min, Teams or
phone), publish the page, and set `BOOKINGS_URL`. Every business/government
CTA and the chat agent use it; until set they route to /contact.

## Crons

`vercel.json` schedules **one daily cron** (Hobby-plan limit): 11:00 UTC =
6 AM CT → `/api/cron/lifecycle`, which runs booking lifecycle (hold expiry,
reminders, abandoned recovery, completion, review requests), the nurture
queue, chat-session closeout — plus the weekly article draft on Mondays and
the monthly newsletter draft on the 1st.

Set `CRON_SECRET` (any long random string) — Vercel sends it automatically;
without it the endpoints refuse to run.

**On Vercel Pro:** raise `/api/cron/lifecycle` to hourly (`0 * * * *`), add
`/api/cron/weekly-draft` (`0 14 * * 1`) and `/api/cron/monthly-newsletter`
(`0 14 1 * *`) back as separate crons, and tighten the reminder window in
`lib/cron/booking-lifecycle.ts` (comment marks the spot) for reminders that
land almost exactly 24h ahead.

## Content engine

- `/admin` — enter `ADMIN_SECRET` once (30-day cookie).
- "Draft next topic" pulls from the 20-topic seeded queue → Claude drafts →
  review/edit → **Approve & publish** → live at `/blog/<slug>` immediately
  (blog renders from the DB; the four launch articles are seeded and also
  serve as the no-DB fallback).
- Weekly cron drafts one article and emails "a draft is waiting."
- Monthly cron drafts the newsletter digest; approve & send from /admin →
  queued to the nurture list (health-check leads) with suppression respected
  and one-click unsubscribe.

## Analytics

Vercel Analytics (enable in the Vercel dashboard) + first-party `events`
table. Conversion events: `health_check_completed`, `chat_lead_captured`,
`booking_paid`, `bookings_link_clicked`, `phone_clicked`.

## GoDaddy DNS cutover (launch day)

Add/change **only** these records:

| Type | Name | Value |
|---|---|---|
| A | `@` | `76.76.21.21` |
| CNAME | `www` | `cname.vercel-dns.com` |

(First add `lakecumberlandcomputers.com` + `www` under Vercel → Project →
Settings → Domains so Vercel expects them.)

### DO NOT TOUCH — these keep M365 email alive

- **MX** records (`*.mail.protection.outlook.com`)
- **TXT `v=spf1 ...`** (SPF)
- **CNAME `autodiscover`** (Outlook setup)
- **CNAME `selector1._domainkey` / `selector2._domainkey`** (DKIM)
- Any records Resend verification added

Changing the A record moves only the website; email flows through MX and
never touches Vercel.

> Worth doing while you're in there: the domain currently has **no DMARC
> record** (the health check grades it F). Add TXT `_dmarc` →
> `v=DMARC1; p=none; rua=mailto:info@lakecumberlandcomputers.com` to start
> monitoring, then tighten to `quarantine` after a couple of clean weeks.

## Redirects for old indexed URLs

If the previous site had indexed pages, map them in `next.config.ts`:

```ts
async redirects() {
  return [
    { source: "/old-services.html", destination: "/services", permanent: true },
    // pull the real list from Google Search Console → Pages
  ];
}
```

## Launch-day checklist

1. Set all production env vars in Vercel (list above); redeploy.
2. Stripe **test mode**: full booking → confirm → ICS/email → cancel →
   auto-refund. Then switch keys to **live mode**.
3. Live-fire test: book the cheapest real service (Remote Support, $49) with
   a real card, verify email + SMS + calendar event, cancel via the manage
   link, confirm the automatic refund in Stripe.
4. Flip DNS at GoDaddy (table above). Verify https://lakecumberlandcomputers.com
   serves the new site and **send/receive a test email** to confirm mail flow
   untouched. Then update `NEXT_PUBLIC_SITE_URL` in Vercel to
   `https://lakecumberlandcomputers.com` (it points at the vercel.app URL
   until cutover) and redeploy — this fixes canonicals and email links.
5. Verify the Stripe webhook endpoint points at the production domain.
6. Google Business Profile: align NAP exactly — Lake Cumberland Computers,
   478 Lakeway Dr, Russell Springs, KY 42642, (270) 866-8660 — and set the
   website URL. Copy the "Ask for reviews" link into `GOOGLE_REVIEW_URL`.
7. Fix stray directory listings (Yelp/BBB/Facebook) to the same NAP.
8. Submit `https://lakecumberlandcomputers.com/sitemap.xml` in Search Console;
   add redirects for any old URLs it reports.
9. Turn on Vercel Web Analytics; watch the events table for the first
   conversions.
10. Announce — and run the health check on a few local offices' domains as
    conversation starters.

## Post-launch content TODOs

- **Photos:** every `<PhotoSlot>` (home, about) marks where real photos of
  Louis, the technicians, and the shop drop in. No stock, no AI people.
- **Testimonials:** `components/sections/Testimonials.tsx` has three slots
  waiting on real, permissioned quotes — fill the `slots` array.
- **GOOGLE_REVIEW_URL** env var (see checklist).

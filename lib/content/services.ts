import type { FaqItem } from "@/lib/jsonld";

export interface ServicePage {
  slug: string;
  name: string;
  metaTitle: string;
  metaDescription: string;
  heroKicker: string;
  heroTitle: string;
  /** Problem-focused intro paragraphs. */
  intro: string[];
  whatsIncludedTitle: string;
  whatsIncluded: string[];
  whoForTitle: string;
  whoFor: string[];
  closing: string[];
  faq: FaqItem[];
}

export const servicePages: ServicePage[] = [
  {
    slug: "managed-it",
    name: "Managed IT Support",
    metaTitle: "Managed IT Support in Russell Springs & South-Central KY",
    metaDescription:
      "One local number to call when anything with a plug misbehaves. Managed IT support for government offices, small businesses, and medical practices — since 2001.",
    heroKicker: "Managed IT Support",
    heroTitle: "One local call, and it's handled.",
    intro: [
      "Most offices around here don't have an IT department. They have a front-desk person who's \"good with computers,\" a drawer full of old cables, and a growing list of things nobody wants to touch — the server in the closet, the backup that may or may not be running, the printer that drops off the network every other Tuesday.",
      "Managed IT support means that list becomes our list. We watch your machines, patch what needs patching, fix what breaks, and answer the phone when someone can't work. You get back to running your office; we keep the computers out of your way.",
      "We've been doing exactly this for offices across Russell, Pulaski, Adair, Wayne, Clinton, and Casey counties since 2001. When you call, you get a technician who has probably been in your building — not a ticket queue in another state.",
    ],
    whatsIncludedTitle: "What managed support covers",
    whatsIncluded: [
      "Help desk by phone, remote session, or an on-site visit when it needs hands",
      "Monitoring and maintenance for workstations and servers — updates applied, problems caught early",
      "Backup setup and regular verification, so \"we have backups\" is a fact, not a hope",
      "Antivirus / endpoint protection managed centrally across every machine",
      "New computers set up, old ones retired and wiped properly",
      "User changes handled promptly — new hires ready on day one, departures locked out the same day",
      "Vendor wrangling: we deal with the internet company, the software vendor, and the copier people so you don't have to",
      "Plain-English reporting — what we did, what we're watching, what to budget for",
    ],
    whoForTitle: "Who this is for",
    whoFor: [
      "County and city offices that need dependable computers and a vendor who understands public-sector accountability",
      "Small businesses with 3–50 employees and no in-house IT",
      "Medical and dental practices that need their systems handled with HIPAA obligations in mind",
      "Nonprofits, churches, and utility districts that want one trustworthy local number",
    ],
    closing: [
      "There's no one-size-fits-all price for this, because no two offices run the same — a three-person insurance agency and a courthouse full of clerks need different things. We'll look at what you have, tell you honestly what needs attention (and what doesn't), and put a fixed monthly number on it. The consultation costs nothing.",
    ],
    faq: [
      {
        question: "What does managed IT support cost?",
        answer:
          "It depends on how many people and machines you have and what shape they're in. After a free consultation we quote a flat monthly rate — no surprise hourly bills for routine support. We don't publish pricing because we'd rather quote your office accurately than average everyone else's.",
      },
      {
        question: "How fast can you get to us when something breaks?",
        answer:
          "We're in Russell Springs, and we serve the counties around us — so you're calling a shop down the road, not a national call center. Many problems are fixed the same call by remote session. When it takes hands on hardware, we schedule an on-site visit, urgent things first.",
      },
      {
        question: "We already have someone who helps us occasionally. Why switch?",
        answer:
          "Occasional help works until the day it doesn't — the person is on vacation, the backup was never checked, the password list lives in one head. Managed support means documented systems, verified backups, and a team of technicians instead of a single point of failure.",
      },
      {
        question: "Do we have to sign a long contract?",
        answer:
          "We'll go over terms in the consultation and put everything in writing before you commit to anything. What we can say up front: we've kept clients since 2001 by doing the work, not by trapping anyone in paperwork.",
      },
    ],
  },
  {
    slug: "cybersecurity",
    name: "Cybersecurity",
    metaTitle: "Cybersecurity for Small Offices & Local Government in KY",
    metaDescription:
      "Practical protection against ransomware, phishing, and account takeover for small Kentucky offices — layered defenses, tested backups, and straight answers. No scare tactics.",
    heroKicker: "Cybersecurity",
    heroTitle: "Practical security for offices that can't afford a bad week.",
    intro: [
      "Ransomware crews don't only go after big corporations. Small governments, clinics, and family businesses get hit precisely because attackers assume nobody's watching the door — one convincing email, one reused password, and suddenly the files are encrypted and the phones are ringing.",
      "We won't sell you fear, and we won't promise you'll never be attacked — nobody honest can promise that. What we do is stack practical, proven layers so an attack is far less likely to land, and far less damaging if it does: strong sign-in protection, patched systems, protected endpoints, trained people, and backups that have actually been tested.",
      "It's the same posture we maintain for offices that handle public records and patient information, applied at a scale that makes sense for you.",
    ],
    whatsIncludedTitle: "The layers we put in place",
    whatsIncluded: [
      "Multi-factor authentication (MFA) rolled out to email and critical accounts — the single highest-value fix most offices are missing",
      "Endpoint protection on every workstation and server, centrally monitored",
      "Patching discipline: operating systems and software kept current, quietly",
      "Email protection — filtering, spoofing defenses (SPF, DKIM, DMARC), and sensible rules",
      "Backups that follow the 3-2-1 idea, with restores tested — because a backup you've never restored is a rumor",
      "Staff awareness: short, non-condescending training on spotting phishing before it's clicked",
      "Access cleanup: former employees out, shared passwords retired, admin rights trimmed to who needs them",
      "A written, plain-English rundown of where you stand and what we'd fix first",
    ],
    whoForTitle: "Who this is for",
    whoFor: [
      "County and city offices holding records the public depends on — and that ransomware crews specifically target",
      "Medical and dental practices with HIPAA obligations and patient data to protect",
      "Businesses that would lose real money if email or files disappeared for a week",
      "Any office that has never had an outside set of eyes check its security posture",
    ],
    closing: [
      "If you're not sure where you stand, start with our free Microsoft 365 Security Health Check — it reads your domain's public email-security records and grades them, no access to your systems required. It's a fifteen-second way to find out whether the basics are in place.",
      "From there, a free consultation covers what the public checks can't see: backups, endpoints, MFA, and how your people actually work.",
    ],
    faq: [
      {
        question: "Can you guarantee we won't get ransomware?",
        answer:
          "No — and you should hang up on anyone who says yes. What layered security does is make a successful attack much less likely and much less costly: attackers move on to softer targets, and tested backups mean an incident becomes a bad day instead of a closed office.",
      },
      {
        question: "We're a small office. Would anyone really target us?",
        answer:
          "Most attacks aren't targeted at all — they're automated and go wherever a door is open. Small offices get hit because a shared password leaked or one email got clicked. Size isn't protection; the basics are.",
      },
      {
        question: "Are you HIPAA certified?",
        answer:
          "There's no such thing as an official HIPAA certification, and we don't claim credentials we don't hold. What we offer is years of hands-on experience supporting medical and dental practices and configuring systems with HIPAA obligations in mind — access controls, encryption, backups, and audit-friendly habits.",
      },
      {
        question: "What does this cost?",
        answer:
          "Security work is scoped to your office — machine count, what data you hold, what's already in place. The health check and the consultation are free, and after that you'll get a written quote before anything is billed.",
      },
    ],
  },
  {
    slug: "microsoft-365",
    name: "Microsoft 365",
    metaTitle: "Microsoft 365 Setup, Migration & Support in South-Central KY",
    metaDescription:
      "Microsoft 365 set up right: migration, security defaults, backups, and local support for email, files, and Teams. For offices in Russell Springs, Somerset, and beyond.",
    heroKicker: "Microsoft 365",
    heroTitle: "Your email and files, set up right and locked down.",
    intro: [
      "Microsoft 365 runs most offices now — email, calendars, shared files, Teams. And most of the installations we see were set up once, years ago, by whoever had an afternoon free. It works, mostly. But nobody's sure who has access to what, the old employee's mailbox is still active, and \"security defaults\" are whatever the setup wizard picked.",
      "We set 365 up properly, migrate you onto it without losing a folder, and keep it maintained — accounts, licenses, sharing, security. The difference between 365 that mostly works and 365 that's actually managed shows up the first time something goes wrong.",
    ],
    whatsIncludedTitle: "What we handle",
    whatsIncluded: [
      "Migration from old email (GoDaddy mail, POP accounts, aging Exchange servers, Gmail) with mail, contacts, and calendars intact",
      "Sensible security from day one: MFA, anti-spoofing records (SPF, DKIM, DMARC), and safe sharing defaults",
      "License right-sizing — most offices pay for plans they don't use; we match licenses to people",
      "OneDrive and SharePoint set up so files are organized, shared on purpose, and recoverable",
      "Teams configured for how your office actually communicates",
      "Backup for 365 data — Microsoft hosts your mail; it doesn't promise to restore what gets deleted",
      "Ongoing admin: new users, departures, shared mailboxes, distribution lists, the works",
      "Straight answers about what 365 can and can't do before you commit to anything",
    ],
    whoForTitle: "Who this is for",
    whoFor: [
      "Offices still on ISP or GoDaddy email that want their own domain handled professionally",
      "Organizations already on 365 that have never had the security settings reviewed",
      "County and city offices standardizing on Microsoft tools",
      "Practices and firms that need email retention and access control taken seriously",
    ],
    closing: [
      "Not sure how your current setup scores? Run the free M365 Security Health Check — it grades your domain's public email-security records in about fifteen seconds and emails you a plain-English report. If the grades come back rough, we'll walk you through them for free.",
    ],
    faq: [
      {
        question: "We're on the free version of Gmail with @gmail.com addresses. Is that a problem?",
        answer:
          "For a business, yes — customers can't verify you, you can't control who owns the account if an employee leaves, and you're missing the security and backup controls a business needs. Getting your own domain with properly configured email is one of the cheapest credibility and security upgrades available, and we handle the whole move.",
      },
      {
        question: "Will we lose email during a migration?",
        answer:
          "No. Migrations are staged so old mail keeps flowing until the moment of cutover, then everything — messages, folders, contacts, calendars — comes across. The office keeps working while it happens; the cutover itself is scheduled for a quiet window.",
      },
      {
        question: "Doesn't Microsoft already back up our email?",
        answer:
          "Microsoft keeps its service running, but recovering a mailbox someone emptied six months ago, or files a departed employee deleted, is your problem, not theirs. A separate 365 backup covers the gap — it's inexpensive and we set it up as standard practice.",
      },
      {
        question: "Can you just fix one thing, or do we have to sign up for everything?",
        answer:
          "We'll happily do a defined project — a migration, a security cleanup, a licensing review. Plenty of managed clients started with one project that went well.",
      },
    ],
  },
  {
    slug: "networking-wifi",
    name: "Network & Wi-Fi",
    metaTitle: "Business Network & Wi-Fi Installation in South-Central KY",
    metaDescription:
      "Wired and wireless networks that stay up — cabling, switches, firewalls, and Wi-Fi that reaches every corner. Design, installation, and support for offices across the lake region.",
    heroKicker: "Network & Wi-Fi",
    heroTitle: "A network you stop thinking about.",
    intro: [
      "You notice your network twice: when it's being installed, and every single day it doesn't work right. The card reader that times out, the Wi-Fi that dies in the back offices, the mystery switch under a desk with one blinking light nobody trusts.",
      "We design, install, and support networks for offices, shops, clinics, and public buildings — the cabling in the walls, the equipment in the closet, and the Wi-Fi in the air. Sized for the building you have and the work you do, documented so it isn't a mystery, and supported by the people who built it.",
    ],
    whatsIncludedTitle: "What we build and support",
    whatsIncluded: [
      "Network design for new buildings, remodels, and offices that grew one cable at a time",
      "Professional cabling — labeled, tested, and terminated in a closet you're not embarrassed to open",
      "Business-grade firewalls and switches configured for security, not just connectivity",
      "Wi-Fi coverage engineered for the actual floor plan — including metal buildings and thick block walls",
      "Separate guest and public Wi-Fi that keeps visitors off your internal network",
      "VPN and remote access done safely for people who work from home or the field",
      "Internet service troubleshooting — and we'll talk to the ISP for you",
      "Documentation and labeling, so the next problem is a five-minute fix instead of an archaeology dig",
    ],
    whoForTitle: "Who this is for",
    whoFor: [
      "Offices with dead spots, daily drops, or equipment nobody remembers installing",
      "New construction and remodels that need cabling done once and done right",
      "Courthouses, clinics, and shops that need public Wi-Fi separated from sensitive systems",
      "Multi-building operations — schools, utility districts, churches with a fellowship hall across the lot",
    ],
    closing: [
      "If your network's history is \"it grew,\" a free consultation is the right first step. We'll look at what's there, tell you what's solid and what's fragile, and quote exactly what fixing it takes — in writing, before any work starts.",
    ],
    faq: [
      {
        question: "Our Wi-Fi is slow in half the building. Do we need new internet service?",
        answer:
          "Usually not. Nine times out of ten the culprit is placement and equipment — one consumer router asked to cover a building it can't reach. Proper access points, placed for your floor plan, usually fix 'slow Wi-Fi' without touching the internet plan.",
      },
      {
        question: "Do you do the actual cabling, or subcontract it?",
        answer:
          "Our technicians run, terminate, and test the cabling ourselves for typical office scale, and every drop is labeled and documented before we call it done.",
      },
      {
        question: "Can you work on a building that's under construction?",
        answer:
          "Yes — earlier is better. Getting cable in before the drywall closes is dramatically cheaper than fishing it after. We're glad to coordinate with your contractor.",
      },
      {
        question: "What brands of equipment do you install?",
        answer:
          "Business-grade equipment we can manage and stand behind, chosen for your budget and the building. We're not locked to one vendor, and we'll tell you plainly why we're recommending what we recommend.",
      },
    ],
  },
  {
    slug: "phone-systems-voip",
    name: "Business Phone Systems (VoIP)",
    metaTitle: "Business Phone Systems (VoIP) in South-Central Kentucky",
    metaDescription:
      "Modern VoIP phone service for local offices — keep your numbers, add auto-attendants and mobile apps, and get local installation and support instead of a distant helpline.",
    heroKicker: "Business Phones (VoIP)",
    heroTitle: "Phones that work like it's this decade.",
    intro: [
      "A lot of local offices are paying old-landline prices for phones that can't do much more than ring. Meanwhile the modern replacement — VoIP, phone service over your internet connection — costs less, does more, and doesn't tie your number to a box on the wall.",
      "The catch: VoIP bought from a faraway provider comes with faraway support. We install and support business phone systems locally — we set up the system, program it for how your office answers calls, train your staff in person, and answer the phone ourselves when you have a question.",
    ],
    whatsIncludedTitle: "What a modern system gets you",
    whatsIncluded: [
      "Your existing numbers, moved over — the number your customers know stays yours",
      "Auto-attendant menus (\"press 1 for the clerk's office…\") recorded and programmed for you",
      "Desk phones, cordless handsets, and softphone apps — take the office line on your cell without giving out your cell",
      "Voicemail delivered to email, so messages don't live on a blinking light",
      "Ring groups and call routing that match how your office actually answers",
      "Hold music or announcements, hours-based routing for nights and holidays",
      "On-site installation and real training — nobody's left guessing at a manual",
      "Local support afterward, from the team that installed it",
    ],
    whoForTitle: "Who this is for",
    whoFor: [
      "Offices paying legacy phone-company prices for features from 1998",
      "County and city departments that need calls routed reliably to the right desk",
      "Businesses whose staff work between the office, home, and the road",
      "Anyone whose \"phone system\" is a tangle of forwarded cell phones",
    ],
    closing: [
      "Phone systems are quoted per office — line count, handsets, and call flow all matter. Bring us a recent phone bill and we'll show you what the same service costs done modern, with local support included. The consultation and the quote are free.",
    ],
    faq: [
      {
        question: "Do we lose our phone number if we switch?",
        answer:
          "No. Numbers are ported to the new service — the process is standard, we handle the paperwork, and your old number rings on the new phones. There's a short overlap window, so calls are never missed during the change.",
      },
      {
        question: "What happens to the phones if the internet goes out?",
        answer:
          "Calls automatically fail over to cell phones or another number you choose, so the office stays reachable. That's honestly better than the old way — a downed landline just rang busy.",
      },
      {
        question: "Is call quality really as good as a landline?",
        answer:
          "On a properly set-up network, yes — that's why we check your internet connection and network before quoting, not after installing. If your connection can't carry good calls, we'll tell you first.",
      },
      {
        question: "Can we keep our existing desk phones?",
        answer:
          "Sometimes — many newer IP phones can be reprogrammed for the new service. Bring us the model numbers and we'll tell you what's reusable before you spend anything on hardware.",
      },
    ],
  },
  {
    slug: "cameras-access-control",
    name: "Security Cameras & Door Access",
    metaTitle: "Security Cameras & Door Access Control in South-Central KY",
    metaDescription:
      "Camera systems you can actually pull footage from, and door access that beats a drawer full of keys. Local installation and support for offices, shops, and public buildings.",
    heroKicker: "Cameras & Access Control",
    heroTitle: "Know what happened. Control who gets in.",
    intro: [
      "Two questions come up after every incident at a building: \"Did the cameras catch it?\" and \"Who had a key?\" Too often the honest answers are \"the DVR stopped recording in March\" and \"we're not sure.\"",
      "We install camera and door-access systems that hold up when you need them — cameras with footage you can actually find and export, and electronic door access that means a lost fob is a ten-second deactivation instead of a locksmith visit and a weekend of worry.",
    ],
    whatsIncludedTitle: "What we install and support",
    whatsIncluded: [
      "Camera systems planned for real coverage — entries, registers, lots, hallways — not just a camera in each corner",
      "Clear night-time image quality where it matters, and honest talk about what any camera can't see",
      "Recording with sensible retention, checked as part of support — no more discovering the DVR died months ago",
      "Live view and playback from your phone or desk, secured properly (no port-forwarded DVRs exposed to the internet)",
      "Footage export help when law enforcement or insurance asks",
      "Electronic door access — fobs, cards, or codes — with per-person, per-door, per-schedule control",
      "Instant deactivation for lost fobs and departed employees",
      "Access logs, so \"who came in Saturday night?\" has an answer",
    ],
    whoForTitle: "Who this is for",
    whoFor: [
      "Courthouses and public buildings balancing open access with secured areas",
      "Shops and offices that want an answer, not a shrug, after an incident",
      "Medical practices controlling access to records and medication storage",
      "Property owners tired of re-keying buildings every time staff changes",
    ],
    closing: [
      "Camera and access systems are quoted by walkthrough — building layout, door count, and coverage goals set the price. The walkthrough is free, and the quote is written and itemized. If a smaller system covers your real risk, that's what we'll recommend.",
    ],
    faq: [
      {
        question: "Can I see the cameras from my phone?",
        answer:
          "Yes — live view and recorded playback, secured with a proper account and MFA rather than the risky port-forwarding tricks that put camera systems on the open internet.",
      },
      {
        question: "How long is footage kept?",
        answer:
          "That's a storage decision, not a limitation — we size the recorder for the retention you want. We'll recommend a sensible window for your situation, and public offices with records obligations can go longer.",
      },
      {
        question: "We already have cameras, but the picture is useless at night. Options?",
        answer:
          "Often the fix is targeted — better cameras at key spots, adjusted placement, added lighting — rather than a full replacement. We'll assess what's salvageable before quoting anything new.",
      },
      {
        question: "Is door access practical for a small office?",
        answer:
          "More than ever. A single controlled door with a handful of fobs is a modest project, and it ends key anxiety permanently: nobody copies a fob at the hardware store, and lost ones die in seconds.",
      },
    ],
  },
];

export function getServicePage(slug: string): ServicePage | undefined {
  return servicePages.find((s) => s.slug === slug);
}

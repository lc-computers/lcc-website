export interface AreaPage {
  slug: string;
  town: string;
  county: string;
  metaTitle: string;
  metaDescription: string;
  heroTitle: string;
  /** Body paragraphs — genuinely local, 300+ words per page. */
  paragraphs: string[];
  /** Travel-fee note shown with the residential menu. */
  travelNote: string;
}

export const areaPages: AreaPage[] = [
  {
    slug: "russell-springs",
    town: "Russell Springs",
    county: "Russell",
    metaTitle: "Computer & IT Services in Russell Springs, KY",
    metaDescription:
      "Lake Cumberland Computers is headquartered on Lakeway Dr in Russell Springs. Business IT support and flat-rate in-home tech help with no travel fee inside the city.",
    heroTitle: "IT support from right here in Russell Springs.",
    paragraphs: [
      "Russell Springs is home base. Our shop sits at 478 Lakeway Dr, and we've worked from this town since 2001 — long enough to have watched Highway 127 businesses change hands, offices computerize, and half the county move its paperwork into the cloud. When something breaks, we're not dispatching from two hours away; we're already here.",
      "For businesses and offices in Russell Springs, that closeness matters in a practical way: a technician can be at your door quickly when a problem needs hands, and you can stop by the shop and talk to a person who knows your setup. We support offices, retail businesses, and medical practices in town with managed IT, Microsoft 365, cybersecurity, networking, business phones, and camera systems — the same services we provide to government offices across the region.",
      "For homes, Russell Springs addresses get our flat-rate in-home services with no travel fee at all — the price on the menu is the price, period. A $99 in-home visit means a technician at your door at a confirmed time you picked online, not a \"sometime Thursday\" window. Virus cleanup, new-computer setup, Wi-Fi that finally reaches the back bedroom — posted prices, paid online, done.",
      "You can book a home visit online in about two minutes, or start a conversation about your business with a free consultation. And if you'd rather just talk to somebody, call the shop — it's a local number, and a local person answers it.",
    ],
    travelNote: "No travel fee inside Russell Springs — menu price is the total price.",
  },
  {
    slug: "jamestown",
    town: "Jamestown",
    county: "Russell",
    metaTitle: "Computer & IT Services in Jamestown, KY",
    metaDescription:
      "Business IT and in-home computer help for Jamestown, KY — the Russell County seat. Ten minutes from our Russell Springs shop, with flat-rate residential pricing.",
    heroTitle: "Jamestown's IT help, ten minutes up the road.",
    paragraphs: [
      "Jamestown is the seat of Russell County — the courthouse, the county offices, and the government paperwork that keeps the county running all live here, a ten-minute drive from our shop in Russell Springs. That proximity is exactly why serving government offices well matters so much to us: the offices that maintain deeds, court records, and county business can't afford systems that fail quietly or a vendor who's hard to reach.",
      "We work with public-sector and business offices in Jamestown on managed IT support, cybersecurity, Microsoft 365, networking, phones, and building security — with procurement-friendly paperwork, a local entity you can verify (Lake Cumberland Computers is a service of Stargel Technologies LLC), and a W-9 on request. If your office handles public records, ask about our free security posture report; it's a passive check of your email domain's defenses, graded in plain English.",
      "Jamestown is also the gateway to Wolf Creek Dam and the lake — which means marinas, rentals, and seasonal businesses whose busiest weeks are exactly when the internet, the card reader, or the booking computer picks to act up. We keep those systems running, and we answer the phone in season.",
      "For homes in Jamestown, every flat-rate service on our menu is available at the posted price plus a flat $25 travel fee — shown clearly before you pay, never added after. Prefer no travel fee at all? A $49 remote support session connects a technician to your computer over a secure screen share, no driving involved.",
    ],
    travelNote: "Jamestown addresses add a flat $25 travel fee, shown before you pay. Remote sessions have no travel fee, ever.",
  },
  {
    slug: "somerset",
    town: "Somerset",
    county: "Pulaski",
    metaTitle: "Computer & IT Services in Somerset, KY",
    metaDescription:
      "Managed IT, Microsoft 365, and cybersecurity for Somerset and Pulaski County businesses — plus flat-rate in-home tech help booked and paid online.",
    heroTitle: "Somerset-sized business. Local-sized accountability.",
    paragraphs: [
      "Somerset is the commercial center of the lake region — the Pulaski County seat and the biggest business community we serve. It's also where offices most often find themselves stuck between two bad options: national IT providers who treat them like a ticket number, or going it alone with whoever happens to be handy. We're the third option: a real IT company, close enough to show up.",
      "We support Somerset offices — professional firms, medical and dental practices, shops, and public-sector departments — with managed IT, Microsoft 365 done properly, practical cybersecurity, network and Wi-Fi installation, VoIP phone systems, and camera and door-access systems. Somerset businesses tend to be a size where email security and access control genuinely matter but a full-time IT hire doesn't pencil out; that's precisely the gap we've filled for offices around the lake since 2001.",
      "If you run on Microsoft 365 (or think you might be paying for it without using it), start with our free M365 Security Health Check — enter your domain, and in about fifteen seconds you'll get letter grades on the email-security records that determine whether your organization can be impersonated. It's the same passive check we run at the start of a real engagement, free, with a plain-English report.",
      "For Somerset homes, the full flat-rate menu applies — virus removal, new-computer setup, Wi-Fi fixes, in-home tech help — at posted prices plus a flat $25 travel fee, shown before you pay. Or skip the drive entirely: a $49 remote session gets a technician on your screen with no travel fee at all.",
    ],
    travelNote: "Somerset addresses add a flat $25 travel fee, shown before you pay. Remote sessions have no travel fee, ever.",
  },
  {
    slug: "columbia",
    town: "Columbia",
    county: "Adair",
    metaTitle: "Computer & IT Services in Columbia, KY",
    metaDescription:
      "IT support for Columbia and Adair County — offices, campus-area businesses, and homes. Managed IT, M365, networking, and flat-rate in-home tech help.",
    heroTitle: "Columbia and Adair County, covered.",
    paragraphs: [
      "Columbia sits just up the Cumberland Parkway from us — the Adair County seat, a courthouse square that still functions as one, and a town with an unusual mix for its size: county government, a hospital, a college campus at Lindsey Wilson, and the small businesses that grow up around all three.",
      "That mix means Columbia offices carry serious data: student records, patient information, county files, donor lists. We support them with managed IT, Microsoft 365 administration, practical cybersecurity, and the physical layer too — network cabling, Wi-Fi that covers old buildings with thick walls, phone systems, cameras, and door access. All of it with a local vendor's accountability: the technician who set up your system is the one who answers when it misbehaves.",
      "Government offices in Columbia get the same procurement-friendly footing we offer every public entity we serve — a verifiable local legal entity, W-9 on request, budget-cycle-aware quotes in writing, and a free security posture report that reads your domain's public email-security records and grades them in plain English. No access to your systems needed, no strings attached.",
      "For homes in Columbia and around Adair County, our flat-rate menu — $99 in-home tech help, $149 virus removal, $129 new-computer setup or Wi-Fi fix — applies at the posted price plus a flat $25 travel fee, displayed clearly before you pay. The $49 remote session skips the travel fee entirely: a technician calls at your appointment time and fixes things over a secure screen share.",
    ],
    travelNote: "Columbia addresses add a flat $25 travel fee, shown before you pay. Remote sessions have no travel fee, ever.",
  },
  {
    slug: "monticello",
    town: "Monticello",
    county: "Wayne",
    metaTitle: "Computer & IT Services in Monticello, KY",
    metaDescription:
      "IT support and in-home computer help for Monticello and Wayne County, on the south side of Lake Cumberland. Business IT, networking, and flat-rate home services.",
    heroTitle: "South of the lake, still close by.",
    paragraphs: [
      "Monticello — the Wayne County seat, on the south side of Lake Cumberland — calls itself the houseboat capital, and the businesses there live a genuinely seasonal rhythm: marinas, boat dealers, rentals, and the shops and offices that keep the town running year-round. We serve both halves of that economy.",
      "For the year-round offices — county and city departments, clinics, law offices, banks-adjacent businesses — we provide managed IT, Microsoft 365, cybersecurity, networking, phones, and camera systems with the kind of local accountability that matters when you're across the lake from most vendors: documented systems, straight answers, and a technician who actually makes the drive.",
      "For the seasonal businesses, timing is everything. The point-of-sale, the reservation computer, and the Wi-Fi guests complain about all need to work in May, not get looked at in July. We do off-season installs and pre-season checkups so the systems are solid before the water gets busy — and remote support means many in-season problems are fixed the same day, over a screen share, without waiting on a truck.",
      "Wayne County homes get our full flat-rate residential menu at posted prices plus a flat $25 travel fee, always shown before you pay. And for anything that doesn't need hands on hardware, the $49 remote session is the no-travel-fee option: book online, and a technician calls at the appointment time you chose.",
    ],
    travelNote: "Monticello addresses add a flat $25 travel fee, shown before you pay. Remote sessions have no travel fee, ever.",
  },
  {
    slug: "albany",
    town: "Albany",
    county: "Clinton",
    metaTitle: "Computer & IT Services in Albany, KY",
    metaDescription:
      "IT support for Albany and Clinton County, KY — business and government IT, plus flat-rate in-home computer help and remote support with no travel fee.",
    heroTitle: "Albany and Clinton County — yes, we come there.",
    paragraphs: [
      "Albany sits at the southern edge of our service area, down near the Tennessee line — the Clinton County seat, with Dale Hollow Lake to one side and Lake Cumberland to the other. Towns this far from the interstate hear the same thing from a lot of service companies: \"that's outside our area.\" Not from us. Clinton County has been part of our coverage since the beginning.",
      "Albany's offices — county and city government, the school system's vendors, clinics, farms that have quietly become data-dependent businesses — need the same things offices anywhere need: email that can't be spoofed, backups that restore, networks that stay up, and somebody accountable when they don't. We provide managed IT, Microsoft 365, security, networking, phones, and cameras, with written quotes and a local entity behind them.",
      "Distance is also exactly why we've built our remote tools the way we have. A $49 remote support session gets a technician on your screen at a confirmed appointment time — no travel fee, no waiting on a truck, and it solves a surprising share of everyday problems: email trouble, slow machines, software questions, printer arguments. For businesses, much of our monthly support happens remotely too, with on-site visits when the job needs hands.",
      "When it does need hands, we drive. In-home services in Albany run at the posted flat rate plus a flat $25 travel fee — you'll see the total, travel included, before you pay a dime. Book online, pick a real time slot, and a technician shows up when it says they will.",
    ],
    travelNote: "Albany addresses add a flat $25 travel fee, shown before you pay. Remote sessions have no travel fee, ever.",
  },
];

export function getAreaPage(slug: string): AreaPage | undefined {
  return areaPages.find((a) => a.slug === slug);
}

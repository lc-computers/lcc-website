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
      "For homes in Jamestown, every flat-rate service on our menu is available at the posted price with no travel fee — Jamestown is local for us, so the price on the menu is the price at your door. Rather not have anyone drive out at all? A $49 remote support session connects a technician to your computer over a secure screen share.",
    ],
    travelNote: "No travel fee in Jamestown — menu price is the total price, same as Russell Springs.",
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
  {
    slug: "campbellsville",
    town: "Campbellsville",
    county: "Taylor",
    metaTitle: "Computer & IT Services in Campbellsville, KY",
    metaDescription:
      "Managed IT, Microsoft 365, and cybersecurity for Campbellsville and Taylor County offices — plus flat-rate in-home computer help booked and paid online.",
    heroTitle: "Campbellsville and Taylor County, within reach.",
    paragraphs: [
      "Campbellsville is the northwest corner of our service area — the Taylor County seat, up KY-55 from Columbia, with Green River Lake at its doorstep. For a town its size it carries a lot of economy: a university, a hospital, distribution and manufacturing payrolls, and the professional offices, clinics, and shops that grow up around all of them.",
      "That mix produces exactly the kind of offices we work with every day: businesses big enough that email security, backups, and network reliability genuinely matter, but not big enough to justify a full-time IT department. We support Campbellsville offices with managed IT, Microsoft 365 done properly, practical cybersecurity, network and Wi-Fi installation, VoIP phone systems, and camera and door-access systems — with a local vendor's accountability behind every install.",
      "Public-sector offices in Taylor County get the same procurement-friendly footing we offer every government client: a verifiable local legal entity (Lake Cumberland Computers is a service of Stargel Technologies LLC), a W-9 on request, written quotes that respect a budget cycle, and a free security posture report — a passive, plain-English grading of your email domain's public security records, no access to your systems required.",
      "For Campbellsville homes, the full flat-rate menu applies — $99 in-home tech help, $149 virus removal, $129 new-computer setup or Wi-Fi fix — at the posted price plus a flat $25 travel fee, shown clearly before you pay. Or skip the drive: a $49 remote support session puts a technician on your screen at a confirmed appointment time, with no travel fee at all.",
    ],
    travelNote: "Campbellsville addresses add a flat $25 travel fee, shown before you pay. Remote sessions have no travel fee, ever.",
  },
  {
    slug: "liberty",
    town: "Liberty",
    county: "Casey",
    metaTitle: "Computer & IT Services in Liberty, KY",
    metaDescription:
      "IT support for Liberty and Casey County, KY — county offices, farms, and small businesses, plus flat-rate in-home computer help and $49 remote support.",
    heroTitle: "Liberty and Casey County — closer than you'd think.",
    paragraphs: [
      "Liberty sits north of us on US-127 — the Casey County seat, in some of the best farm country in south-central Kentucky. It's easy to assume a town like Liberty is off every IT company's map. It isn't off ours; Casey County has been part of our stated service area from the start, and 127 is a road we know well.",
      "Casey County's economy is more computerized than it looks from the road. Farms run on spreadsheets, market apps, and equipment that phones home. Sawmills, small manufacturers, and ag businesses run payroll, invoicing, and inventory on machines nobody has time to babysit. And the county's offices — courthouse, clerk, schools' vendors, clinics — handle records that deserve the same protection as any city agency's. We support all of it: managed IT, Microsoft 365, practical cybersecurity, networking, phones, and cameras, with written quotes and straight answers.",
      "For government offices in Liberty, we speak procurement: a verifiable local entity, W-9 on request, and a free security posture report that grades your email domain's public security records in plain English — the kind of document that's genuinely useful to hand a magistrate or a fiscal court when the subject of cybersecurity comes up.",
      "For homes in Liberty and around Casey County, every service on our flat-rate menu is available at the posted price plus a flat $25 travel fee, shown before you pay — and the $49 remote session skips the travel fee entirely. Book online, pick a real time slot, and a technician calls or knocks exactly when it says they will.",
    ],
    travelNote: "Liberty addresses add a flat $25 travel fee, shown before you pay. Remote sessions have no travel fee, ever.",
  },
  {
    slug: "burkesville",
    town: "Burkesville",
    county: "Cumberland",
    metaTitle: "Computer & IT Services in Burkesville, KY",
    metaDescription:
      "IT support and in-home computer help for Burkesville and Cumberland County, KY — near Dale Hollow Lake. Business IT, flat-rate home services, remote support.",
    heroTitle: "Burkesville and Cumberland County — we make the drive.",
    paragraphs: [
      "Burkesville sits on a bend of the Cumberland River — the Cumberland County seat, down in the far southwest of our service area with Dale Hollow Lake close by. Towns this size, this far from an interstate, get told \"that's outside our area\" by nearly every service company they call. We're the exception on purpose: if you're in Cumberland County, you're in our coverage.",
      "Burkesville's offices — county and city government, the clerk's records, clinics, banks-adjacent businesses, and the marinas and outfitters that work Dale Hollow's seasons — need the same fundamentals as any office anywhere: email that can't be spoofed, backups that actually restore, a network that stays up, and a vendor who answers the phone. We provide managed IT, Microsoft 365, cybersecurity, networking, business phones, and camera systems, backed by a local legal entity you can verify and a W-9 on request.",
      "Distance is also why remote support carries so much of the load out here. A $49 remote session gets a technician on your screen at a confirmed appointment time — no travel fee, no waiting on a truck — and it resolves a surprising share of everyday problems: email trouble, slow computers, software questions, printers being printers. For business clients, most month-to-month support happens the same way, with on-site visits scheduled when a job needs hands.",
      "When it does need hands, we drive to Burkesville. In-home services run at the posted flat rate plus a flat $25 travel fee — the total, travel included, is on the screen before you pay anything. Book online in about two minutes, or call the shop and talk to a person.",
    ],
    travelNote: "Burkesville addresses add a flat $25 travel fee, shown before you pay. Remote sessions have no travel fee, ever.",
  },
  {
    slug: "greensburg",
    town: "Greensburg",
    county: "Green",
    metaTitle: "Computer & IT Services in Greensburg, KY",
    metaDescription:
      "IT support for Greensburg and Green County, KY — government offices, farms, and small businesses, plus flat-rate in-home computer help booked online.",
    heroTitle: "Greensburg and Green County, on our route.",
    paragraphs: [
      "Greensburg is the Green County seat, set along the Green River with one of the oldest courthouse buildings in Kentucky anchoring its downtown. A town that's kept its records intact for over two centuries understands something a lot of bigger places forget: continuity matters. The office that maintains deeds and county business can't afford systems that quietly fail — or a vendor who's impossible to reach when they do.",
      "We support Green County offices — courthouse and county departments, clinics, farm businesses, and the small shops and professional offices around the square — with managed IT, Microsoft 365, practical cybersecurity, network and Wi-Fi work, VoIP phones, and camera systems. Everything comes with a written quote, a local entity you can verify (Lake Cumberland Computers is a service of Stargel Technologies LLC), and a W-9 on request.",
      "If your office runs on Microsoft 365 — or you're not entirely sure what your email is running on — start with our free security posture report. Enter your domain and in about fifteen seconds you get letter grades on the public records that determine whether your organization's email can be impersonated, explained in plain English for a clerk or office manager, not a technician. It's passive, free, and requires no access to your systems.",
      "For homes in Greensburg and around Green County, our flat-rate menu — $99 in-home tech help, $149 virus removal, $129 new-computer setup or Wi-Fi fix — applies at the posted price plus a flat $25 travel fee, always displayed before you pay. Prefer nobody makes the drive? The $49 remote session has no travel fee: a technician calls at your appointment time and fixes it over a secure screen share.",
    ],
    travelNote: "Greensburg addresses add a flat $25 travel fee, shown before you pay. Remote sessions have no travel fee, ever.",
  },
  {
    slug: "whitley-city",
    town: "Whitley City",
    county: "McCreary",
    metaTitle: "Computer & IT Services in Whitley City, KY",
    metaDescription:
      "IT support for Whitley City and McCreary County, KY — government offices and businesses along US-27, plus flat-rate in-home computer help and remote support.",
    heroTitle: "Whitley City and McCreary County — covered, not forgotten.",
    paragraphs: [
      "Whitley City is the seat of McCreary County, down US-27 south of Somerset, surrounded by the Daniel Boone National Forest and the Big South Fork country. McCreary is famously the only county in Kentucky without an incorporated city — which tells you something true about the area: it's rural, it's independent, and it's used to being skipped over by service companies working out of bigger towns. We don't skip it.",
      "The offices that keep McCreary County running — county government, the clerk's records, school-system vendors, clinics, and the outfitters and businesses that work the trail and river seasons — depend on the same systems as offices anywhere: email, backups, networks, phones. We support them with managed IT, Microsoft 365, practical cybersecurity, networking and Wi-Fi, VoIP phone systems, and cameras, with procurement-friendly paperwork and a verifiable local entity behind every quote.",
      "Because Whitley City is at the far edge of our map, remote support does a lot of the day-to-day work. A $49 remote session connects a technician to your computer over a secure screen share at a confirmed appointment time — no travel fee, ever — and handles most everyday problems the same day: email trouble, slow machines, software questions, printer fights. Business clients get the same treatment: most support handled remotely, on-site visits scheduled when hardware needs hands.",
      "And when hands are needed, we make the drive down 27. In-home services in Whitley City and around McCreary County run at the posted flat rate plus a flat $25 travel fee, shown in full before you pay. Book online, pick a real time slot, and a technician arrives when the confirmation says they will — or call the shop and a local person will sort it out with you.",
    ],
    travelNote: "Whitley City addresses add a flat $25 travel fee, shown before you pay. Remote sessions have no travel fee, ever.",
  },
];

export function getAreaPage(slug: string): AreaPage | undefined {
  return areaPages.find((a) => a.slug === slug);
}

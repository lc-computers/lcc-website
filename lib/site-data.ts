export const SITE_URL = "https://lakecumberlandcomputers.com";

export const BUSINESS = {
  name: "Lake Cumberland Computers",
  legalName: "Lake Cumberland Computers",
  street: "478 Lakeway Dr",
  city: "Russell Springs",
  state: "KY",
  zip: "42642",
  phone: "(270) 566-3888",
  phoneHref: "tel:+12705663888",
  email: "louis@lakecumberlandcomputers.com",
  hours: "Mon–Fri 8am–6pm",
  // Russell Springs, KY
  geo: { latitude: 37.0562, longitude: -85.0886 },
} as const;

export const FULL_ADDRESS = `${BUSINESS.street}, ${BUSINESS.city}, ${BUSINESS.state} ${BUSINESS.zip}`;

/**
 * Google Business Profile / review link. Set to the real profile URL
 * (e.g. https://g.page/r/.../review) to enable "Review us on Google"
 * buttons and the sameAs schema entry. Leave null to hide them.
 */
export const GOOGLE_BUSINESS_PROFILE_URL: string | null = null;

export interface Testimonial {
  quote: string;
  /** Customer name or descriptor, e.g. "Sarah M." */
  name: string;
  /** e.g. "Retail store owner, Somerset" */
  detail: string;
}

/**
 * Real customer quotes only — never invent these. The testimonials
 * section renders on the home page only when this array is non-empty.
 * Shape example:
 * { quote: "They had our office back online the same morning.",
 *   name: "Jane D.", detail: "Office manager, Somerset" }
 */
export const TESTIMONIALS: Testimonial[] = [];

export interface Service {
  slug: string;
  /** Short name used in nav, cards, and footer links */
  name: string;
  /** <h1> and schema name */
  title: string;
  metaDescription: string;
  /** One-liner for cards on the home and index pages */
  blurb: string;
  intro: string;
  bullets: { heading: string; text: string }[];
  closing: string;
}

export const SERVICES: Service[] = [
  {
    slug: "managed-it",
    name: "Managed IT",
    title: "Managed IT Services",
    metaDescription:
      "Managed IT services (MSP) for businesses in Russell Springs, Somerset, and the Lake Cumberland region of Kentucky. Flat-rate monitoring, maintenance, and support from a local team.",
    blurb:
      "Flat-rate monitoring, maintenance, and helpdesk support so your business technology just works.",
    intro:
      "Most small businesses around Lake Cumberland can't justify a full-time IT department — but they still depend on their computers, network, and data every single day. Our managed IT service gives you a whole IT team for a predictable monthly rate. We monitor your systems around the clock, keep everything patched and backed up, and fix problems before they turn into downtime.",
    bullets: [
      {
        heading: "Proactive monitoring & maintenance",
        text: "We watch your servers, workstations, and network 24/7 and handle updates, patches, and antivirus so small issues never become big ones.",
      },
      {
        heading: "Helpdesk support",
        text: "When something breaks or someone gets stuck, your staff calls us directly. Remote support for quick fixes, on-site visits when hands-on work is needed.",
      },
      {
        heading: "Backup & disaster recovery",
        text: "Automated, verified backups of your critical data with a tested plan to get you back up and running fast after hardware failure, ransomware, or user error.",
      },
      {
        heading: "Vendor management",
        text: "One number to call. We deal with your internet provider, software vendors, and equipment warranties so you don't have to.",
      },
    ],
    closing:
      "We're local — when remote support isn't enough, we're on-site the same day across the Lake Cumberland region, not dialing in from three states away.",
  },
  {
    slug: "networking",
    name: "Networking",
    title: "Business Networking",
    metaDescription:
      "Business network design, cabling, and support in the Lake Cumberland region of Kentucky. Routers, switches, firewalls, and structured cabling installed and maintained by local techs.",
    blurb:
      "Network design, structured cabling, and equipment that keeps your office connected and fast.",
    intro:
      "A slow or unreliable network drags down everything your business does. We design, install, and support wired and wireless networks for offices, retail, medical practices, and industrial sites across south-central Kentucky — from a single office to multi-building campuses.",
    bullets: [
      {
        heading: "Network design & installation",
        text: "Routers, managed switches, and firewalls sized for your business, configured properly, and documented so you're never guessing what's plugged in where.",
      },
      {
        heading: "Structured cabling",
        text: "Clean, labeled, tested Cat6 cabling runs — new construction, remodels, or cleaning up the wiring closet nobody wants to open.",
      },
      {
        heading: "Firewalls & VPN",
        text: "Business-grade firewalls with secure remote access, so your team can work from anywhere without leaving the door open.",
      },
      {
        heading: "Troubleshooting & upgrades",
        text: "Dead spots, random drops, mystery slowdowns — we find the actual cause and fix it instead of telling you to reboot the router.",
      },
    ],
    closing:
      "Whether you're wiring a new building or untangling an old one, we build networks you don't have to think about.",
  },
  {
    slug: "cybersecurity",
    name: "Cybersecurity",
    title: "Cybersecurity",
    metaDescription:
      "Cybersecurity services for small businesses in Somerset, Russell Springs, and the Lake Cumberland area: ransomware protection, email security, backups, and security assessments.",
    blurb:
      "Ransomware protection, email security, and practical defenses sized for small business.",
    intro:
      "Small businesses are now the most common target for ransomware and email scams — attackers know you have money and data but probably not a security team. We bring practical, affordable protection: the security measures that actually stop attacks, without enterprise pricing or fear-mongering.",
    bullets: [
      {
        heading: "Endpoint & ransomware protection",
        text: "Modern endpoint protection on every computer that detects and stops ransomware behavior, not just known viruses.",
      },
      {
        heading: "Email security & phishing defense",
        text: "Filtering that catches phishing and fraud attempts before they reach your inbox, plus staff training so the ones that slip through don't get clicked.",
      },
      {
        heading: "Backups that survive an attack",
        text: "Offsite, versioned backups attackers can't encrypt — the difference between a bad day and a closed business.",
      },
      {
        heading: "Security assessments",
        text: "A plain-English review of where you're exposed — passwords, remote access, old equipment, user accounts — with a prioritized fix list.",
      },
    ],
    closing:
      "You don't need a Fortune 500 security budget. You need the right basics done well — that's what we do.",
  },
  {
    slug: "wifi",
    name: "Business WiFi",
    title: "Business WiFi",
    metaDescription:
      "Commercial WiFi design and installation in the Lake Cumberland region: full-coverage wireless for offices, restaurants, marinas, warehouses, and guest networks that just work.",
    blurb:
      "Full-coverage wireless for offices, shops, warehouses, and guest networks — no dead spots.",
    intro:
      "Consumer routers weren't built to cover a restaurant, warehouse, medical office, or marina. We design and install business-grade WiFi with the coverage, capacity, and reliability your space actually needs — including separate, secure guest networks for your customers.",
    bullets: [
      {
        heading: "Site surveys & coverage design",
        text: "We measure your building and design access point placement for full coverage — no more dead spots in the back office or the far end of the shop floor.",
      },
      {
        heading: "Business-grade access points",
        text: "Centrally managed equipment that handles dozens or hundreds of devices without choking, installed cleanly and configured securely.",
      },
      {
        heading: "Guest WiFi",
        text: "Give customers WiFi that's completely separated from your business systems, with bandwidth limits so guests never slow down your operations.",
      },
      {
        heading: "Outdoor & long-range wireless",
        text: "Coverage for patios, lots, docks, and outbuildings — including point-to-point links between buildings without trenching cable.",
      },
    ],
    closing:
      "If your WiFi only works when you're standing next to the router, it's time to do it right.",
  },
  {
    slug: "security-cameras",
    name: "Security Cameras",
    title: "Security Camera Systems",
    metaDescription:
      "Security camera installation for businesses and homes around Lake Cumberland, KY. HD IP cameras, remote viewing from your phone, and local video storage — professionally installed.",
    blurb:
      "HD camera systems with phone viewing and reliable recording, professionally installed.",
    intro:
      "Whether it's protecting a storefront, a job site, equipment storage, or your home, a properly installed camera system is one of the best investments you can make. We install modern HD IP camera systems with crisp footage day and night, recording you can rely on, and live viewing from your phone wherever you are.",
    bullets: [
      {
        heading: "Professional installation",
        text: "Cameras placed where they actually cover what matters, cabled cleanly, and aimed and focused correctly — not a DIY kit stuck wherever the cord reaches.",
      },
      {
        heading: "View from anywhere",
        text: "Check live feeds and playback from your phone or computer, with alerts for motion in the areas you care about.",
      },
      {
        heading: "Reliable recording",
        text: "Local network video recorders with weeks of storage — your footage doesn't depend on a cloud subscription or an internet outage.",
      },
      {
        heading: "Night vision & outdoor rated",
        text: "Clear footage in low light and equipment built to handle Kentucky weather year-round.",
      },
    ],
    closing:
      "We'll walk your property, recommend the right coverage, and give you a straight quote — no pushy sales package.",
  },
  {
    slug: "phone-systems",
    name: "Phone Systems",
    title: "VOIP & Business Phone Systems",
    metaDescription:
      "VOIP and business phone systems for companies in the Lake Cumberland region. Modern phone service with auto-attendants, mobile apps, and lower monthly bills than traditional lines.",
    blurb:
      "Modern VOIP phone systems with auto-attendants and mobile apps — usually for less than your current phone bill.",
    intro:
      "If you're still paying for traditional phone lines, you're probably paying too much for too little. Modern VOIP phone systems give your business professional features — auto-attendants, voicemail-to-email, call routing, mobile apps — usually for less than your current bill. We handle everything: the phones, the setup, the number transfer, and the ongoing support.",
    bullets: [
      {
        heading: "Full-featured business phones",
        text: "Auto-attendant menus, ring groups, hold music, voicemail-to-email, and call forwarding — the features callers expect from a professional business.",
      },
      {
        heading: "Take your office line anywhere",
        text: "Answer your business number from a mobile app or laptop. Work from home, the truck, or the lake without missing calls or giving out your cell number.",
      },
      {
        heading: "Keep your number",
        text: "We transfer your existing business number so nothing changes for your customers.",
      },
      {
        heading: "Installed and supported locally",
        text: "We set up the phones at your office, train your staff, and answer the phone ourselves when you need changes — no 1-800 runaround.",
      },
    ],
    closing:
      "Most businesses cut their phone bill and get better features. We'll give you a real comparison against what you're paying now.",
  },
  {
    slug: "computer-repair",
    name: "Computer Repair",
    title: "Computer Troubleshooting & Repair",
    metaDescription:
      "Computer repair and troubleshooting in Russell Springs, KY and the Lake Cumberland area. Slow PCs, virus removal, data recovery, hardware repair, and upgrades for homes and businesses.",
    blurb:
      "Slow computers, viruses, data recovery, upgrades — honest diagnostics and straight answers.",
    intro:
      "Slow computer? Won't boot? Weird pop-ups? Bring it to us or have us come to you. We diagnose and repair desktops and laptops for homes and businesses across the Lake Cumberland area — with honest advice about when a machine is worth fixing and when your money is better spent replacing it.",
    bullets: [
      {
        heading: "Diagnostics & repair",
        text: "Failed hard drives, bad memory, broken screens, power issues, and the mystery problems nobody else could figure out.",
      },
      {
        heading: "Virus & malware removal",
        text: "Full cleanup of infections, scareware, and browser hijackers — plus protection so it doesn't happen again.",
      },
      {
        heading: "Data recovery & transfers",
        text: "Recovering photos and documents from failing drives, and moving everything safely to a new machine when it's time.",
      },
      {
        heading: "Upgrades that feel like new",
        text: "An SSD and memory upgrade often makes a five-year-old computer faster than it's ever been — for a fraction of replacement cost.",
      },
    ],
    closing:
      "Straight answers, fair pricing, and no geek-speak. If it's not worth fixing, we'll tell you.",
  },
];

export interface City {
  slug: string;
  name: string;
  county: string;
  metaDescription: string;
  /** Unique local copy — two paragraphs */
  intro: string;
  detail: string;
}

export const CITIES: City[] = [
  {
    slug: "somerset",
    name: "Somerset",
    county: "Pulaski County",
    metaDescription:
      "IT support, managed services, networking, and computer repair for businesses in Somerset, KY. Local techs serving Pulaski County from nearby Russell Springs.",
    intro:
      "Somerset is the commercial hub of the Lake Cumberland region, and its businesses — medical offices, manufacturers, retailers, and professional firms along the Highway 27 corridor — depend on technology that works. Lake Cumberland Computers provides managed IT, networking, cybersecurity, and phone systems to Somerset businesses with genuinely local, same-day on-site support.",
    detail:
      "From single-office practices near Lake Cumberland Regional Hospital to multi-site operations across Pulaski County, we support Somerset businesses with the responsiveness a national help desk can't match. We're about 30 minutes away in Russell Springs — close enough to be there when it matters.",
  },
  {
    slug: "russell-springs",
    name: "Russell Springs",
    county: "Russell County",
    metaDescription:
      "Computer repair, managed IT, WiFi, security cameras, and business phone systems in Russell Springs, KY — Lake Cumberland Computers' home base on Lakeway Dr.",
    intro:
      "Russell Springs is home base. Our shop is right here on Lakeway Dr, serving the businesses and families of Russell County with everything from same-day computer repair to full managed IT for local companies. When you call, you're talking to someone down the road — not a call center.",
    detail:
      "We support Russell Springs retailers, offices, farms, and home users alike: business networks and phone systems on the commercial side, and honest computer repair, virus removal, and WiFi help for households. Stop by, call, or have us come to you.",
  },
  {
    slug: "jamestown",
    name: "Jamestown",
    county: "Russell County",
    metaDescription:
      "IT services and computer support in Jamestown, KY — networking, WiFi, security cameras, and computer repair for businesses, marinas, and homes near Lake Cumberland.",
    intro:
      "Just down the road from our Russell Springs shop, Jamestown sits at the heart of Lake Cumberland — county seat of Russell County and gateway to the lake through the state dock and marinas. We support Jamestown's businesses, lake-area operations, and residents with fast local IT service.",
    detail:
      "Marinas, rentals, restaurants, and seasonal businesses around the lake have real networking challenges — outdoor WiFi coverage, security cameras across docks and lots, and connectivity that holds up during peak season. We design for exactly that, and we're minutes away year-round.",
  },
  {
    slug: "liberty",
    name: "Liberty",
    county: "Casey County",
    metaDescription:
      "Computer repair and business IT services in Liberty, KY. Networking, cybersecurity, phone systems, and managed IT for Casey County businesses and homes.",
    intro:
      "Liberty and the surrounding Casey County communities shouldn't have to drive to Lexington or settle for remote-only support to get real IT help. Lake Cumberland Computers brings business networking, managed IT, security cameras, and computer repair to Liberty with on-site service.",
    detail:
      "We work with Liberty's small businesses, ag operations, and manufacturers on practical technology: dependable networks, protected data, phone systems that cut costs, and honest repair work when equipment fails. Local enough to show up, experienced enough to fix it right.",
  },
  {
    slug: "columbia",
    name: "Columbia",
    county: "Adair County",
    metaDescription:
      "IT support in Columbia, KY — managed IT, networking, WiFi, and computer repair for Adair County businesses, offices, and homes from a nearby local provider.",
    intro:
      "Columbia is a short drive from our Russell Springs shop, and we serve its businesses, professional offices, and residents with the full range of our services — managed IT, business networking, WiFi, security cameras, phone systems, and computer repair.",
    detail:
      "From offices around the historic downtown square to businesses along the Cumberland Parkway and the Lindsey Wilson College community, Columbia has a growing need for dependable technology support. We deliver it with quick on-site response and straight answers.",
  },
  {
    slug: "albany",
    name: "Albany",
    county: "Clinton County",
    metaDescription:
      "Computer and IT services in Albany, KY — business networking, security cameras, WiFi, and computer repair for Clinton County businesses and homes near Dale Hollow Lake.",
    intro:
      "Serving Albany and Clinton County, Lake Cumberland Computers brings professional IT services to an area that big providers overlook. Businesses between Lake Cumberland and Dale Hollow Lake get the same managed IT, networking, and security services as companies in bigger markets — with local, on-site support.",
    detail:
      "We help Albany businesses with dependable networks and phone systems, install camera systems for shops, farms, and lake properties, and handle computer repair for the whole community. Distance isn't a problem — scheduled on-site visits and remote support keep Clinton County covered.",
  },
  {
    slug: "greensburg",
    name: "Greensburg",
    county: "Green County",
    metaDescription:
      "IT services and computer repair in Greensburg, KY. Business networking, managed IT, cybersecurity, and phone systems for Green County businesses.",
    intro:
      "Greensburg's businesses along the Green River — from downtown shops to agricultural operations across Green County — get full IT coverage from Lake Cumberland Computers: managed services, networking, cybersecurity, cameras, and phone systems.",
    detail:
      "We're the practical alternative to no support at all or an expensive contract with a faraway firm: a local team that designs, installs, and maintains your technology and shows up in Greensburg when hands-on work is needed.",
  },
  {
    slug: "burkesville",
    name: "Burkesville",
    county: "Cumberland County",
    metaDescription:
      "Computer repair and business IT support in Burkesville, KY — networking, WiFi, security cameras, and managed IT for Cumberland County businesses and homes.",
    intro:
      "Burkesville and Cumberland County sit right in our service area, and we treat them that way — real on-site IT service for businesses and residents along the Cumberland River, from downtown Burkesville to the Dale Hollow lake country.",
    detail:
      "Small-town businesses still face big-business technology problems: ransomware, failing hardware, dead-spot WiFi, and phone bills that keep climbing. We solve them with practical, correctly sized solutions and support from people you can actually reach.",
  },
  {
    slug: "monticello",
    name: "Monticello",
    county: "Wayne County",
    metaDescription:
      "IT support and computer services in Monticello, KY — networking, WiFi, security cameras, phone systems, and computer repair for Wayne County businesses and lake operations.",
    intro:
      "Monticello — the Houseboat Capital of the World — anchors the south side of Lake Cumberland, and its businesses, marinas, and manufacturers count on technology that holds up. Lake Cumberland Computers serves Wayne County with networking, managed IT, cameras, phones, and repair.",
    detail:
      "Lakefront operations need outdoor WiFi and camera coverage; shops and offices in town need dependable networks and protected data. We handle both, with on-site service across Wayne County and remote support in between visits.",
  },
];

export function getService(slug: string): Service | undefined {
  return SERVICES.find((s) => s.slug === slug);
}

export function getCity(slug: string): City | undefined {
  return CITIES.find((c) => c.slug === slug);
}

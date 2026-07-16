import type { ReactNode } from "react";

/* Article building blocks — keep post bodies readable and consistently styled. */
function P({ children }: { children: ReactNode }) {
  return <p className="mt-5 text-slate-600 dark:text-slate-300">{children}</p>;
}

function H2({ children }: { children: ReactNode }) {
  return (
    <h2 className="mt-10 text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
      {children}
    </h2>
  );
}

function UL({ children }: { children: ReactNode }) {
  return (
    <ul className="mt-5 list-disc space-y-2 pl-6 text-slate-600 dark:text-slate-300">
      {children}
    </ul>
  );
}

export interface Post {
  slug: string;
  title: string;
  description: string;
  /** ISO date, used for display, schema, and sitemap */
  date: string;
  /** Slug of the most related service, for the in-article CTA */
  serviceSlug: string;
  body: ReactNode;
}

export const POSTS: Post[] = [
  {
    slug: "signs-your-business-needs-managed-it",
    title: "5 Signs Your Business Has Outgrown “The Person Who’s Good With Computers”",
    description:
      "How small businesses around Lake Cumberland know it's time to move from ad-hoc computer help to managed IT — and what that actually costs.",
    date: "2026-03-10",
    serviceSlug: "managed-it",
    body: (
      <>
        <P>
          Almost every small business around Lake Cumberland starts the same way: somebody on
          staff is “good with computers,” and they handle things when the printer stops working
          or the internet goes down. That works — until it doesn’t. Here are the five signs
          we see most often that a business has outgrown ad-hoc IT.
        </P>
        <H2>1. Downtime is costing you real money</H2>
        <P>
          When the point-of-sale system freezes on a Saturday or the office server dies during
          billing week, “we’ll figure it out Monday” isn’t good enough. If an hour of downtime
          costs you more than an hour of payroll, you need someone whose actual job is
          preventing that hour.
        </P>
        <H2>2. Nobody knows if the backups work</H2>
        <P>
          Most businesses we meet either have no backups, or have backups nobody has ever tried
          to restore. A backup you haven’t tested is a hope, not a plan. Managed IT means
          someone verifies — routinely — that your data can actually be recovered.
        </P>
        <H2>3. Updates and security are “whenever we get to it”</H2>
        <P>
          Unpatched computers are how ransomware gets in, and small businesses are now the most
          common target. If updates happen only when someone remembers, your exposure grows
          every week.
        </P>
        <H2>4. Every problem is an emergency</H2>
        <P>
          Without monitoring, you find out about failing hard drives, full servers, and expiring
          licenses when they take you down. With monitoring, most of those become a scheduled
          fix on a Tuesday afternoon instead of a crisis.
        </P>
        <H2>5. Your “computer person” has another full-time job</H2>
        <P>
          The office manager who also handles IT is doing two jobs, and both suffer. Handing
          technology to a dedicated team usually costs less than people expect — a flat monthly
          rate, sized to your business — and gives your staff their time back.
        </P>
        <H2>What managed IT looks like with us</H2>
        <P>
          We monitor your systems around the clock, keep everything patched and backed up,
          answer your staff’s calls directly, and come on-site when hands-on work is needed —
          anywhere in the Lake Cumberland region. One predictable bill, one number to call.
        </P>
      </>
    ),
  },
  {
    slug: "how-to-spot-phishing-emails",
    title: "How to Spot a Phishing Email Before It Costs You",
    description:
      "Practical tips for Kentucky small businesses on recognizing phishing emails — the number one way attackers get into small business systems.",
    date: "2026-04-07",
    serviceSlug: "cybersecurity",
    body: (
      <>
        <P>
          Nearly every business break-in we help clean up starts the same way: someone clicked
          a link in an email that looked legitimate. Phishing is the number one way attackers
          get into small business systems, and no filter catches everything. Here’s what to
          train yourself — and your staff — to notice.
        </P>
        <H2>The pressure play</H2>
        <P>
          Phishing emails almost always manufacture urgency: an invoice that’s overdue, an
          account that will be closed, a package that couldn’t be delivered, a boss who needs
          gift cards “right now.” Urgency is the tell. Real organizations rarely need you to
          act in the next ten minutes.
        </P>
        <H2>Check the actual address, not the display name</H2>
        <P>
          An email can say it’s from “Microsoft Support” while the actual address is a jumble
          of letters at a domain you’ve never heard of. On a phone this is hidden by default —
          tap the sender’s name to see the real address before you trust anything.
        </P>
        <H2>Hover before you click</H2>
        <P>
          On a computer, hover over any link and look at the URL that pops up. If the email
          claims to be your bank but the link goes somewhere else, that’s your answer. When in
          doubt, don’t click the link at all — go to the site directly or call the company
          using a number you already have.
        </P>
        <H2>The ones that target businesses specifically</H2>
        <UL>
          <li>
            <strong>Fake invoices</strong> — a “past due” bill from a vendor you may or may not
            use, hoping accounts payable just pays it.
          </li>
          <li>
            <strong>Boss impersonation</strong> — a short email that looks like it’s from the
            owner: “Are you at your desk? I need you to handle something quietly.”
          </li>
          <li>
            <strong>Payroll redirects</strong> — “I changed banks, please update my direct
            deposit” sent to HR from a spoofed employee address.
          </li>
        </UL>
        <P>
          For anything involving money or account changes, verify by phone or in person. Every
          time. A thirty-second call has saved our clients tens of thousands of dollars.
        </P>
        <H2>Layer your defenses</H2>
        <P>
          Training helps, but pair it with technical protection: email filtering that catches
          most phishing before it arrives, multi-factor authentication so a stolen password
          isn’t enough, and backups that survive if something does get through. That’s the
          core of what we set up for businesses across the Lake Cumberland region.
        </P>
      </>
    ),
  },
  {
    slug: "why-business-wifi-is-slow",
    title: "Why Your Business WiFi Is Slow (and How to Actually Fix It)",
    description:
      "The real reasons WiFi drags in offices, shops, and lake businesses around south-central Kentucky — and what fixing it properly looks like.",
    date: "2026-05-12",
    serviceSlug: "wifi",
    body: (
      <>
        <P>
          “The WiFi is slow” might be the most common complaint in any workplace. Sometimes the
          internet connection really is the problem — but around here, more often it’s the
          wireless setup itself. Here’s what we actually find when businesses call us.
        </P>
        <H2>One consumer router trying to cover everything</H2>
        <P>
          The router your internet provider handed you was designed for a house, not a
          restaurant, office, or shop floor. One access point in the back office can’t push a
          reliable signal through cinder block walls, metal shelving, and coolers. The fix
          isn’t a more expensive router — it’s multiple access points, placed where the people
          are.
        </P>
        <H2>Too many devices on hardware that can’t handle it</H2>
        <P>
          Count what’s actually on your network: every phone, register, printer, camera, tablet,
          and customer device. Consumer gear chokes quietly as that number climbs — everything
          still connects, but everything crawls. Business access points are built for exactly
          this load.
        </P>
        <H2>Everything on one network</H2>
        <P>
          If customer phones share a network with your registers and office computers, you have
          both a performance problem and a security problem. Guest traffic should live on its
          own network, with limits so a visitor streaming video can’t slow down your
          point-of-sale.
        </P>
        <H2>Dead spots nobody measured</H2>
        <P>
          WiFi coverage isn’t guesswork — it can be measured. A proper site survey maps signal
          strength through your actual building and tells you where access points belong. It’s
          the difference between “we added another repeater and it’s still bad” and coverage
          that just works, including patios, docks, and outbuildings.
        </P>
        <H2>When it really is your internet plan</H2>
        <P>
          Sometimes the wireless is fine and the connection behind it is undersized — common in
          the more rural parts of our region. We test that first, tell you honestly which
          problem you have, and fix the right one. No point paying for new equipment if the
          bottleneck is the line coming into the building.
        </P>
      </>
    ),
  },
  {
    slug: "is-your-computer-worth-fixing",
    title: "Is Your Old Computer Worth Fixing? An Honest Guide",
    description:
      "When repair makes sense, when an upgrade beats replacement, and when to let a computer go — honest advice from a Russell Springs repair shop.",
    date: "2026-06-09",
    serviceSlug: "computer-repair",
    body: (
      <>
        <P>
          People walk into our Russell Springs shop every week asking the same question: “Is
          this thing worth fixing?” Sometimes the honest answer is no — and we’ll tell you.
          Here’s the same framework we use at the counter.
        </P>
        <H2>The upgrade that beats buying new</H2>
        <P>
          If your computer is slow but otherwise healthy, an SSD upgrade is the best money you
          can spend on it. Swapping an old spinning hard drive for a solid-state drive — often
          paired with a memory bump — routinely makes a five-year-old machine boot in seconds
          and feel faster than it did new, for a fraction of replacement cost.
        </P>
        <H2>Repairs that usually make sense</H2>
        <UL>
          <li>Failing hard drive in an otherwise good machine — replace it, keep your data.</li>
          <li>Virus and malware infections — cleanup costs far less than a new computer.</li>
          <li>Broken laptop screens on newer machines — usually a straightforward fix.</li>
          <li>Power problems — often a failed supply or jack, not a dead computer.</li>
        </UL>
        <H2>When we’ll tell you to let it go</H2>
        <P>
          If the repair costs more than half of what a suitable replacement runs, the machine
          is a decade old, or the motherboard itself has failed, replacement is usually the
          smarter spend. We’ll say so plainly, and we can move your files, photos, and programs
          to the new machine so nothing is lost in the switch.
        </P>
        <H2>Don’t wait on a dying drive</H2>
        <P>
          One warning we give everyone: if your computer has started clicking, freezing, or
          throwing disk errors, act now. A failing drive that still boots is recoverable; one
          that has fully died may not be. If the files matter — family photos, business
          records — stop using the machine and bring it in.
        </P>
        <H2>Get a straight answer</H2>
        <P>
          Bring your machine by the shop or give us a call. We diagnose honestly, quote fairly,
          and if it isn’t worth fixing, you’ll hear it from us first.
        </P>
      </>
    ),
  },
  {
    slug: "voip-vs-traditional-phone-lines",
    title: "Still Paying for Traditional Phone Lines? What VOIP Actually Costs",
    description:
      "A plain-English comparison of traditional business phone lines versus VOIP for small businesses in the Lake Cumberland region.",
    date: "2026-07-01",
    serviceSlug: "phone-systems",
    body: (
      <>
        <P>
          Many businesses in our region are still paying for traditional copper phone lines —
          often several of them — plus per-feature charges that have crept up for years. When
          we run the numbers side by side with a modern VOIP system, the comparison usually
          isn’t close. Here’s the honest breakdown.
        </P>
        <H2>What you’re probably paying now</H2>
        <P>
          A typical small business with two or three traditional lines pays for each line
          separately, then extra for voicemail, caller ID, hunting, and long distance. The
          bill grows quietly, and the features are stuck in 1995: no menus, no mobile access,
          no voicemail in your email.
        </P>
        <H2>What VOIP changes</H2>
        <UL>
          <li>
            <strong>An auto-attendant</strong> — “press 1 for service, 2 for billing” — makes a
            three-person shop sound like a real operation and routes calls without a
            receptionist.
          </li>
          <li>
            <strong>Your office number goes with you</strong> — answer business calls from an
            app on your cell without giving out your personal number. For service businesses
            where the owner is in the truck half the day, this alone is worth the switch.
          </li>
          <li>
            <strong>Voicemail lands in your email</strong> as an audio file and transcript, so
            nothing gets missed.
          </li>
          <li>
            <strong>You keep your number.</strong> The number your customers know transfers to
            the new system — nothing changes on their end.
          </li>
        </UL>
        <H2>The honest caveats</H2>
        <P>
          VOIP runs over your internet connection, so the connection has to be up to the job —
          a real consideration in the more rural parts of south-central Kentucky. That’s why we
          test your internet quality first and tell you plainly whether VOIP will work well at
          your location before you commit to anything.
        </P>
        <H2>Get a real comparison</H2>
        <P>
          Bring us a copy of your current phone bill. We’ll price a system with the features
          you actually want and show you the numbers side by side. Most businesses pay less
          per month and get more — and if yours wouldn’t, we’ll tell you that too.
        </P>
      </>
    ),
  },
];

export function getPost(slug: string): Post | undefined {
  return POSTS.find((p) => p.slug === slug);
}

/** Newest first, for the index page. */
export function sortedPosts(): Post[] {
  return [...POSTS].sort((a, b) => b.date.localeCompare(a.date));
}

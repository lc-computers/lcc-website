/**
 * The four launch articles. These seed the posts table (scripts/seed.ts) and
 * serve as the no-database fallback so /blog always renders.
 * Content is markdown, written in site voice, with internal links.
 */

export interface LaunchArticle {
  slug: string;
  title: string;
  description: string;
  publishedAt: string; // ISO date
  contentMd: string;
}

export const launchArticles: LaunchArticle[] = [
  {
    slug: "ransomware-small-kentucky-governments",
    title: "Ransomware and Small Kentucky Governments: What a Clerk's Office Should Ask Its IT Vendor",
    description:
      "Small public offices are prime ransomware targets. Here are the seven questions every Kentucky clerk, treasurer, or judge-executive should ask their IT vendor — and the answers that should worry you.",
    publishedAt: "2026-06-08",
    contentMd: `County and city governments across the country have learned about ransomware the expensive way: systems locked, offices closed, services interrupted, and recovery bills that dwarf what prevention would have cost. It is not a big-city problem. Attackers run automated campaigns that knock on every door on the internet, and a small office with public records and no one minding the systems is exactly the door they hope opens.

If you run a clerk's office, a treasurer's office, a utility district, or a city hall anywhere in south-central Kentucky, you don't need to become a security expert. You need to ask your IT vendor — whoever that is, even if it's us — seven plain questions, and you need straight answers.

## 1. "If our files were encrypted tonight, how would we recover — and how do you know?"

The only acceptable answer involves backups that are **separated from the systems they protect** and that have been **restore-tested recently**. Ransomware crews look for backups first, because destroying them is what turns a bad day into a payout. If your vendor can't tell you the date of the last successful test restore, you don't have backups — you have hope.

## 2. "Which of our accounts don't have multi-factor authentication?"

Multi-factor authentication (MFA) — the code from your phone after the password — stops the most common attack there is: a stolen or guessed password. The answer you want is "none — every account has it." Every exception your vendor names is a door that only needs one leaked password to open. Email accounts matter most, because email is where password resets for everything else land.

## 3. "How would we know if something was already wrong?"

Attackers often sit quietly inside systems for weeks before locking anything. Somebody — a person or monitoring software, ideally both — should be watching for the warning signs: strange sign-ins, new accounts nobody created, security tools switched off. If nobody is watching, the first symptom you notice will be the ransom note.

## 4. "What happens when an employee leaves?"

Ask when the last departed employee's accounts were disabled. Same day? Good. "Let me check"? Not good. Old accounts with live passwords are a favorite way in, and small offices — where everyone knows everyone — are the most likely to leave them open.

## 5. "Can our email be spoofed?"

If your office's domain isn't protected by three public DNS records — SPF, DKIM, and DMARC — criminals can send email that looks like it came from you: fake invoices to vendors, fake instructions to staff, fake notices to citizens. Checking takes fifteen seconds and touches nothing in your systems. [Our free security posture report](/health-check) grades those exact records and explains each one in plain English — it's built for exactly this question.

## 6. "What would this cost us if it happened anyway?"

An honest vendor talks about incident response *before* the incident: who you'd call, what gets restored first, how long the office might run on paper, and what cyber-insurance requires. If the plan is "that won't happen to us," that isn't a plan.

## 7. "Will you put all of this in writing?"

Public offices answer to fiscal courts, councils, auditors, and citizens. A vendor serving government should hand you documentation without being asked twice: what's in place, what's not, what it costs to close the gaps. In writing is how accountability works — and it's how the next administration knows what it inherited.

## The uncomfortable part

Every question above has a version that's uncomfortable for the vendor, and that's the point. Good vendors welcome these questions, because they've already done the work. If asking them strains the relationship, that tells you something too.

The defenses that stop most ransomware aren't exotic or expensive: MFA everywhere, patched systems, protected endpoints, staff who can spot a phish, tested backups, and someone accountable for all of it. Unglamorous, proven, and a fraction of the cost of one bad week. That's the work we've done for offices around the lake [since 2001](/about) — and it's what our [cybersecurity](/services/cybersecurity) and [managed IT](/services/managed-it) services exist to do.

**Start with the free check.** Run your office's domain through our [security posture report](/health-check) — passive, public-record checks only, graded in plain English, emailed to you as a document you can hand to your board. If the grades come back rough, [a consultation costs nothing](/government).`,
  },
  {
    slug: "m365-security-basics-small-businesses-get-wrong",
    title: "The Microsoft 365 Security Basics Every Small Business Gets Wrong",
    description:
      "Most small-office Microsoft 365 setups share the same five gaps — and none of them take a big budget to close. Here's what to check this week.",
    publishedAt: "2026-06-22",
    contentMd: `Microsoft 365 runs most of the offices in south-central Kentucky now — email, calendars, files, Teams. And nearly every 365 setup we're asked to look at, from Somerset law offices to Columbia clinics, shares the same handful of gaps. Not because anyone was careless, but because 365 works well enough out of the box that nobody goes back to finish the job.

Here are the five we find most often, in the order we'd fix them.

## 1. MFA that's "available" but not required

Microsoft makes multi-factor authentication available on every account, but *available* isn't *enforced*. In many small offices, the owner has MFA and half the staff quietly don't — often whoever set up their phone last found it annoying and skipped it.

One account without MFA is one phished password away from an attacker reading that mailbox — and email is where everything else resets its passwords. Make it mandatory for everyone, including (especially) the accounts that forward to the boss's phone.

## 2. The departed employee who still has a mailbox

Someone left eight months ago. Their account still works because "we might need their email." Their password hasn't changed, they know it, and so does anyone who ever stole it.

There's a right way to keep a former employee's mail — convert it to a shared mailbox, block sign-in — and it doesn't leave a live login lying around. If you can name a former employee whose account might still work, that's this week's task.

## 3. Nobody actually backs up 365

Microsoft keeps the service running. It does not promise to recover the folder someone emptied in March, the mailbox of an employee you removed, or files encrypted by malware that synced through OneDrive. Retention settings help, but they're not a backup — and most offices have never tested what they could actually get back.

A proper 365 backup is inexpensive and quiet. It's on our standard checklist in every [Microsoft 365 engagement](/services/microsoft-365) for a reason: the day you need it, nothing else will do.

## 4. Email records that let anyone impersonate you

Three public DNS records — SPF, DKIM, and DMARC — decide whether the world's mail systems can tell real email from your domain apart from forgeries. Most small businesses have SPF (their provider set it up), half-configured DKIM, and no DMARC at all. That combination means forged mail "from" your business gets delivered, and you'll never know.

We wrote a [plain-English guide to SPF, DKIM, and DMARC](/blog/spf-dkim-dmarc-plain-english) if you want the full picture — or [run the free health check](/health-check), which grades your domain's records in about fifteen seconds.

## 5. Everyone's an admin

Small offices trend toward "just make everyone an admin so nothing's ever blocked." Every admin account is a master key; a phished admin doesn't lose one mailbox, they lose the building. Most people need none of those permissions for daily work. Two admin accounts — used only when actually administering, protected with the strongest MFA you have — covers nearly every small office.

## The pattern

None of these five require new hardware, new licenses, or a security budget. They're configuration — an afternoon or two of deliberate work by someone who knows where the switches are. That's the frustrating part and the good news at once: the gap between a typical setup and a solid one is mostly *attention*.

**Want to know where yours stands?** Start with the [free M365 Security Health Check](/health-check) — it reads your domain's public records, grades them, and emails you a report a non-technical office manager can act on. If you'd rather have the whole setup reviewed properly, [book a free consultation](/contact) — we've been doing this for local offices [since 2001](/about).`,
  },
  {
    slug: "spf-dkim-dmarc-plain-english",
    title: "Can Your Business Email Be Spoofed? SPF, DKIM, and DMARC in Plain English",
    description:
      "Three DNS records decide whether criminals can send email that looks exactly like it came from your business. Here's what they do — explained with envelopes, signatures, and instructions, not jargon.",
    publishedAt: "2026-07-01",
    contentMd: `Somewhere right now, someone is sending an email that appears to come from a business they've never touched. Not a hacked account — just a forged "From" line, the email equivalent of writing someone else's return address on an envelope. It's how fake invoices reach bookkeepers, and how "the boss" asks payroll to change a direct deposit.

Whether that forged email gets delivered — or lands in junk, or bounces — depends on three public records attached to the business's domain name: **SPF**, **DKIM**, and **DMARC**. Every mail system on earth checks them. Here's what each one does, minus the jargon.

## SPF: the list of approved senders

SPF (Sender Policy Framework) is a public list that says: *"Mail from our domain legitimately comes from these servers."* If your email runs on Microsoft 365, your SPF record says so.

When a receiving mail system gets a message claiming to be from your domain, it checks the actual sending server against the list. On it? Point in favor. Not on it? A strike against.

**Where it falls short alone:** SPF only checks the *envelope*, not the "From" line a human reads — and forwarding can break it. Necessary, not sufficient.

## DKIM: the tamper-proof signature

DKIM (DomainKeys Identified Mail) has your mail server put an invisible cryptographic signature on every outgoing message. Receiving systems check the signature against a public key in your DNS. A valid signature proves two things: the mail genuinely came through your systems, and nobody altered it on the way.

A forger can't produce that signature — the key never leaves your provider. For Microsoft 365, DKIM shows up as two small DNS entries (selector1 and selector2). Many offices are one wizard step away from having it and never clicked the button.

## DMARC: the instructions and the alarm

Here's what most people miss: SPF and DKIM alone are just *evidence*. **DMARC** is the record that tells receiving systems what to *do* when the evidence says a message is a fake — deliver it anyway, quarantine it to junk, or reject it cold.

No DMARC record means no instructions, and most mail systems shrug and deliver the fake. That's why an office can "have SPF and DKIM" and still be spoofable in practice.

DMARC also has a reporting feature: mail systems around the world will *tell you* when they see forged mail claiming to be you — an alarm bell most businesses never wire up.

DMARC policies come in three strengths: \`none\` (just watch and report), \`quarantine\` (junk the fakes), and \`reject\` (refuse them outright). New setups start at \`none\` to make sure real mail passes, then tighten. Parked at \`none\` forever, though, the alarm rings and nobody's listening.

## The part nobody tells small businesses

These records aren't a premium feature. They're free, they're public, and they protect *you specifically* — your name, your invoices, your relationships. A missing DMARC record doesn't hurt Microsoft; it hurts the plumbing company whose customers get fake invoices with someone else's bank details on them.

And because the records are public, checking them requires no access to your systems, no software, and no risk. Any mail administrator on the planet can look at your domain and know in seconds whether you're protected. So can criminals — that's rather the point.

## Check yours in fifteen seconds

Our [free M365 Security Health Check](/health-check) reads your domain's MX, SPF, DKIM, and DMARC records, grades each one, and emails you a plain-English report — what's right, what's missing, and what it means for an office like yours. Passive public lookups only; we never touch your systems.

If the grades come back rough, fixing these records is a small, well-defined job — the kind we handle constantly as part of [Microsoft 365 work](/services/microsoft-365) for offices from [Russell Springs](/areas/russell-springs) to [Somerset](/areas/somerset). [Get in touch](/contact) and we'll get your name back to being yours alone.`,
  },
  {
    slug: "slow-computer-what-99-visit-fixes",
    title: "Slow Computer? What a $99 In-Home Visit Actually Fixes",
    description:
      "A slow computer usually isn't dying — it's drowning. Here's what a technician actually does during a $99 in-home visit, and how to tell when a machine is worth fixing versus replacing.",
    publishedAt: "2026-07-10",
    contentMd: `"It's just slow" is the most common thing people tell us on the phone — usually followed by "I guess it's time for a new one?" Sometimes it is. More often the computer isn't dying; it's drowning. Here's what's usually going on, what we actually do about it during a [$99 in-home visit](/book?service=in-home-tech-help), and how to tell the difference between a machine worth rescuing and one worth retiring.

## What's usually making it slow

**Startup stowaways.** Every program you've ever installed wants to launch when the computer does — updaters, assistants, tray icons, that printer utility from 2019. One by one they're harmless; twenty at once is a traffic jam that makes a fast machine feel ancient before you've opened a thing.

**The browser carrying a decade of luggage.** For most people, the computer *is* the browser — and it's hauling fifteen extensions, a search bar nobody installed on purpose, notification spam from sites you visited once, and four hundred saved tabs. The machine's fine; the browser is exhausted.

**"Free" software that came along for the ride.** Games, coupon printers, PC "optimizers" (ironically, a leading cause of slowness), and trial antivirus stacked three deep, each scanning the same files and arguing over the results.

**An old-fashioned hard drive.** If your computer is more than five or six years old and takes minutes to boot, it may still have a spinning mechanical drive. Swapping it for a solid-state drive (SSD) is the single most dramatic speed upgrade a computer can get — an old machine can genuinely feel new.

**Actual malware.** Sometimes "slow" is the symptom of an infection working in the background. When that's what we find, we'll say so plainly — that's a different, deeper cleanup, and it's the [$149 virus and malware removal](/book?service=virus-malware-removal), not a surprise line item bolted onto your visit.

## What the hour actually looks like

A technician from our shop arrives at the time you picked — a confirmed slot, not a "sometime Thursday" window, because you [booked it online](/book) like a normal appointment. Then, in roughly this order:

1. **Listen first.** Slow *when*? Booting? Browsing? Printing? "Slow" has a dozen meanings and the details point straight at causes.
2. **Clear the startup jam** — disable the stowaways so turning on the computer stops being a coffee break.
3. **Clean up the browser** — hijacked search engines gone, junk extensions gone, notification spam silenced. Your bookmarks and saved passwords stay put.
4. **Evict the freeloaders** — the fake optimizers and stacked antivirus arguing in the background.
5. **Apply the updates that matter** and confirm real protection is on and working.
6. **Check the hardware's pulse** — drive health, memory, temperature. If the drive is failing, you'll hear it from us straight, with your options and real prices, not a scare pitch.
7. **Explain everything in plain English** — what we found, what we changed, and how to keep it quick.

If the fix takes twenty minutes, we don't invent work for the other forty. Stay curious — the rest of the hour is yours for questions, the printer that never worked right, or the phone that won't back up its photos.

## Fix it or replace it? Our honest rule of thumb

If the machine is under six or seven years old and the problem is software drowning it, a cleanup — or a cleanup plus an SSD — usually buys years of good service for far less than a new computer.

If it's older than that, struggling on hardware Windows barely supports, we'll tell you that too — and "don't put money in this one" is a sentence we say regularly, because [no upselling](/home-services) only means something if it occasionally costs us a sale. If you do replace it, our [$129 new-computer setup](/book?service=computer-setup) moves your files, photos, printers, and email so the new machine starts life actually *yours*.

## The part we're proudest of

The price on the menu is the price: **$99, posted publicly**, [booked online](/book) with a real appointment time, paid before we arrive, no travel fee in Russell Springs and a flat $25 in the [surrounding counties](/areas/jamestown). No meter, no mystery invoice, no wait-around window.

And if you'd rather not have a visit at all, a [$49 remote session](/book?service=remote-support) handles a surprising share of "slow" — a technician calls at your appointment time and works on your screen while you watch.

**Book it in two minutes** at the [booking page](/book), or call us at (270) 866-8660 — a person answers.`,
  },
];

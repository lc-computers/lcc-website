import type { Metadata } from "next";
import { Public_Sans, Source_Serif_4 } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ChatLauncher } from "@/components/chat/ChatLauncher";
import { RevealInit } from "@/components/ui/RevealInit";
import { JsonLd } from "@/components/JsonLd";
import { localBusinessJsonLd } from "@/lib/jsonld";
import { site } from "@/lib/site";
import "./globals.css";

// Static weights only — a fraction of the bytes of the full variable fonts,
// which is what the hero (LCP) heading waits on.
const publicSans = Public_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-public-sans",
  display: "swap",
});

const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-source-serif",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "Lake Cumberland Computers — IT Support for South-Central Kentucky",
    template: "%s | Lake Cumberland Computers",
  },
  description:
    "Managed IT, cybersecurity, and Microsoft 365 for local government and business — plus flat-rate in-home tech help you can book and pay for online. Russell Springs, KY, since 2001.",
  openGraph: {
    type: "website",
    siteName: site.name,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // suppressHydrationWarning: the inline script below adds the "js" class
    // to <html> before hydration (scroll-reveal no-JS fallback) — that class
    // difference is intentional.
    <html
      lang="en"
      className={`${publicSans.variable} ${sourceSerif.variable}`}
      suppressHydrationWarning
    >
      <body>
        {/* Enables scroll-reveal initial states only when JS runs (see globals.css) */}
        <script
          dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }}
        />
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-navy-700 focus:px-4 focus:py-2 focus:text-cream-50"
        >
          Skip to main content
        </a>
        <Header />
        <main id="main-content">{children}</main>
        <Footer />
        <ChatLauncher />
        <RevealInit />
        <JsonLd data={localBusinessJsonLd()} />
        <Analytics />
      </body>
    </html>
  );
}

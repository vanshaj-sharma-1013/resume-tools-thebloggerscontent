import type { Metadata } from "next";
import { HomeCtaBanner } from "@/components/marketing/home-cta-banner";
import { HomeFaq } from "@/components/marketing/home-faq";
import { HomeFeatureGrid } from "@/components/marketing/home-feature-grid";
import { HomeHero } from "@/components/marketing/home-hero";
import { HomeProcess } from "@/components/marketing/home-process";
import { MarketingPageShell } from "@/components/marketing/marketing-page-shell";
import { SiteFooter } from "@/components/marketing/site-footer";
import { SiteHeader } from "@/components/marketing/site-header";
import {
  defaultDescription,
  getSiteOrigin,
  SITE_BRAND,
  SITE_NAME,
} from "@/lib/site-config";

const keywords = [
  "free resume builder",
  "free resume maker",
  "free resume tools",
  "resume builder no login",
  "online resume maker free",
  "ATS friendly resume",
  "resume maker no watermark",
  "free CV maker",
  "resume PDF",
  SITE_NAME,
  SITE_BRAND,
] as const;

const origin = getSiteOrigin();

export const metadata: Metadata = {
  title: {
    absolute: `${SITE_NAME} — Free Resume Builder & Free Resume Maker (No Login, No Watermark)`,
  },
  description: defaultDescription,
  keywords: [...keywords],
  authors: [{ name: SITE_BRAND, url: origin }],
  creator: SITE_BRAND,
  publisher: SITE_BRAND,
  robots: { index: true, follow: true },
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: origin,
    siteName: SITE_NAME,
    title: `${SITE_NAME} — Free resume maker with no login`,
    description: defaultDescription,
    /* IMAGE: Add public/og-home.webp (1200×630) — product hero, brand colors */
    // images: [{ url: "/og-home.webp", width: 1200, height: 630, alt: `${SITE_NAME} — resume builder` }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} — Free resume maker online`,
    description: defaultDescription,
    /* IMAGE: Same as OG or a 1200×600 crop — public/twitter-home.webp */
    // images: ["/twitter-home.webp"],
  },
};

export default function Home() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: SITE_NAME,
    description: defaultDescription,
    url: origin,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Any",
    browserRequirements: "Requires JavaScript. Requires HTML5.",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    provider: {
      "@type": "Organization",
      name: SITE_BRAND,
      url: origin,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <MarketingPageShell>
        <SiteHeader active="home" />

        <main className="relative z-10 flex flex-1 flex-col">
          <HomeHero />
          <HomeProcess />
          <HomeFeatureGrid />
          <HomeFaq />
          <HomeCtaBanner />
          <SiteFooter />
        </main>
      </MarketingPageShell>
    </>
  );
}

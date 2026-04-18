import type { Metadata } from "next";
import { AboutAudience } from "@/components/marketing/about-audience";
import { AboutHeroGraphic } from "@/components/marketing/about-hero-graphic";
import { AboutPillars } from "@/components/marketing/about-pillars";
import { AboutProductCta } from "@/components/marketing/about-product-cta";
import { AboutStatsBand } from "@/components/marketing/about-stats-band";
import { AboutTimeline } from "@/components/marketing/about-timeline";
import { MarketingPageShell } from "@/components/marketing/marketing-page-shell";
import { SiteFooter } from "@/components/marketing/site-footer";
import { SiteHeader } from "@/components/marketing/site-header";
import {
  defaultDescription,
  getSiteOrigin,
  SITE_BRAND,
  SITE_NAME,
} from "@/lib/site-config";
import Link from "next/link";

const origin = getSiteOrigin();

export const metadata: Metadata = {
  title: "About us",
  description: `Learn about ${SITE_NAME} by ${SITE_BRAND}: a free resume builder and ATS checker focused on simplicity, privacy, and professional output.`,
  alternates: { canonical: `${origin}/about` },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: `${origin}/about`,
    siteName: SITE_NAME,
    title: `About ${SITE_NAME}`,
    description: defaultDescription,
  },
};

export default function AboutPage() {
  return (
    <MarketingPageShell>
      <SiteHeader active="about" />
      <main className="relative z-10 flex-1">
        <section className="mx-auto max-w-7xl px-4 pb-12 pt-14 sm:px-6 sm:pt-16 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-10">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.3em] text-secondary">
                About {SITE_NAME}
              </p>
              <h1 className="mt-4 text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-[2.65rem] lg:leading-[1.1]">
                Resumes that look sharp and read clean{" "}
                <span className="text-secondary">without the friction</span>
              </h1>
              <p className="mt-6 max-w-xl text-pretty text-lg leading-relaxed text-foreground-muted">
                We are a small product team behind{" "}
                <strong>
                  <Link className="underline" title="The Bloggers Content" href={"https://thebloggerscontent.com/"}>{SITE_BRAND}</Link>.
                </strong>
                {SITE_NAME}{" "}
                exists because job hunting is hard enough; formatting a PDF
                should not be another job on its own.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/resume-maker"
                  className="inline-flex items-center rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white shadow-[0_0_24px_var(--primary-glow)] transition-colors hover:bg-primary-hover"
                >
                  Start building
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center rounded-lg border border-charcoal-border bg-charcoal-elevated/50 px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:border-secondary/40 hover:text-secondary"
                >
                  Say hello
                </Link>
              </div>
            </div>
            <AboutHeroGraphic />
          </div>
        </section>

        <section className="border-y border-charcoal-border/60 bg-charcoal-elevated/20 py-12 sm:py-14">
          <AboutStatsBand />
        </section>

        <section className="py-16 sm:py-20">
          <AboutPillars />
        </section>

        <section className="border-t border-charcoal-border/50 bg-charcoal-elevated/15 py-16 sm:py-20">
          <AboutTimeline />
        </section>

        <section className="py-16 sm:py-20">
          <AboutAudience />
        </section>

        <section className="pb-20 sm:pb-24">
          <AboutProductCta />
        </section>
      </main>
      <SiteFooter />
    </MarketingPageShell>
  );
}

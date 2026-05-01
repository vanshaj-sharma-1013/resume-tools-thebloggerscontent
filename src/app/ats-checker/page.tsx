import type { Metadata } from "next";
import { MarketingPageShell } from "@/components/marketing/marketing-page-shell";
import { SiteFooter } from "@/components/marketing/site-footer";
import { SiteHeader } from "@/components/marketing/site-header";
import { defaultDescription, getSiteOrigin, SITE_NAME } from "@/lib/site-config";
import { ATSCheckerClient } from "./ats-checker-client";
import Link from "next/link";

const origin = getSiteOrigin();

export const metadata: Metadata = {
  title: "ATS resume checker (PDF)",
  description:
    "Upload a PDF resume for an honest ATS-style critique: score, keyword gaps, layout risks, and blunt feedback. Powered by AI; configure server API keys for your deployment.",
  alternates: { canonical: `${origin}/ats-checker` },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: `${origin}/ats-checker`,
    siteName: SITE_NAME,
    title: `${SITE_NAME} — ATS resume checker`,
    description: defaultDescription,
  },
};

export default function AtsCheckerPage() {
  return (
    <MarketingPageShell>
      <SiteHeader active="ats-checker" />
      <main className="relative z-10 flex-1">
        <div className="mx-auto container px-4 pb-6 pt-12 sm:px-6 lg:px-8">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-secondary">
            Resume Tools
          </p>
          <h1 className="mt-3 max-w-3xl text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            ATS checker — blunt, parser-first feedback
          </h1>
          <p className="mt-4 max-w-2xl text-pretty text-base leading-relaxed text-foreground-muted">
            Upload a PDF. We extract the text, then an AI model scores how well
            your resume would survive typical ATS parsing and recruiter
            skims. Expect straight talk: low scores are common when metrics
            and keywords are thin.
          </p>
          <ul className="mt-6 flex flex-wrap gap-x-8 gap-y-2 text-sm text-foreground-subtle">
            <li className="flex items-center gap-2">
              <span
                className="size-1.5 rounded-full bg-secondary"
                aria-hidden
              />
              PDF text extraction on the server
            </li>
            <li className="flex items-center gap-2">
              <span
                className="size-1.5 rounded-full bg-primary"
                aria-hidden
              />
              No file storage — one-off analysis
            </li>
            <li className="flex items-center gap-2">
              <span
                className="size-1.5 rounded-full bg-foreground-muted"
                aria-hidden
              />
              Heuristic, not a guarantee of any employer&apos;s system
            </li>
          </ul>
          <div className="mt-8">
            <Link
              href="/blogs/guides/how-to-use-ats-checker"
              className="inline-flex items-center justify-center rounded-lg border border-charcoal-border px-4 py-2 text-sm font-medium text-foreground-muted transition-colors hover:border-secondary/40 hover:text-foreground"
            >
              Read the ATS Checker Guide
            </Link>
          </div>
        </div>
        <ATSCheckerClient />
      </main>
      <SiteFooter />
    </MarketingPageShell>
  );
}

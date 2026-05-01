import type { Metadata } from "next";
import Link from "next/link";
import { MarketingPageShell } from "@/components/marketing/marketing-page-shell";
import { SiteFooter } from "@/components/marketing/site-footer";
import { SiteHeader } from "@/components/marketing/site-header";
import {
  defaultDescription,
  getSiteOrigin,
  SITE_BRAND,
  SITE_NAME,
} from "@/lib/site-config";

const origin = getSiteOrigin();

const resumeMakerDescription =
  "Free resume maker online with no login and no watermark. Choose a professional theme, add your work history and skills, preview your resume as a PDF, and download when you are ready.";

const keywords = [
  "free resume maker",
  "free resume maker no login",
  "resume maker online free",
  "resume builder no sign up",
  "resume maker no watermark",
  "free CV builder",
  "create resume online free",
  "ATS resume maker",
  "instant resume PDF",
  "online resume creator",
] as const;

export const metadata: Metadata = {
  title: {
    absolute:
      "Free Resume Maker Online — No Login, No Watermark | Resume Tools",
  },
  description: resumeMakerDescription,
  keywords: [...keywords],
  authors: [{ name: SITE_BRAND, url: origin }],
  creator: SITE_BRAND,
  publisher: SITE_BRAND,
  robots: { index: true, follow: true },
  alternates: { canonical: "/resume-maker" },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: `${origin}/resume-maker`,
    siteName: SITE_NAME,
    title: "Free resume maker — no login required, no watermark",
    description: resumeMakerDescription,
    /* IMAGE: public/og-resume-maker.webp (1200×630) — headline + product UI mock */
    // images: [{ url: "/og-resume-maker.webp", width: 1200, height: 630, alt: "Free online resume maker" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free resume maker online (no login, no watermark)",
    description: resumeMakerDescription,
    // images: ["/twitter-resume-maker.webp"],
  },
};

const steps = [
  {
    title: "Select a resume theme",
    body: "Browse professional layouts built for readability and ATS parsers. Your choice applies to the PDF preview and export — switch later without losing content.",
  },
  {
    title: "Add your details in guided steps",
    body: "Complete contact information, summary, experience, skills, and education with clear prompts. Your draft saves locally in your browser on this device.",
  },
  {
    title: "Preview and download your resume",
    body: "Open the live PDF preview to check formatting, tighten bullets, then download a clean file — no watermark, no account gate.",
  },
] as const;

const benefits = [
  {
    title: "No login required",
    body: "Start immediately. We do not ask you to create an account or connect social profiles to use the resume maker.",
  },
  {
    title: "No watermark on your PDF",
    body: "Your resume is yours. Export focuses on a professional presentation without branding stamped across the page.",
  },
  {
    title: "Free to use",
    body: "Core building, preview, and download are available without a subscription or trial countdown.",
  },
  {
    title: "Theme-first workflow",
    body: "Pick the visual system up front so you always see your content in a layout that matches your industry.",
  },
] as const;

const faq = [
  {
    q: "Is this resume maker really free with no login?",
    a: "Yes. You can start from this page, choose a theme, complete the builder steps, and use the PDF preview without signing up. Data stays in your browser storage on your device unless you clear it.",
  },
  {
    q: "Does the downloaded resume have a watermark?",
    a: "No. The goal is a clean, employer-ready PDF suitable for applications and ATS uploads.",
  },
  {
    q: "What do I need to do first?",
    a: "Click “Start free resume maker” to open theme selection. After you pick a design, continue to the guided resume creation flow.",
  },
  {
    q: "Is the resume ATS friendly?",
    a: "Templates emphasize clear section headings, conventional ordering, and scannable bullets — patterns that work well with typical applicant tracking systems.",
  },
] as const;

export default function ResumeMakerPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <MarketingPageShell>
        <SiteHeader active="resume-maker" />

        <main className="relative z-10 flex flex-1 flex-col">
          <article className="mx-auto w-full max-w-3xl px-4 pb-10 pt-14 sm:px-6 sm:pt-16 lg:px-8">
            <header className="border-b border-charcoal-border pb-10">
              <p className="text-xs font-semibold uppercase tracking-widest text-secondary">
                {SITE_NAME} · {SITE_BRAND}
              </p>
              <h1 className="mt-4 text-4xl font-semibold leading-tight tracking-tight text-foreground sm:text-5xl">
                Free resume maker online — no login, no watermark
              </h1>
              <p className="mt-6 text-lg leading-relaxed text-foreground-muted">
                Looking for a{" "}
                <strong className="font-medium text-foreground">
                  free resume maker with no login
                </strong>
                ? This tool walks you through{" "}
                <strong className="font-medium text-foreground">
                  theme selection
                </strong>
                , structured fields, and a{" "}
                <strong className="font-medium text-foreground">
                  live PDF preview
                </strong>
                . When you are done, download a polished resume —{" "}
                <strong className="font-medium text-foreground">
                  no watermark
                </strong>
                , no paywall for the core flow.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                <Link
                  href="/theme-selection"
                  className="inline-flex h-12 items-center justify-center rounded-lg bg-secondary px-8 text-sm font-semibold text-charcoal shadow-[0_0_32px_var(--secondary-glow)] transition-colors hover:bg-secondary-hover"
                >
                  Start free resume maker
                </Link>
                <Link
                  href="/blogs/guides/how-to-use-resume-maker"
                  className="inline-flex h-12 items-center justify-center rounded-lg border border-charcoal-border px-8 text-sm font-semibold text-foreground-muted transition-colors hover:border-secondary/40 hover:text-foreground"
                >
                  Read Guide
                </Link>
                <Link
                  href="/"
                  className="text-center text-sm font-medium text-secondary underline-offset-4 hover:underline sm:text-left"
                >
                  Back to home
                </Link>
              </div>
            </header>

            {/* ——— IMAGE PLACEHOLDER: Above-the-fold illustration ———
                File: public/marketing/resume-maker-hero.webp (~1200×640 WebP)
                Content: split view — form fields on left, PDF preview on right.
            <div className="relative mt-10 aspect-[15/8] w-full overflow-hidden rounded-2xl border border-charcoal-border">
              <Image ... />
            </div>
            ——— */}

            <section className="py-12" aria-labelledby="how-it-works-heading">
              <h2
                id="how-it-works-heading"
                className="text-2xl font-semibold text-foreground sm:text-3xl"
              >
                How the free resume maker works
              </h2>
              <p className="mt-4 leading-relaxed text-foreground-muted">
                The process is intentionally short:{" "}
                <strong className="font-medium text-foreground">
                  select theme → add details → your resume is ready
                </strong>{" "}
                to preview and save. You stay in control of edits until you are
                happy with the PDF.
              </p>
              <ol className="mt-8 space-y-6">
                {steps.map((s, i) => (
                  <li
                    key={s.title}
                    className="flex gap-4 rounded-xl border border-charcoal-border bg-charcoal-elevated/35 p-5 sm:p-6"
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/30 font-mono text-sm font-bold text-secondary">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">
                        {s.title}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-foreground-muted">
                        {s.body}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </section>

            <section className="border-t border-charcoal-border py-12" aria-labelledby="benefits-heading">
              <h2
                id="benefits-heading"
                className="text-2xl font-semibold text-foreground sm:text-3xl"
              >
                Why job seekers use this resume builder
              </h2>
              <ul className="mt-8 grid gap-5 sm:grid-cols-2">
                {benefits.map((b) => (
                  <li
                    key={b.title}
                    className="rounded-xl border border-charcoal-border bg-charcoal/50 p-5"
                  >
                    <h3 className="font-semibold text-foreground">
                      {b.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-foreground-muted">
                      {b.body}
                    </p>
                  </li>
                ))}
              </ul>
            </section>

            <section
              className="border-t border-charcoal-border py-12"
              aria-labelledby="keywords-heading"
            >
              <h2
                id="keywords-heading"
                className="text-2xl font-semibold text-foreground sm:text-3xl"
              >
                Built for “free resume maker” searches — and real applications
              </h2>
              <div className="mt-6 space-y-4 text-foreground-muted leading-relaxed">
                <p>
                  If you searched for{" "}
                  <strong className="font-medium text-foreground">
                    free resume maker no login required
                  </strong>
                  ,{" "}
                  <strong className="font-medium text-foreground">
                    resume maker online free
                  </strong>
                  , or{" "}
                  <strong className="font-medium text-foreground">
                    resume builder without watermark
                  </strong>
                  , you are in the right place. The workflow is designed so you
                  can move from zero to a printable resume quickly — without
                  handing over credentials first.
                </p>
                <p>
                  For context, {SITE_NAME} is part of {SITE_BRAND}&apos;s
                  utilities-focused experience: the same product values apply
                  here — clarity, speed, and respect for your time. You can also
                  read the broader overview on the{" "}
                  <Link
                    href="/"
                    className="font-medium text-secondary underline-offset-4 hover:underline"
                  >
                    homepage
                  </Link>{" "}
                  or jump straight into{" "}
                  <Link
                    href="/theme-selection"
                    className="font-medium text-secondary underline-offset-4 hover:underline"
                  >
                    theme selection
                  </Link>{" "}
                  to begin.
                </p>
              </div>
            </section>

            <section className="border-t border-charcoal-border py-12">
              <h2 className="text-2xl font-semibold text-foreground sm:text-3xl">
                Frequently asked questions
              </h2>
              <div className="mt-8 divide-y divide-charcoal-border rounded-xl border border-charcoal-border bg-charcoal-elevated/30 px-5 sm:px-6">
                {faq.map((item) => (
                  <details key={item.q} className="group py-5">
                    <summary className="cursor-pointer list-none text-base font-medium text-foreground marker:content-none [&::-webkit-details-marker]:hidden">
                      <span className="flex items-center justify-between gap-3">
                        {item.q}
                        <span className="font-mono text-secondary transition-transform group-open:rotate-45">
                          +
                        </span>
                      </span>
                    </summary>
                    <p className="mt-3 text-sm leading-relaxed text-foreground-muted">
                      {item.a}
                    </p>
                  </details>
                ))}
              </div>
            </section>

            <section className="border-t border-charcoal-border py-14 text-center">
              <h2 className="text-2xl font-semibold text-foreground sm:text-3xl">
                Start your resume — free, fast, no login
              </h2>
              <p className="mx-auto mt-4 max-w-lg text-foreground-muted">
                {defaultDescription}
              </p>
              <Link
                href="/theme-selection"
                className="mt-8 inline-flex h-12 items-center justify-center rounded-lg bg-primary px-10 text-sm font-semibold text-white shadow-[0_0_28px_var(--primary-glow)] transition-colors hover:bg-primary-hover"
              >
                Open theme selection
              </Link>
            </section>
          </article>

          <SiteFooter />
        </main>
      </MarketingPageShell>
    </>
  );
}

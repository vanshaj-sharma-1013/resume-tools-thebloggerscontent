import Image from "next/image";
import Link from "next/link";
import { SITE_BRAND, SITE_NAME } from "@/lib/site-config";
import { HomeValueStrip } from "@/components/marketing/home-value-strip";

/** Small decorative SVG — complements hero image, unique IDs for SSR. */
function HeroSparkle() {
  return (
    <div className="pointer-events-none absolute -right-4 -top-8 hidden opacity-90 sm:block lg:-right-8 lg:-top-12">
      <svg
        width="120"
        height="120"
        viewBox="0 0 120 120"
        fill="none"
        className="text-secondary/40"
        aria-hidden
      >
        <defs>
          <linearGradient id="home-sp-g" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#6d28d9" stopOpacity="0.3" />
          </linearGradient>
        </defs>
        <circle cx="60" cy="60" r="54" stroke="url(#home-sp-g)" strokeWidth="1" />
        <path
          d="M60 20v80M20 60h80"
          stroke="currentColor"
          strokeWidth="0.75"
          strokeDasharray="4 6"
        />
      </svg>
    </div>
  );
}

export function HomeHero() {
  return (
    <section
      id="start"
      className="relative mx-auto w-full max-w-7xl px-4 pb-16 pt-14 sm:px-6 sm:pt-16 lg:px-8 lg:pt-20"
    >
      <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-14">
        <div className="relative max-w-xl lg:max-w-none">
          <HeroSparkle />
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-secondary">
            {SITE_NAME} · {SITE_BRAND}
          </p>
          <h1 className="mt-4 text-4xl font-semibold leading-[1.12] tracking-tight text-foreground sm:text-5xl lg:text-[3.25rem]">
            A free resume maker that looks{" "}
            <span className="bg-gradient-to-r from-primary-hover via-secondary to-primary bg-clip-text text-transparent">
              hire-ready
            </span>{" "}
            in minutes
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-foreground-muted">
            Build an ATS-friendly resume online: select a theme, add your
            experience and skills, preview a polished PDF{" "}
            <strong className="font-medium text-foreground">
              no login, no subscription, no watermark.
            </strong>{" "}
            Built for job seekers who want speed and clarity, not upsells.
          </p>

          <div
            className="relative mt-6 aspect-[4/3] w-full overflow-hidden rounded-2xl border border-charcoal-border bg-gradient-to-br from-charcoal-elevated via-charcoal to-primary-muted/30 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] md:hidden"
            aria-hidden
          >
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,rgba(109,40,217,0.35),transparent_55%),radial-gradient(ellipse_at_80%_80%,rgba(34,211,238,0.2),transparent_50%)]" />
            <div className="absolute inset-8 flex items-center justify-center rounded-lg border border-charcoal-border/80 bg-charcoal/80 shadow-lg backdrop-blur-sm">
              <Image
                src="/home/hero.png"
                alt=""
                height={1000}
                width={3000}
                className="size-full object-contain"
                priority
              />
            </div>
          </div>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
            <Link
              href="/theme-selection"
              className="inline-flex h-12 items-center justify-center rounded-lg bg-secondary px-8 text-sm font-semibold text-charcoal shadow-[0_0_32px_var(--secondary-glow)] transition-colors hover:bg-secondary-hover"
            >
              Create your resume
            </Link>
            <Link
              href="/cover-letter-themes"
              className="inline-flex h-12 items-center justify-center rounded-lg border border-charcoal-border bg-charcoal-elevated/50 px-8 text-sm font-medium text-foreground transition-colors hover:border-secondary/50 hover:text-secondary"
            >
              Create cover letter
            </Link>
          </div>
          <ul className="mt-10 flex flex-wrap gap-x-6 gap-y-2 text-sm text-foreground-muted">
            <li className="flex items-center gap-2">
              <span
                className="h-1.5 w-1.5 rounded-full bg-secondary"
                aria-hidden
              />
              Instant theme preview
            </li>
            <li className="flex items-center gap-2">
              <span
                className="h-1.5 w-1.5 rounded-full bg-secondary"
                aria-hidden
              />
              Works in your browser
            </li>
            <li className="flex items-center gap-2">
              <span
                className="h-1.5 w-1.5 rounded-full bg-secondary"
                aria-hidden
              />
              Privacy-first local draft
            </li>
          </ul>
        </div>

        <div
          className="relative hidden aspect-[4/3] w-full overflow-hidden rounded-2xl border border-charcoal-border bg-gradient-to-br from-charcoal-elevated via-charcoal to-primary-muted/30 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] lg:block"
          aria-hidden
        >
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,rgba(109,40,217,0.35),transparent_55%),radial-gradient(ellipse_at_80%_80%,rgba(34,211,238,0.2),transparent_50%)]" />
          <div className="absolute inset-8 flex items-center justify-center rounded-lg border border-charcoal-border/80 bg-charcoal/80 shadow-lg backdrop-blur-sm">
            <Image
              src="/home/hero.png"
              alt=""
              height={1000}
              width={3000}
              className="size-full object-contain"
              priority
            />
          </div>
          <div className="pointer-events-none absolute bottom-4 right-4 rounded-lg border border-secondary/30 bg-charcoal/90 px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest text-secondary backdrop-blur-sm">
            Live PDF preview
          </div>
        </div>
      </div>

      <HomeValueStrip />
    </section>
  );
}

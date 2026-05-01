import Link from "next/link";
import Image from "next/image";
import { SITE_NAME } from "@/lib/site-config";

const linkClass =
  "text-sm text-foreground-muted transition-colors hover:text-secondary";

const headingClass =
  "text-xs font-semibold uppercase tracking-[0.2em] text-foreground-subtle";

export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="relative z-10 border-t border-charcoal-border/90 bg-charcoal-elevated/40 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1.15fr)_repeat(3,minmax(0,1fr))] lg:gap-10">
          <div className="flex flex-col gap-5">
            <Link href="/" className="inline-flex w-fit items-center">
              <Image
                src="/resume-logo.png"
                alt={SITE_NAME}
                width={500}
                height={100}
                className="h-12 w-auto sm:h-14"
              />
            </Link>
            <p className="max-w-sm text-sm leading-relaxed text-foreground-muted">
              Free online resume maker: pick a theme, add your details, preview
              and download. No account required built for job seekers who
              want a clean, ATS-friendly PDF fast.
            </p>
            <p className="font-mono text-[10px] uppercase tracking-widest text-secondary/90">
              No login · No watermark
            </p>
          </div>

          <div>
            <h2 className={headingClass}>Product</h2>
            <ul className="mt-4 flex flex-col gap-3">
              <li>
                <Link href="/resume-maker" className={linkClass}>
                  Resume maker
                </Link>
              </li>
              <li>
                <Link href="/ats-checker" className={linkClass}>
                  ATS checker
                </Link>
              </li>
              <li>
                <Link href="/theme-selection" className={linkClass}>
                  Choose theme
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h2 className={headingClass}>Company</h2>
            <ul className="mt-4 flex flex-col gap-3">
              <li>
                <Link href="/about" className={linkClass}>
                  About
                </Link>
              </li>
              <li>
                <Link href="/contact" className={linkClass}>
                  Contact us
                </Link>
              </li>
              <li>
                <Link href="/blogs" className={linkClass}>
                  Blogs
                </Link>
              </li>
              <li>
                <Link href="/blogs/guides" className={linkClass}>
                  Guides
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h2 className={headingClass}>Legal</h2>
            <ul className="mt-4 flex flex-col gap-3">
              <li>
                <Link href="/legal/terms" className={linkClass}>
                  Terms &amp; conditions
                </Link>
              </li>
              <li>
                <Link href="/legal/privacy" className={linkClass}>
                  Privacy policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-charcoal-border/70 pt-8 sm:flex-row sm:gap-3">
          <p className="text-center text-sm text-foreground-muted sm:text-left">
            © {year} {SITE_NAME}. Free to use.
          </p>
          <p className="text-center text-xs text-foreground-subtle sm:text-right">
            Resume Tools is provided as-is. See our legal pages for terms and
            data practices.
          </p>
        </div>
      </div>
    </footer>
  );
}

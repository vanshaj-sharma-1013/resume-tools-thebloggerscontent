import Link from "next/link";
import { SITE_BRAND, SITE_NAME } from "@/lib/site-config";
import Image from "next/image";

const navLinkClass =
  "text-sm text-foreground-muted transition-colors hover:text-secondary";

type SiteHeaderProps = {
  /** Highlights the active primary nav item for accessibility and UX */
  active?:
  | "home"
  | "resume-maker"
  | "cover-letter"
  | "ats-checker"
  | "about"
  | "contact";
};

export function SiteHeader({ active }: SiteHeaderProps) {
  return (
    <header className="relative z-10 border-b border-charcoal-border/80 bg-charcoal/80 backdrop-blur-md">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="group flex min-w-0 items-baseline gap-2">
          <span className="flex items-center gap-2">
            <Image src={"/resume-logo.png"} alt={SITE_NAME} width={500} height={100} className="h-14 sm:h-16 w-auto" />
            {/* <Image src={"/favicon.png"} alt={"Free Resume Maker By The Bloggers Content"} width={100} height={100} className="block sm:hidden size-14" /> */}
          </span>
        </Link>
        <nav
          className="flex shrink-0 items-center gap-3 sm:gap-6"
          aria-label="Primary"
        >
          <Link
            href="/resume-maker"
            className={`hidden sm:inline ${navLinkClass} ${active === "resume-maker" ? "text-secondary" : ""
              }`}
          >
            Resume Maker
          </Link>
          <Link
            href="/cover-letter-maker"
            className={`hidden sm:inline ${navLinkClass} ${active === "cover-letter" ? "text-secondary" : ""
              }`}
          >
            Cover Letter
          </Link>
          <Link
            href="/ats-checker"
            className={`hidden sm:inline ${navLinkClass} ${active === "ats-checker" ? "text-secondary" : ""
              }`}
          >
            ATS Checker
          </Link>
          <Link
            href="/about"
            className={`hidden sm:inline ${navLinkClass} ${active === "about" ? "text-secondary" : ""
              }`}
          >
            About
          </Link>
          <Link
            href="/contact"
            className={`hidden sm:inline ${navLinkClass} ${active === "contact" ? "text-secondary" : ""
              }`}
          >
            Contact
          </Link>
          <Link
            href="/theme-selection"
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white shadow-[0_0_24px_var(--primary-glow)] transition-colors hover:bg-primary-hover"
          >
            Start free
          </Link>
        </nav>
      </div>
    </header >
  );
}

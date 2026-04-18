import Link from "next/link";

const features = [
  {
    title: "Guided resume builder",
    description:
      "Step-by-step sections for contact, summary, experience, skills, and education — structured for recruiters and parsers.",
    icon: (
      <svg className="size-6" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          className="text-secondary"
        />
      </svg>
    ),
  },
  {
    title: "Professional themes",
    description:
      "Choose a layout and palette that fits your industry. Switch themes anytime without retyping your content.",
    icon: (
      <svg className="size-6" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M4 5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5zM14 5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1V5zM4 15a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-4zM14 15a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1v-4z"
          stroke="currentColor"
          strokeWidth="1.5"
          className="text-primary"
        />
      </svg>
    ),
  },
  {
    title: "Live PDF preview",
    description:
      "See your resume as a real PDF while you edit. Download when you are happy. No surprise formatting.",
    icon: (
      <svg className="size-6" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0zM2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          className="text-secondary"
        />
      </svg>
    ),
  },
  {
    title: "ATS-minded structure",
    description:
      "Clean headings, scannable bullets, and sensible ordering so automated screeners can read your story.",
    icon: (
      <svg className="size-6" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M9 12l2 2 4-4m5 2a9 9 0 1 1-18 0 9 9 0 0 1 18 0z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-primary"
        />
      </svg>
    ),
  },
] as const;

export function HomeFeatureGrid() {
  return (
    <main
      id="features"
      className="mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 lg:px-8"
    >
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-secondary">
            Product
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Everything you need for a strong first impression
          </h2>
        </div>
        <p className="max-w-md text-sm leading-relaxed text-foreground-muted md:text-right">
          Polished output, focused UX, and copy that respects your time whether
          you are applying to your first role or your next leap.
        </p>
      </div>

      <ul className="mt-12 grid gap-6 sm:grid-cols-2">
        {features.map((f) => (
          <li
            key={f.title}
            className="group relative overflow-hidden rounded-2xl border border-charcoal-border/90 bg-charcoal-elevated/40 p-6 transition-[border-color,box-shadow] hover:border-secondary/35 hover:shadow-[0_0_48px_-20px_var(--secondary-glow)]"
          >
            <div
              className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-primary/15 blur-2xl transition-opacity group-hover:opacity-100"
              aria-hidden
            />
            <div className="relative flex size-11 items-center justify-center rounded-xl bg-charcoal/80 ring-1 ring-charcoal-border/80">
              {f.icon}
            </div>
            <h3 className="relative mt-4 text-xl font-semibold text-foreground">
              {f.title}
            </h3>
            <p className="relative mt-3 text-sm leading-relaxed text-foreground-muted">
              {f.description}
            </p>
          </li>
        ))}
      </ul>

      <div className="mt-12 flex flex-col items-stretch justify-center gap-4 rounded-2xl border border-dashed border-secondary/30 bg-secondary/5 px-6 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <div>
          <p className="font-medium text-foreground">Already have a PDF?</p>
          <p className="mt-1 text-sm text-foreground-muted">
            Run it through our ATS checker for parser-focused feedback.
          </p>
        </div>
        <Link
          href="/ats-checker"
          className="inline-flex h-11 shrink-0 items-center justify-center rounded-lg bg-charcoal-elevated px-6 text-sm font-medium text-secondary ring-1 ring-secondary/40 transition-colors hover:bg-secondary/10"
        >
          Open ATS checker
        </Link>
      </div>
    </main>
  );
}

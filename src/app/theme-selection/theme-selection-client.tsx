"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { BuilderBackground } from "@/components/builder-background";
import { BuilderHeader } from "@/components/builder-header";
import { ThemeMiniPreview } from "@/components/theme-mini-preview";
import { useResumeDraft } from "@/hooks/use-resume-draft";
import { saveDraftToStorage } from "@/lib/resume-draft";
import type { ResumeThemeId } from "@/lib/resume-themes";
import { RESUME_THEMES } from "@/lib/resume-themes";

export function ThemeSelectionClient() {
  const router = useRouter();
  const { draft, updateDraft, hydrated } = useResumeDraft();
  const [error, setError] = useState<string | null>(null);

  const selected = draft.themeId;

  const selectTheme = (id: ResumeThemeId) => {
    setError(null);
    updateDraft({ themeId: id });
  };

  const handleContinue = () => {
    if (!draft.themeId) {
      setError("Pick a theme to continue—we will match your PDF layout to it.");
      return;
    }
    saveDraftToStorage(draft);
    router.push("/resume-creation");
  };

  return (
    <div className="relative flex min-h-full flex-1 flex-col overflow-hidden bg-background">
      <BuilderBackground />
      <BuilderHeader
        eyebrow="flow.step_1"
        title="Choose your resume design"
        subtitle="Four professional layouts · switch later without losing content"
      />

      <main className="relative z-10 mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm leading-relaxed text-foreground-muted">
            Select the visual system that fits your industry. Your content is
            stored on this device only—we will use this choice when PDF export
            arrives.
            <br />
            <b>Note:</b> A new theme is currently in development—stay tuned!
          </p>
          <p className="mt-2 font-mono text-xs text-secondary">
            ~30 seconds · saves automatically
          </p>
        </div>

        {!hydrated ? (
          <p
            className="mt-10 text-center text-sm text-foreground-muted"
            role="status"
          >
            Loading your last selection…
          </p>
        ) : (
          <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:gap-6">
            {RESUME_THEMES.map((theme) => {
              const isActive = selected === theme.id;
              return (
                <li key={theme.id}>
                  <button
                    type="button"
                    onClick={() => selectTheme(theme.id)}
                    aria-pressed={isActive}
                    className={`group flex w-full flex-col rounded-2xl border p-4 text-left transition-all sm:p-5 ${
                      isActive
                        ? "border-secondary bg-charcoal-elevated/60 shadow-[0_0_0_1px_rgba(34,211,238,0.35)]"
                        : "border-charcoal-border bg-charcoal-elevated/30 hover:border-secondary/35"
                    }`}
                  >
                    <div className="flex flex-1 flex-col gap-4 sm:flex-row sm:items-stretch">
                      <div className="sm:w-[44%]">
                        <ThemeMiniPreview
                          themeId={theme.id}
                          accent={theme.accent}
                        />
                      </div>
                      <div className="flex min-w-0 flex-1 flex-col">
                        <div className="flex flex-wrap items-start justify-between gap-2">
                          <div>
                            <h2 className="text-base font-semibold text-foreground sm:text-lg">
                              {theme.name}
                            </h2>
                            <p className="mt-0.5 font-mono text-[11px] text-secondary">
                              {theme.tagline}
                            </p>
                          </div>
                          <span
                            className={`shrink-0 rounded-full px-2 py-0.5 font-mono text-[10px] uppercase tracking-wide ring-1 ring-charcoal-border ${
                              isActive
                                ? "text-secondary ring-secondary/50"
                                : "text-foreground-muted"
                            }`}
                          >
                            {isActive ? "Selected" : "Tap to select"}
                          </span>
                        </div>
                        <p className="mt-3 text-sm leading-relaxed text-foreground-muted">
                          {theme.description}
                        </p>
                        <p className="mt-auto pt-4 text-xs text-foreground-subtle">
                          <span className="font-medium text-foreground-muted">
                            Best for:{" "}
                          </span>
                          {theme.bestFor}
                        </p>
                      </div>
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        )}

        {error ? (
          <p
            className="mx-auto mt-6 max-w-xl rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-center text-sm text-red-200"
            role="alert"
          >
            {error}
          </p>
        ) : null}

        <div className="mx-auto mt-10 flex max-w-xl flex-col gap-3 sm:flex-row sm:justify-between">
          <Link
            href="/"
            className="inline-flex h-11 items-center justify-center rounded-lg border border-charcoal-border px-5 text-sm font-medium text-foreground-muted transition-colors hover:border-secondary/40 hover:text-foreground"
          >
            Back to home
          </Link>
          <button
            type="button"
            onClick={handleContinue}
            disabled={!hydrated}
            className="inline-flex h-11 items-center justify-center rounded-lg bg-secondary px-6 text-sm font-semibold text-charcoal shadow-[0_0_28px_var(--secondary-glow)] transition-colors hover:bg-secondary-hover disabled:cursor-not-allowed disabled:opacity-50"
          >
            Continue to resume builder
          </button>
        </div>

        <p className="mt-8 text-center font-mono text-[10px] uppercase tracking-widest text-foreground-subtle">
          selection stored locally · resume-creation next
        </p>
      </main>
    </div>
  );
}

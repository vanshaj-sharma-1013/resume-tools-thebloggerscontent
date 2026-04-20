"use client";

import Link from "next/link";
import { useCallback, useMemo, useState } from "react";
import { BuilderBackground } from "@/components/builder-background";
import { BuilderHeader } from "@/components/builder-header";
import { useResumeDraft } from "@/hooks/use-resume-draft";
import {
  emptyEducation,
  emptyExperience,
  RESUME_STEP_COUNT,
  type EducationEntry,
  type ExperienceEntry,
} from "@/lib/resume-draft";
import { RESUME_THEMES } from "@/lib/resume-themes";
import { parseBulletLines, parseSkillTokens } from "@/lib/resume-text";

const inputClass =
  "w-full rounded-lg border border-charcoal-border bg-charcoal-elevated/70 px-3 py-2.5 text-sm text-foreground placeholder:text-foreground-subtle shadow-sm transition-colors focus:border-secondary focus:outline-none focus:ring-1 focus:ring-secondary";

const labelClass = "mb-1.5 block text-xs font-medium text-foreground-muted";

const STEP_META = [
  {
    title: "Contact & headline",
    eyebrow: "step_01_of_06",
    hint: "Recruiters look here first. Keep it accurate and scannable.",
    required: [
      "Full name and professional title",
      "A reliable email (required)",
      "LinkedIn and GitHub are optional",
    ],
    time: "~1 min",
  },
  {
    title: "Professional summary",
    eyebrow: "step_02_of_06",
    hint: "Three or four sentences: who you are, what you solve, and proof of impact.",
    required: [
      "40+ characters (about 2 short sentences minimum)",
      "Focus on outcomes, not buzzwords",
    ],
    time: "~1 min",
  },
  {
    title: "Work experience",
    eyebrow: "step_03_of_06",
    hint: "Start with your latest role. Bullets = one achievement per line.",
    required: [
      "Company and job title",
      "Start date (month/year is fine)",
      "At least one concrete bullet",
    ],
    time: "~2 min",
  },
  {
    title: "Education",
    eyebrow: "step_04_of_06",
    hint: "Degrees and certifications recruiters expect to see—skip if none yet.",
    required: [
      "Add one or more schools (degree required per entry), or skip",
    ],
    time: "~30 sec",
  },
  {
    title: "Skills",
    eyebrow: "step_05_of_06",
    hint: "Mix hard skills (tools, methods) with a few standout strengths.",
    required: ["At least 3 skills, comma-separated"],
    time: "~30 sec",
  },
  {
    title: "Languages",
    eyebrow: "step_06_of_06",
    hint: "List languages you are proficient in to stand out in global teams.",
    required: ["Languages like English, Spanish, etc."],
    time: "~30 sec",
  },
] as const;

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

export function ResumeWizard() {
  const { draft, updateDraft, hydrated, resetDraft } = useResumeDraft();
  const [error, setError] = useState<string | null>(null);

  const step = draft.currentStep;
  const themeName = useMemo(() => {
    if (!draft.themeId) return null;
    return RESUME_THEMES.find((t) => t.id === draft.themeId)?.name ?? null;
  }, [draft.themeId]);

  const progressPercent =
    step >= RESUME_STEP_COUNT ? 100 : ((step + 1) / RESUME_STEP_COUNT) * 100;

  const minutesLeft =
    step >= RESUME_STEP_COUNT ? 0 : Math.max(1, RESUME_STEP_COUNT - step);

  const persistStep = useCallback(
    (next: number) => {
      updateDraft({ currentStep: Math.min(RESUME_STEP_COUNT, Math.max(0, next)) });
    },
    [updateDraft],
  );

  const validateStep = useCallback((): boolean => {
    setError(null);
    if (step === 0) {
      const { fullName, professionalTitle, email } = draft.contact;
      if (!fullName.trim()) {
        setError("Add your full name so employers know who they are hiring.");
        return false;
      }
      if (!professionalTitle.trim()) {
        setError("Add a professional title (e.g. “Senior Product Designer”).");
        return false;
      }
      if (!email.trim() || !isValidEmail(email)) {
        setError("Enter a valid email address.");
        return false;
      }
      return true;
    }
    if (step === 1) {
      if (draft.summary.trim().length < 40) {
        setError(
          "Write a bit more in your summary—aim for at least two short sentences.",
        );
        return false;
      }
      return true;
    }
    if (step === 2) {
      if (draft.experienceSkipped) return true;
      const primary = draft.experiences[0];
      if (!primary.company.trim() || !primary.role.trim()) {
        setError("Add your company and job title for your main role.");
        return false;
      }
      const bullets = parseBulletLines(primary.bullets);
      if (bullets.length < 1) {
        setError("Add at least one bullet describing a result or responsibility.");
        return false;
      }
      return true;
    }
    if (step === 3) {
      if (draft.educationSkipped) return true;
      const hasComplete = draft.education.some(
        (e) => e.school.trim() && e.degree.trim(),
      );
      if (!hasComplete) {
        setError(
          "Add at least one school with a degree, or check “Skip education for now”.",
        );
        return false;
      }
      return true;
    }
    if (step === 4) {
      const skills = parseSkillTokens(draft.skills);
      if (skills.length < 3) {
        setError("Add at least three skills, separated by commas.");
        return false;
      }
      return true;
    }
    if (step === 5) {
      // Languages are optional but recommended
      return true;
    }
    return true;
  }, [draft, step]);

  const goNext = () => {
    if (!validateStep()) return;
    if (step === RESUME_STEP_COUNT - 1) {
      persistStep(RESUME_STEP_COUNT);
    } else {
      persistStep(step + 1);
    }
  };

  const goBack = () => {
    setError(null);
    if (step <= 0) return;
    persistStep(step - 1);
  };

  const updateContact = (patch: Partial<typeof draft.contact>) => {
    updateDraft((d) => ({
      ...d,
      contact: { ...d.contact, ...patch },
    }));
  };

  const updateExperience = (index: number, patch: Partial<ExperienceEntry>) => {
    updateDraft((d) => {
      const experiences = d.experiences.map((e, i) =>
        i === index ? { ...e, ...patch } : e,
      );
      return { ...d, experiences };
    });
  };

  const addExperience = () => {
    updateDraft((d) => {
      if (d.experiences.length >= 3) return d;
      return { ...d, experiences: [...d.experiences, emptyExperience()] };
    });
  };

  const removeExperience = (index: number) => {
    updateDraft((d) => {
      if (d.experiences.length <= 1) return d;
      return {
        ...d,
        experiences: d.experiences.filter((_, i) => i !== index),
      };
    });
  };

  const updateEducationRow = (index: number, patch: Partial<EducationEntry>) => {
    updateDraft((d) => {
      const education = d.education.map((e, i) =>
        i === index ? { ...e, ...patch } : e,
      );
      return { ...d, education };
    });
  };

  const addEducation = () => {
    updateDraft((d) => {
      if (d.education.length >= 5) return d;
      return { ...d, education: [...d.education, emptyEducation()] };
    });
  };

  const removeEducation = (index: number) => {
    updateDraft((d) => {
      if (d.education.length <= 1) return d;
      return {
        ...d,
        education: d.education.filter((_, i) => i !== index),
      };
    });
  };

  const stepMeta = step < RESUME_STEP_COUNT ? STEP_META[step] : null;

  return (
    <div className="relative flex min-h-full flex-1 flex-col overflow-hidden bg-background">
      <BuilderBackground />
      <BuilderHeader
        eyebrow={
          step < RESUME_STEP_COUNT && stepMeta
            ? stepMeta.eyebrow
            : "draft.complete"
        }
        title={
          step < RESUME_STEP_COUNT && stepMeta
            ? stepMeta.title
            : "You are ready for the next step"
        }
        subtitle={
          themeName
            ? `Theme: ${themeName}`
            : "Pick a theme if you have not yet"
        }
      />

      <div className="relative z-10 mx-auto w-full max-w-2xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
        {!hydrated ? (
          <div
            className="rounded-2xl border border-charcoal-border bg-charcoal-elevated/50 p-8 text-center text-sm text-foreground-muted"
            role="status"
            aria-live="polite"
          >
            Loading your saved progress…
          </div>
        ) : null}

        {hydrated && !draft.themeId ? (
          <div className="mb-6 rounded-xl border border-secondary/40 bg-secondary/10 px-4 py-3 text-sm text-foreground">
            <span className="font-medium text-secondary">Heads up: </span>
            Choose a resume theme first so exports match your style later.{" "}
            <Link
              href="/theme-selection"
              className="font-medium text-secondary underline-offset-2 hover:underline"
            >
              Go to theme selection
            </Link>
          </div>
        ) : null}

        {hydrated && step < RESUME_STEP_COUNT && stepMeta ? (
          <>
            <div className="mb-8">
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-foreground-muted">
                <span>
                  Step {step + 1} of {RESUME_STEP_COUNT}
                  {minutesLeft > 0 ? (
                    <span className="text-foreground-subtle">
                      {" "}
                      · ~{minutesLeft} min left in this section
                    </span>
                  ) : null}
                </span>
                <span className="font-mono text-secondary">{stepMeta.time}</span>
              </div>
              <div
                className="mt-2 h-1.5 overflow-hidden rounded-full bg-charcoal-border"
                role="progressbar"
                aria-valuenow={Math.round(progressPercent)}
                aria-valuemin={0}
                aria-valuemax={100}
              >
                <div
                  className="h-full rounded-full bg-gradient-to-r from-primary to-secondary transition-[width] duration-300 ease-out"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            <div className="rounded-2xl border border-charcoal-border bg-charcoal-elevated/35 p-6 shadow-lg backdrop-blur-sm sm:p-8">
              <p className="text-sm leading-relaxed text-foreground-muted">
                {stepMeta.hint}
              </p>
              <ul className="mt-4 space-y-1.5 text-xs text-foreground-subtle">
                {stepMeta.required.map((r) => (
                  <li key={r} className="flex gap-2">
                    <span className="font-mono text-secondary">✓</span>
                    <span>{r}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-8 space-y-6">
                {step === 0 ? (
                  <>
                    <div className="grid gap-5 sm:grid-cols-2">
                      <div className="sm:col-span-2">
                        <label className={labelClass} htmlFor="fullName">
                          Full name <span className="text-secondary">*</span>
                        </label>
                        <input
                          id="fullName"
                          className={inputClass}
                          value={draft.contact.fullName}
                          onChange={(e) =>
                            updateContact({ fullName: e.target.value })
                          }
                          autoComplete="name"
                          placeholder="Jordan Lee"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className={labelClass} htmlFor="professionalTitle">
                          Professional title{" "}
                          <span className="text-secondary">*</span>
                        </label>
                        <input
                          id="professionalTitle"
                          className={inputClass}
                          value={draft.contact.professionalTitle}
                          onChange={(e) =>
                            updateContact({ professionalTitle: e.target.value })
                          }
                          placeholder="Senior Software Engineer"
                        />
                      </div>
                      <div>
                        <label className={labelClass} htmlFor="email">
                          Email <span className="text-secondary">*</span>
                        </label>
                        <input
                          id="email"
                          type="email"
                          className={inputClass}
                          value={draft.contact.email}
                          onChange={(e) =>
                            updateContact({ email: e.target.value })
                          }
                          autoComplete="email"
                          placeholder="you@email.com"
                        />
                      </div>
                      <div>
                        <label className={labelClass} htmlFor="phone">
                          Phone <span className="text-foreground-subtle">(optional)</span>
                        </label>
                        <input
                          id="phone"
                          type="tel"
                          className={inputClass}
                          value={draft.contact.phone}
                          onChange={(e) =>
                            updateContact({ phone: e.target.value })
                          }
                          autoComplete="tel"
                          placeholder="+1 · optional"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className={labelClass} htmlFor="location">
                          City / region{" "}
                          <span className="text-foreground-subtle">(optional)</span>
                        </label>
                        <input
                          id="location"
                          className={inputClass}
                          value={draft.contact.location}
                          onChange={(e) =>
                            updateContact({ location: e.target.value })
                          }
                          placeholder="San Francisco, CA"
                        />
                      </div>
                      <div>
                        <label className={labelClass} htmlFor="linkedIn">
                          LinkedIn{" "}
                          <span className="text-foreground-subtle">(optional)</span>
                        </label>
                        <input
                          id="linkedIn"
                          className={inputClass}
                          value={draft.contact.linkedIn}
                          onChange={(e) =>
                            updateContact({ linkedIn: e.target.value })
                          }
                          placeholder="linkedin.com/in/…"
                        />
                      </div>
                      <div>
                        <label className={labelClass} htmlFor="website">
                          Portfolio / site{" "}
                          <span className="text-foreground-subtle">(optional)</span>
                        </label>
                        <input
                          id="website"
                          className={inputClass}
                          value={draft.contact.website}
                          onChange={(e) =>
                            updateContact({ website: e.target.value })
                          }
                          placeholder="https://"
                        />
                      </div>
                      <div>
                        <label className={labelClass} htmlFor="github">
                          GitHub link{" "}
                          <span className="text-foreground-subtle">(optional)</span>
                        </label>
                        <input
                          id="github"
                          className={inputClass}
                          value={draft.contact.github}
                          onChange={(e) =>
                            updateContact({ github: e.target.value })
                          }
                          placeholder="github.com/username"
                        />
                      </div>
                    </div>
                  </>
                ) : null}

                {step === 1 ? (
                  <div>
                    <label className={labelClass} htmlFor="summary">
                      Summary <span className="text-secondary">*</span>
                    </label>
                    <textarea
                      id="summary"
                      className={`${inputClass} min-h-[140px] resize-y`}
                      value={draft.summary}
                      onChange={(e) =>
                        updateDraft({ summary: e.target.value })
                      }
                      placeholder="Example: Product designer with 6+ years shipping B2B workflows. Led design systems used by 40+ engineers. Reduced task time 28% through research-backed iteration."
                    />
                    <p className="mt-2 text-xs text-foreground-subtle">
                      {draft.summary.trim().length}/40 characters minimum
                    </p>
                  </div>
                ) : null}

                {step === 2 ? (
                  <div className="space-y-8">
                    <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-charcoal-border bg-charcoal/30 p-4">
                      <input
                        type="checkbox"
                        className="mt-1 rounded border-charcoal-border text-primary focus:ring-secondary"
                        checked={draft.experienceSkipped}
                        onChange={(e) =>
                          updateDraft({ experienceSkipped: e.target.checked })
                        }
                      />
                      <span>
                        <span className="block text-sm font-medium text-foreground">
                          Skip experience for now
                        </span>
                        <span className="mt-1 block text-xs text-foreground-muted">
                          Use this if you have no formal work experience yet.
                        </span>
                      </span>
                    </label>

                    {!draft.experienceSkipped && (
                      <>
                        {draft.experiences.map((exp, index) => (
                          <div
                            key={exp.id}
                            className="rounded-xl border border-charcoal-border/80 bg-charcoal/40 p-4 sm:p-5"
                          >
                            <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                              <p className="font-mono text-xs text-secondary">
                                role_{index + 1}
                                {index === 0 ? " · primary" : ""}
                              </p>
                              {draft.experiences.length > 1 ? (
                                <button
                                  type="button"
                                  onClick={() => removeExperience(index)}
                                  className="text-xs font-medium text-foreground-muted hover:text-foreground"
                                >
                                  Remove
                                </button>
                              ) : null}
                            </div>
                            <div className="grid gap-4 sm:grid-cols-2">
                              <div className="sm:col-span-2">
                                <label className={labelClass}>Company</label>
                                <input
                                  className={inputClass}
                                  value={exp.company}
                                  onChange={(e) =>
                                    updateExperience(index, {
                                      company: e.target.value,
                                    })
                                  }
                                  placeholder="Acme Corp"
                                />
                              </div>
                              <div className="sm:col-span-2">
                                <label className={labelClass}>Job title</label>
                                <input
                                  className={inputClass}
                                  value={exp.role}
                                  onChange={(e) =>
                                    updateExperience(index, { role: e.target.value })
                                  }
                                  placeholder="Engineering Lead"
                                />
                              </div>
                              <div>
                                <label className={labelClass}>Start</label>
                                <input
                                  className={inputClass}
                                  value={exp.startDate}
                                  onChange={(e) =>
                                    updateExperience(index, {
                                      startDate: e.target.value,
                                    })
                                  }
                                  placeholder="Jan 2022"
                                />
                              </div>
                              <div>
                                <label className={labelClass}>End</label>
                                <input
                                  className={inputClass}
                                  disabled={exp.current}
                                  value={exp.endDate}
                                  onChange={(e) =>
                                    updateExperience(index, {
                                      endDate: e.target.value,
                                    })
                                  }
                                  placeholder="Present"
                                />
                                <label className="mt-2 flex cursor-pointer items-center gap-2 text-xs text-foreground-muted">
                                  <input
                                    type="checkbox"
                                    className="rounded border-charcoal-border text-primary focus:ring-secondary"
                                    checked={exp.current}
                                    onChange={(e) =>
                                      updateExperience(index, {
                                        current: e.target.checked,
                                        endDate: e.target.checked
                                          ? ""
                                          : exp.endDate,
                                      })
                                    }
                                  />
                                  I currently work here
                                </label>
                              </div>
                              <div className="sm:col-span-2">
                                <label className={labelClass}>
                                  Impact bullets (one per line)
                                </label>
                                <textarea
                                  className={`${inputClass} min-h-[120px] resize-y font-mono text-xs leading-relaxed sm:text-sm`}
                                  value={exp.bullets}
                                  onChange={(e) =>
                                    updateExperience(index, {
                                      bullets: e.target.value,
                                    })
                                  }
                                  placeholder={"Cut deploy time 35% by introducing CI templates\nMentored 4 engineers through promo cycles"}
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                        {draft.experiences.length < 3 ? (
                          <button
                            type="button"
                            onClick={addExperience}
                            className="w-full rounded-lg border border-dashed border-charcoal-border py-3 text-sm font-medium text-foreground-muted transition-colors hover:border-secondary/50 hover:text-secondary"
                          >
                            + Add another role (optional)
                          </button>
                        ) : null}
                      </>
                    )}
                  </div>
                ) : null}

                {step === 3 ? (
                  <div className="space-y-5">
                    <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-charcoal-border bg-charcoal/30 p-4">
                      <input
                        type="checkbox"
                        className="mt-1 rounded border-charcoal-border text-primary focus:ring-secondary"
                        checked={draft.educationSkipped}
                        onChange={(e) =>
                          updateDraft({ educationSkipped: e.target.checked })
                        }
                      />
                      <span>
                        <span className="block text-sm font-medium text-foreground">
                          Skip education for now
                        </span>
                        <span className="mt-1 block text-xs text-foreground-muted">
                          Use this if you are still studying or prefer to add
                          degrees later.
                        </span>
                      </span>
                    </label>
                    {!draft.educationSkipped ? (
                      <div className="space-y-6">
                        {draft.education.map((edu, eduIndex) => (
                          <div
                            key={edu.id}
                            className="rounded-xl border border-charcoal-border/80 bg-charcoal/25 p-4"
                          >
                            <div className="mb-3 flex items-center justify-between gap-2">
                              <span className="font-mono text-[11px] text-secondary">
                                education_{eduIndex + 1}
                              </span>
                              {draft.education.length > 1 ? (
                                <button
                                  type="button"
                                  onClick={() => removeEducation(eduIndex)}
                                  className="text-xs text-foreground-muted hover:text-foreground"
                                >
                                  Remove
                                </button>
                              ) : null}
                            </div>
                            <div className="grid gap-4 sm:grid-cols-2">
                              <div className="sm:col-span-2">
                                <label className={labelClass}>School</label>
                                <input
                                  className={inputClass}
                                  value={edu.school}
                                  onChange={(e) =>
                                    updateEducationRow(eduIndex, {
                                      school: e.target.value,
                                    })
                                  }
                                  placeholder="State University"
                                />
                              </div>
                              <div className="sm:col-span-2">
                                <label className={labelClass}>
                                  Degree & field
                                </label>
                                <input
                                  className={inputClass}
                                  value={edu.degree}
                                  onChange={(e) =>
                                    updateEducationRow(eduIndex, {
                                      degree: e.target.value,
                                    })
                                  }
                                  placeholder="B.S. Computer Science"
                                />
                              </div>
                              <div className="sm:col-span-2">
                                <label className={labelClass}>
                                  Graduation year{" "}
                                  <span className="text-foreground-subtle">
                                    (optional)
                                  </span>
                                </label>
                                <input
                                  className={inputClass}
                                  value={edu.year}
                                  onChange={(e) =>
                                    updateEducationRow(eduIndex, {
                                      year: e.target.value,
                                    })
                                  }
                                  placeholder="2021"
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                        {draft.education.length < 5 ? (
                          <button
                            type="button"
                            onClick={addEducation}
                            className="w-full rounded-lg border border-dashed border-charcoal-border py-3 text-sm font-medium text-foreground-muted transition-colors hover:border-secondary/50 hover:text-secondary"
                          >
                            + Add another school
                          </button>
                        ) : null}
                      </div>
                    ) : null}
                  </div>
                ) : null}

                {step === 4 ? (
                  <div>
                    <label className={labelClass} htmlFor="skills">
                      Skills <span className="text-secondary">*</span>
                    </label>
                    <textarea
                      id="skills"
                      className={`${inputClass} min-h-[100px] resize-y`}
                      value={draft.skills}
                      onChange={(e) =>
                        updateDraft({ skills: e.target.value })
                      }
                      placeholder="TypeScript, stakeholder workshops, system design, SQL, Figma, team leadership"
                    />
                    <p className="mt-2 text-xs text-foreground-subtle">
                      Separate with commas. Aim for a focused mix of tools and
                      strengths—quality beats quantity.
                    </p>
                  </div>
                ) : null}

                {step === 5 ? (
                  <div>
                    <label className={labelClass} htmlFor="languages">
                      Languages{" "}
                      <span className="text-foreground-subtle">(optional)</span>
                    </label>
                    <textarea
                      id="languages"
                      className={`${inputClass} min-h-[100px] resize-y`}
                      value={draft.languages}
                      onChange={(e) =>
                        updateDraft({ languages: e.target.value })
                      }
                      placeholder="English (Native), Spanish (Professional), German (Elementary)"
                    />
                    <p className="mt-2 text-xs text-foreground-subtle">
                      List the languages you are proficient in. Example: English
                      (Native), Spanish (Fluent).
                    </p>
                  </div>
                ) : null}
              </div>

              {error ? (
                <p
                  className="mt-6 rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-200"
                  role="alert"
                >
                  {error}
                </p>
              ) : null}

              <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
                <button
                  type="button"
                  onClick={goBack}
                  disabled={step <= 0}
                  className="rounded-lg border border-charcoal-border px-5 py-2.5 text-sm font-medium text-foreground-muted transition-colors hover:border-secondary/40 hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={goNext}
                  className="rounded-lg bg-secondary px-6 py-2.5 text-sm font-semibold text-charcoal shadow-[0_0_24px_var(--secondary-glow)] transition-colors hover:bg-secondary-hover"
                >
                  {step === RESUME_STEP_COUNT - 1
                    ? "Finish & review"
                    : "Save & continue"}
                </button>
              </div>
            </div>
          </>
        ) : null}

        {hydrated && step >= RESUME_STEP_COUNT ? (
          <div className="rounded-2xl border border-charcoal-border bg-charcoal-elevated/35 p-6 shadow-lg backdrop-blur-sm sm:p-8">
            <p className="font-mono text-xs text-secondary">checkpoint.reached</p>
            <h2 className="mt-2 text-xl font-semibold text-foreground sm:text-2xl">
              Draft saved on this device
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-foreground-muted">
              Your answers stay in local storage—close the tab or refresh and you
              will pick up where you left off. Open the preview to edit live and
              export your PDF.
            </p>
            <ul className="mt-6 space-y-2 text-sm text-foreground-muted">
              <li className="flex gap-2">
                <span className="text-secondary">✓</span>
                Theme:{" "}
                <span className="text-foreground">
                  {themeName ?? "Not set — choose one in theme selection"}
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-secondary">✓</span>
                Contact & summary captured
              </li>
              <li className="flex gap-2">
                <span className="text-secondary">✓</span>
                {draft.experienceSkipped
                  ? "Experience skipped"
                  : `${draft.experiences.length} role${draft.experiences.length === 1 ? "" : "s"
                  }`}
              </li>
              <li className="flex gap-2">
                <span className="text-secondary">✓</span>
                {draft.educationSkipped
                  ? "Education skipped"
                  : "Education on file"}
              </li>
              <li className="flex gap-2">
                <span className="text-secondary">✓</span>
                {parseSkillTokens(draft.skills).length} skills listed
              </li>
              {draft.languages.trim() && (
                <li className="flex gap-2">
                  <span className="text-secondary">✓</span>
                  Languages added
                </li>
              )}
            </ul>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link
                href="/resume-preview"
                className="inline-flex items-center justify-center rounded-lg bg-secondary px-5 py-2.5 text-sm font-semibold text-charcoal shadow-[0_0_24px_var(--secondary-glow)] transition-colors hover:bg-secondary-hover"
              >
                Preview & export PDF
              </Link>
              <button
                type="button"
                onClick={() => persistStep(0)}
                className="rounded-lg border border-charcoal-border px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:border-secondary/40"
              >
                Edit in wizard
              </button>
              <Link
                href="/theme-selection"
                className="inline-flex items-center justify-center rounded-lg border border-charcoal-border px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:border-secondary/40"
              >
                Change theme
              </Link>
              <button
                type="button"
                onClick={() => {
                  if (
                    typeof window !== "undefined" &&
                    window.confirm(
                      "Clear all resume data on this device? This cannot be undone.",
                    )
                  ) {
                    resetDraft();
                    setError(null);
                  }
                }}
                className="rounded-lg px-5 py-2.5 text-sm font-medium text-red-300/90 hover:text-red-200"
              >
                Start over
              </button>
            </div>
          </div>
        ) : null}

        {hydrated ? (
          <p className="mt-8 text-center font-mono text-[10px] uppercase tracking-widest text-foreground-subtle">
            autosave · local only · no account
          </p>
        ) : null}
      </div>
    </div>
  );
}

"use client";

import { pdf, PDFViewer } from "@react-pdf/renderer";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { BuilderBackground } from "@/components/builder-background";
import { BuilderHeader } from "@/components/builder-header";
import { ResumePdfDocument } from "@/components/resume-pdf-document";
import { useResumeDraft } from "@/hooks/use-resume-draft";
import {
  emptyEducation,
  emptyExperience,
  type ContactBlock,
  type EducationEntry,
  type ExperienceEntry,
} from "@/lib/resume-draft";
import { RESUME_THEMES } from "@/lib/resume-themes";
import { slugifyFilename } from "@/lib/slugify-filename";

const inputClass =
  "w-full rounded-lg border border-charcoal-border bg-charcoal-elevated/70 px-3 py-2.5 text-sm text-foreground placeholder:text-foreground-subtle shadow-sm transition-colors focus:border-secondary focus:outline-none focus:ring-1 focus:ring-secondary";

const labelClass = "mb-1.5 block text-xs font-medium text-foreground-muted";

const sectionCard =
  "rounded-xl border border-charcoal-border bg-charcoal-elevated/35 p-5 backdrop-blur-sm";

const PREVIEW_DEBOUNCE_MS = 380;

export function ResumePreviewWorkspace() {
  const { draft, updateDraft, hydrated } = useResumeDraft();
  const [previewDraft, setPreviewDraft] = useState(draft);
  const draftRef = useRef(draft);
  draftRef.current = draft;

  useEffect(() => {
    if (hydrated) {
      setPreviewDraft(draftRef.current);
    }
  }, [hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    const t = window.setTimeout(() => {
      setPreviewDraft(draftRef.current);
    }, PREVIEW_DEBOUNCE_MS);
    return () => window.clearTimeout(t);
  }, [draft, hydrated]);

  const [exporting, setExporting] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);

  const themeLabel =
    draft.themeId &&
    RESUME_THEMES.find((x) => x.id === draft.themeId)?.name;

  const updateContact = useCallback(
    (patch: Partial<ContactBlock>) => {
      updateDraft((d) => ({
        ...d,
        contact: { ...d.contact, ...patch },
      }));
    },
    [updateDraft],
  );

  const updateExperience = useCallback(
    (index: number, patch: Partial<ExperienceEntry>) => {
      updateDraft((d) => ({
        ...d,
        experiences: d.experiences.map((e, i) =>
          i === index ? { ...e, ...patch } : e,
        ),
      }));
    },
    [updateDraft],
  );

  const addExperience = useCallback(() => {
    updateDraft((d) => {
      if (d.experiences.length >= 3) return d;
      return { ...d, experiences: [...d.experiences, emptyExperience()] };
    });
  }, [updateDraft]);

  const removeExperience = useCallback(
    (index: number) => {
      updateDraft((d) => {
        if (d.experiences.length <= 1) return d;
        return {
          ...d,
          experiences: d.experiences.filter((_, i) => i !== index),
        };
      });
    },
    [updateDraft],
  );

  const updateEducationRow = useCallback(
    (index: number, patch: Partial<EducationEntry>) => {
      updateDraft((d) => ({
        ...d,
        education: d.education.map((e, i) =>
          i === index ? { ...e, ...patch } : e,
        ),
      }));
    },
    [updateDraft],
  );

  const addEducation = useCallback(() => {
    updateDraft((d) => {
      if (d.education.length >= 5) return d;
      return { ...d, education: [...d.education, emptyEducation()] };
    });
  }, [updateDraft]);

  const removeEducation = useCallback(
    (index: number) => {
      updateDraft((d) => {
        if (d.education.length <= 1) return d;
        return {
          ...d,
          education: d.education.filter((_, i) => i !== index),
        };
      });
    },
    [updateDraft],
  );

  const handleExport = useCallback(async () => {
    setExportError(null);
    setExporting(true);
    try {
      const current = draftRef.current;
      const blob = await pdf(<ResumePdfDocument draft={current} />).toBlob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${slugifyFilename(current.contact.fullName)}-resume.pdf`;
      a.rel = "noopener";
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      setExportError("Could not generate the PDF. Try again or use another browser.");
    } finally {
      setExporting(false);
    }
  }, []);

  return (
    <div className="relative flex min-h-full flex-1 flex-col overflow-hidden bg-background">
      <BuilderBackground />
      <BuilderHeader
        eyebrow="preview.live"
        title="Live preview & PDF export"
        subtitle={
          themeLabel
            ? `${themeLabel} — PDF layout matches this design`
            : "Choose a theme on the theme page for layout & accents"
        }
      />

      <div className="relative z-10 mx-auto flex w-full max-w-[1600px] flex-1 flex-col gap-6 px-4 py-6 lg:flex-row lg:gap-8 lg:px-6 lg:py-8">
        <aside className="flex w-full flex-col lg:max-w-md lg:shrink-0 xl:max-w-lg">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={handleExport}
                disabled={!hydrated || exporting}
                className="inline-flex items-center justify-center rounded-lg bg-secondary px-4 py-2.5 text-sm font-semibold text-charcoal shadow-[0_0_20px_var(--secondary-glow)] transition-colors hover:bg-secondary-hover disabled:cursor-not-allowed disabled:opacity-50"
              >
                {exporting ? "Generating…" : "Download PDF"}
              </button>
              <Link
                href="/resume-creation"
                className="inline-flex items-center justify-center rounded-lg border border-charcoal-border px-4 py-2.5 text-sm font-medium text-foreground-muted transition-colors hover:border-secondary/40 hover:text-foreground"
              >
                Wizard steps
              </Link>
              <Link
                href="/theme-selection"
                className="inline-flex items-center justify-center rounded-lg border border-charcoal-border px-4 py-2.5 text-sm font-medium text-foreground-muted transition-colors hover:border-secondary/40 hover:text-foreground"
              >
                Theme
              </Link>
            </div>
          </div>

          {!draft.themeId ? (
            <p className="mb-4 rounded-lg border border-amber-500/35 bg-amber-500/10 px-3 py-2 text-sm text-amber-100">
              No theme selected yet —{" "}
              <Link
                href="/theme-selection"
                className="font-medium text-secondary underline-offset-2 hover:underline"
              >
                pick one
              </Link>{" "}
              so accent rules match your design.
            </p>
          ) : null}

          {exportError ? (
            <p
              className="mb-4 rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-200"
              role="alert"
            >
              {exportError}
            </p>
          ) : null}

          {!hydrated ? (
            <p className="text-sm text-foreground-muted" role="status">
              Loading editor…
            </p>
          ) : (
            <div className="flex max-h-[min(52vh,560px)] flex-col gap-5 overflow-y-auto pr-1 lg:max-h-[calc(100vh-7.5rem)]">
              <section className={sectionCard}>
                <h2 className="text-sm font-semibold text-foreground">
                  Contact & headline
                </h2>
                <p className="mt-1 text-xs text-foreground-muted">
                  Edits save automatically. The PDF uses a single-column flow for
                  reliable ATS parsing.
                </p>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label className={labelClass} htmlFor="pv-fullName">
                      Full name
                    </label>
                    <input
                      id="pv-fullName"
                      className={inputClass}
                      value={draft.contact.fullName}
                      onChange={(e) =>
                        updateContact({ fullName: e.target.value })
                      }
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className={labelClass} htmlFor="pv-title">
                      Professional title
                    </label>
                    <input
                      id="pv-title"
                      className={inputClass}
                      value={draft.contact.professionalTitle}
                      onChange={(e) =>
                        updateContact({ professionalTitle: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className={labelClass} htmlFor="pv-email">
                      Email
                    </label>
                    <input
                      id="pv-email"
                      type="email"
                      className={inputClass}
                      value={draft.contact.email}
                      onChange={(e) =>
                        updateContact({ email: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className={labelClass} htmlFor="pv-phone">
                      Phone
                    </label>
                    <input
                      id="pv-phone"
                      type="tel"
                      className={inputClass}
                      value={draft.contact.phone}
                      onChange={(e) =>
                        updateContact({ phone: e.target.value })
                      }
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className={labelClass} htmlFor="pv-location">
                      Location
                    </label>
                    <input
                      id="pv-location"
                      className={inputClass}
                      value={draft.contact.location}
                      onChange={(e) =>
                        updateContact({ location: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className={labelClass} htmlFor="pv-li">
                      LinkedIn
                    </label>
                    <input
                      id="pv-li"
                      className={inputClass}
                      value={draft.contact.linkedIn}
                      onChange={(e) =>
                        updateContact({ linkedIn: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className={labelClass} htmlFor="pv-web">
                      Website
                    </label>
                    <input
                      id="pv-web"
                      className={inputClass}
                      value={draft.contact.website}
                      onChange={(e) =>
                        updateContact({ website: e.target.value })
                      }
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className={labelClass} htmlFor="pv-github">
                      GitHub
                    </label>
                    <input
                      id="pv-github"
                      className={inputClass}
                      value={draft.contact.github}
                      onChange={(e) =>
                        updateContact({ github: e.target.value })
                      }
                    />
                  </div>
                </div>
              </section>

              <section className={sectionCard}>
                <h2 className="text-sm font-semibold text-foreground">
                  Professional summary
                </h2>
                <textarea
                  className={`${inputClass} mt-3 min-h-[120px] resize-y`}
                  value={draft.summary}
                  onChange={(e) => updateDraft({ summary: e.target.value })}
                />
              </section>

              <section className={sectionCard}>
                <h2 className="text-sm font-semibold text-foreground">
                  Experience
                </h2>
                <label className="mt-3 flex cursor-pointer items-start gap-3 rounded-lg border border-charcoal-border/60 bg-charcoal/20 p-3">
                  <input
                    type="checkbox"
                    className="mt-0.5 rounded border-charcoal-border text-primary focus:ring-secondary"
                    checked={draft.experienceSkipped}
                    onChange={(e) =>
                      updateDraft({ experienceSkipped: e.target.checked })
                    }
                  />
                  <span className="text-sm text-foreground-muted">
                    Skip experience on the PDF
                  </span>
                </label>
                {!draft.experienceSkipped ? (
                  <div className="mt-4 space-y-6">
                    {draft.experiences.map((exp, index) => (
                      <div
                        key={exp.id}
                        className="rounded-lg border border-charcoal-border/70 bg-charcoal/25 p-4"
                      >
                        <div className="mb-3 flex items-center justify-between gap-2">
                          <span className="font-mono text-[10px] text-secondary">
                            role_{index + 1}
                          </span>
                          {draft.experiences.length > 1 ? (
                            <button
                              type="button"
                              onClick={() => removeExperience(index)}
                              className="text-xs text-foreground-muted hover:text-foreground"
                            >
                              Remove
                            </button>
                          ) : null}
                        </div>
                        <div className="grid gap-3 sm:grid-cols-2">
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
                            />
                            <label className="mt-2 flex items-center gap-2 text-xs text-foreground-muted">
                              <input
                                type="checkbox"
                                className="rounded border-charcoal-border text-primary focus:ring-secondary"
                                checked={exp.current}
                                onChange={(e) =>
                                  updateExperience(index, {
                                    current: e.target.checked,
                                    endDate: e.target.checked ? "" : exp.endDate,
                                  })
                                }
                              />
                              Current role
                            </label>
                          </div>
                          <div className="sm:col-span-2">
                            <label className={labelClass}>
                              Bullets (one per line)
                            </label>
                            <textarea
                              className={`${inputClass} min-h-[100px] resize-y font-mono text-xs`}
                              value={exp.bullets}
                              onChange={(e) =>
                                updateExperience(index, {
                                  bullets: e.target.value,
                                })
                              }
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                    {draft.experiences.length < 3 ? (
                      <button
                        type="button"
                        onClick={addExperience}
                        className="w-full rounded-lg border border-dashed border-charcoal-border py-2.5 text-sm text-foreground-muted hover:border-secondary/40 hover:text-secondary"
                      >
                        + Add role
                      </button>
                    ) : null}
                  </div>
                ) : null}
              </section>

              <section className={sectionCard}>
                <h2 className="text-sm font-semibold text-foreground">
                  Education
                </h2>
                <label className="mt-3 flex cursor-pointer items-start gap-3 rounded-lg border border-charcoal-border/60 bg-charcoal/20 p-3">
                  <input
                    type="checkbox"
                    className="mt-0.5 rounded border-charcoal-border text-primary focus:ring-secondary"
                    checked={draft.educationSkipped}
                    onChange={(e) =>
                      updateDraft({ educationSkipped: e.target.checked })
                    }
                  />
                  <span className="text-sm text-foreground-muted">
                    Skip education on the PDF
                  </span>
                </label>
                {!draft.educationSkipped ? (
                  <div className="mt-4 space-y-5">
                    {draft.education.map((edu, eduIndex) => (
                      <div
                        key={edu.id}
                        className="rounded-lg border border-charcoal-border/70 bg-charcoal/20 p-4"
                      >
                        <div className="mb-2 flex items-center justify-between">
                          <span className="font-mono text-[10px] text-secondary">
                            school_{eduIndex + 1}
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
                        <div className="grid gap-3">
                          <div>
                            <label className={labelClass}>School</label>
                            <input
                              className={inputClass}
                              value={edu.school}
                              onChange={(e) =>
                                updateEducationRow(eduIndex, {
                                  school: e.target.value,
                                })
                              }
                            />
                          </div>
                          <div>
                            <label className={labelClass}>Degree</label>
                            <input
                              className={inputClass}
                              value={edu.degree}
                              onChange={(e) =>
                                updateEducationRow(eduIndex, {
                                  degree: e.target.value,
                                })
                              }
                            />
                          </div>
                          <div>
                            <label className={labelClass}>Year</label>
                            <input
                              className={inputClass}
                              value={edu.year}
                              onChange={(e) =>
                                updateEducationRow(eduIndex, {
                                  year: e.target.value,
                                })
                              }
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                    {draft.education.length < 5 ? (
                      <button
                        type="button"
                        onClick={addEducation}
                        className="w-full rounded-lg border border-dashed border-charcoal-border py-2.5 text-sm text-foreground-muted hover:border-secondary/40 hover:text-secondary"
                      >
                        + Add school
                      </button>
                    ) : null}
                  </div>
                ) : null}
              </section>

              <section className={sectionCard}>
                <h2 className="text-sm font-semibold text-foreground">
                  Skills
                </h2>
                <textarea
                  className={`${inputClass} mt-3 min-h-[88px] resize-y`}
                  value={draft.skills}
                  onChange={(e) => updateDraft({ skills: e.target.value })}
                  placeholder="Comma-separated skills"
                />
              </section>

              <section className={sectionCard}>
                <h2 className="text-sm font-semibold text-foreground">
                  Languages
                </h2>
                <p className="mt-1 text-xs text-foreground-muted">
                  Comma- or line-separated. Example: English (Native), Spanish (Fluent)
                </p>
                <textarea
                  className={`${inputClass} mt-3 min-h-[72px] resize-y`}
                  value={draft.languages}
                  onChange={(e) => updateDraft({ languages: e.target.value })}
                  placeholder="English (Native), Spanish (Professional)"
                />
              </section>

              <p className="pb-4 font-mono text-[10px] uppercase tracking-widest text-foreground-subtle">
                edits autosave · export matches preview (after debounce)
              </p>
            </div>
          )}
        </aside>

        <div className="flex min-h-[min(480px,55vh)] flex-1 flex-col lg:min-h-[calc(100vh-7.5rem)]">
          <div className="mb-2 flex items-center justify-between gap-2">
            <p className="text-xs text-foreground-muted">
              Preview updates shortly after you type. PDF uses standard Helvetica
              and clear section headings for ATS tools.
            </p>
          </div>
          <div className="relative flex min-h-0 flex-1 overflow-hidden rounded-xl border border-charcoal-border bg-charcoal-elevated/40 shadow-inner">
            {hydrated ? (
              <PDFViewer
                width="100%"
                height="100%"
                showToolbar={false}
                className="min-h-[min(480px,55vh)] w-full border-0 lg:min-h-0"
              >
                <ResumePdfDocument draft={previewDraft} />
              </PDFViewer>
            ) : (
              <div className="flex flex-1 items-center justify-center text-sm text-foreground-muted">
                Preparing viewer…
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

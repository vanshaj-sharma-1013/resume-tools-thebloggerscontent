"use client";

import { pdf, PDFViewer } from "@react-pdf/renderer";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { BuilderBackground } from "@/components/builder-background";
import { BuilderHeader } from "@/components/builder-header";
import { CoverLetterPdfDocument } from "@/components/cover-letter-pdf-document";
import { useCoverLetterDraft } from "@/hooks/use-cover-letter-draft";
import { COVER_LETTER_THEMES } from "@/lib/cover-letter-themes";
import { slugifyFilename } from "@/lib/slugify-filename";

const inputClass =
  "w-full rounded-lg border border-charcoal-border bg-charcoal-elevated/70 px-3 py-2.5 text-sm text-foreground placeholder:text-foreground-subtle shadow-sm transition-colors focus:border-secondary focus:outline-none focus:ring-1 focus:ring-secondary";

const labelClass = "mb-1.5 block text-xs font-medium text-foreground-muted";

const sectionCard =
  "rounded-xl border border-charcoal-border bg-charcoal-elevated/35 p-5 backdrop-blur-sm";

const PREVIEW_DEBOUNCE_MS = 380;

export function CoverLetterMakerClient() {
  const { draft, updateDraft, hydrated } = useCoverLetterDraft();
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
    COVER_LETTER_THEMES.find((x) => x.id === draft.themeId)?.name;

  const handleExport = useCallback(async () => {
    setExportError(null);
    setExporting(true);
    try {
      const current = draftRef.current;
      const blob = await pdf(<CoverLetterPdfDocument draft={current} />).toBlob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${slugifyFilename(current.contact.fullName)}-cover-letter.pdf`;
      a.rel = "noopener";
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      setExportError("Could not generate the PDF. Try again or use another browser.");
    } finally {
      setExporting(false);
    }
  }, []);

  return (
    <div className="relative flex min-h-full flex-1 flex-col overflow-hidden bg-background">
      <BuilderBackground />
      <BuilderHeader
        eyebrow="editor.live"
        title="Cover Letter Editor"
        subtitle={
          themeLabel
            ? `${themeLabel} — Real-time preview & export`
            : "Choose a theme to match your resume style"
        }
      />

      <div className="relative z-10 mx-auto flex w-full max-w-[1600px] flex-1 flex-col gap-6 px-4 py-6 lg:flex-row lg:gap-8 lg:px-6 lg:py-8">
        <aside className="flex w-full flex-col lg:max-w-md lg:shrink-0 xl:max-w-lg">
          <div className="mb-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={handleExport}
              disabled={!hydrated || exporting}
              className="inline-flex items-center justify-center rounded-lg bg-secondary px-4 py-2.5 text-sm font-semibold text-charcoal shadow-[0_0_20px_var(--secondary-glow)] transition-colors hover:bg-secondary-hover disabled:cursor-not-allowed disabled:opacity-50"
            >
              {exporting ? "Generating…" : "Download PDF"}
            </button>
            <Link
              href="/cover-letter-themes"
              className="inline-flex items-center justify-center rounded-lg border border-charcoal-border px-4 py-2.5 text-sm font-medium text-foreground-muted transition-colors hover:border-secondary/40 hover:text-foreground"
            >
              Change Theme
            </Link>
            <Link
              href="/blogs/guides/how-to-use-cover-letter-maker"
              className="inline-flex items-center justify-center rounded-lg border border-charcoal-border px-4 py-2.5 text-sm font-medium text-foreground-muted transition-colors hover:border-secondary/40 hover:text-foreground"
            >
              Help & Guide
            </Link>
            <Link
              href="/resume-maker"
              className="inline-flex items-center justify-center rounded-lg border border-charcoal-border px-4 py-2.5 text-sm font-medium text-foreground-muted transition-colors hover:border-secondary/40 hover:text-foreground"
            >
              Resume
            </Link>
          </div>

          {!hydrated ? (
            <p className="text-sm text-foreground-muted" role="status">
              Loading editor…
            </p>
          ) : (
            <div className="flex max-h-[min(52vh,560px)] flex-col gap-5 overflow-y-auto pr-1 lg:max-h-[calc(100vh-7.5rem)]">
              {/* Contact Info */}
              <section className={sectionCard}>
                <h2 className="text-sm font-semibold text-foreground">Your Contact Info</h2>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label className={labelClass}>Full Name</label>
                    <input
                      className={inputClass}
                      value={draft.contact.fullName}
                      onChange={(e) => updateDraft({ contact: { ...draft.contact, fullName: e.target.value } })}
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className={labelClass}>Professional Title</label>
                    <input
                      className={inputClass}
                      value={draft.contact.professionalTitle}
                      onChange={(e) => updateDraft({ contact: { ...draft.contact, professionalTitle: e.target.value } })}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Email</label>
                    <input
                      className={inputClass}
                      value={draft.contact.email}
                      onChange={(e) => updateDraft({ contact: { ...draft.contact, email: e.target.value } })}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Phone</label>
                    <input
                      className={inputClass}
                      value={draft.contact.phone}
                      onChange={(e) => updateDraft({ contact: { ...draft.contact, phone: e.target.value } })}
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className={labelClass}>Location</label>
                    <input
                      className={inputClass}
                      value={draft.contact.location}
                      onChange={(e) => updateDraft({ contact: { ...draft.contact, location: e.target.value } })}
                    />
                  </div>
                </div>
              </section>

              {/* Recipient Info */}
              <section className={sectionCard}>
                <h2 className="text-sm font-semibold text-foreground">Recipient Details</h2>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label className={labelClass}>Hiring Manager / Name</label>
                    <input
                      className={inputClass}
                      value={draft.recipient.name}
                      onChange={(e) => updateDraft({ recipient: { ...draft.recipient, name: e.target.value } })}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Company</label>
                    <input
                      className={inputClass}
                      value={draft.recipient.company}
                      onChange={(e) => updateDraft({ recipient: { ...draft.recipient, company: e.target.value } })}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Role Applied For</label>
                    <input
                      className={inputClass}
                      value={draft.recipient.role}
                      onChange={(e) => updateDraft({ recipient: { ...draft.recipient, role: e.target.value } })}
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className={labelClass}>Company Address (Optional)</label>
                    <input
                      className={inputClass}
                      value={draft.recipient.address}
                      onChange={(e) => updateDraft({ recipient: { ...draft.recipient, address: e.target.value } })}
                    />
                  </div>
                </div>
              </section>

              {/* Letter Content */}
              <section className={sectionCard}>
                <h2 className="text-sm font-semibold text-foreground">Letter Content</h2>
                <div className="mt-4 space-y-4">
                  <div>
                    <label className={labelClass}>Date</label>
                    <input
                      className={inputClass}
                      value={draft.date}
                      onChange={(e) => updateDraft({ date: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Subject Line</label>
                    <input
                      className={inputClass}
                      value={draft.subject}
                      onChange={(e) => updateDraft({ subject: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Body</label>
                    <textarea
                      className={`${inputClass} min-h-[300px] resize-y`}
                      value={draft.body}
                      onChange={(e) => updateDraft({ body: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Sign-off</label>
                    <input
                      className={inputClass}
                      value={draft.signOff}
                      onChange={(e) => updateDraft({ signOff: e.target.value })}
                    />
                  </div>
                </div>
              </section>

              <p className="pb-4 font-mono text-[10px] uppercase tracking-widest text-foreground-subtle">
                edits autosave · export matches preview
              </p>
            </div>
          )}
        </aside>

        <div className="flex min-h-[min(480px,55vh)] flex-1 flex-col lg:min-h-[calc(100vh-7.5rem)]">
          <div className="mb-2 flex items-center justify-between gap-2">
            <p className="text-xs text-foreground-muted">
              Live preview updates as you type. Choose a theme to match your resume.
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
                <CoverLetterPdfDocument draft={previewDraft} />
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

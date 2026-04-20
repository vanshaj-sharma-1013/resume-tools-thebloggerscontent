import type { ResumeDraft } from "@/lib/resume-draft";
import { displayUrl, withHttp } from "@/lib/resume-pdf/contact-url";
import { parseBulletLines, parseSkillTokens } from "@/lib/resume-text";

export function formatDateRange(
  start: string,
  end: string,
  current: boolean,
): string {
  const s = start.trim();
  const e = current ? "Present" : end.trim();
  if (!s && !e) return "";
  if (!s) return e;
  if (!e) return s;
  return `${s} — ${e}`;
}

export function experienceHasBody(
  exp: ResumeDraft["experiences"][number],
): boolean {
  return (
    Boolean(exp.company.trim()) ||
    Boolean(exp.role.trim()) ||
    parseBulletLines(exp.bullets).length > 0
  );
}

export function experienceRows(draft: ResumeDraft) {
  if (draft.experienceSkipped) return [];
  return draft.experiences.filter(experienceHasBody);
}

export function educationRows(draft: ResumeDraft) {
  if (draft.educationSkipped) return [];
  return draft.education.filter(
    (e) => e.school.trim() || e.degree.trim() || e.year.trim(),
  );
}

export type ContactChunk =
  | { kind: "mailto"; label: string; href: string }
  | { kind: "link"; label: string; href: string }
  | { kind: "text"; label: string };

export function buildContactChunks(
  contact: ResumeDraft["contact"],
): ContactChunk[] {
  const chunks: ContactChunk[] = [];
  const email = contact.email.trim();
  const phone = contact.phone.trim();
  const location = contact.location.trim();
  const li = contact.linkedIn.trim();
  const web = contact.website.trim();
  const gh = contact.github.trim();

  if (email) {
    chunks.push({ kind: "mailto", label: email, href: `mailto:${email}` });
  }
  if (phone) chunks.push({ kind: "text", label: phone });
  if (location) chunks.push({ kind: "text", label: location });
  if (li) {
    chunks.push({
      kind: "link",
      label: `LinkedIn (${displayUrl(li)})`,
      href: withHttp(li),
    });
  }
  if (web) {
    chunks.push({
      kind: "link",
      label: displayUrl(web),
      href: withHttp(web),
    });
  }
  if (gh) {
    chunks.push({
      kind: "link",
      label: `GitHub (${displayUrl(gh)})`,
      href: withHttp(gh),
    });
  }
  return chunks;
}

export function splitSkillsIntoColumns(
  skills: string[],
  columns: number,
): string[][] {
  if (skills.length === 0) return Array.from({ length: columns }, () => []);
  const perCol = Math.ceil(skills.length / columns);
  return Array.from({ length: columns }, (_, c) =>
    skills.slice(c * perCol, (c + 1) * perCol),
  );
}

export { parseBulletLines, parseSkillTokens };

/** Parse comma- or newline-separated languages list */
export function parseLanguageTokens(raw: string): string[] {
  if (!raw.trim()) return [];
  return raw
    .split(/[\n,]+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

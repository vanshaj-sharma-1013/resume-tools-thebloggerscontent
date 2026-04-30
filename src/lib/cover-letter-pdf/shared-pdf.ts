import type { ContactBlock } from "@/lib/cover-letter-draft";

export type ContactChunk =
  | { kind: "mailto"; label: string; href: string }
  | { kind: "link"; label: string; href: string }
  | { kind: "text"; label: string };

export function buildContactChunks(contact: ContactBlock): ContactChunk[] {
  const chunks: ContactChunk[] = [];

  if (contact.email.trim()) {
    const e = contact.email.trim();
    chunks.push({ kind: "mailto", label: e, href: `mailto:${e}` });
  }
  if (contact.phone.trim()) {
    chunks.push({ kind: "text", label: contact.phone.trim() });
  }
  if (contact.location.trim()) {
    chunks.push({ kind: "text", label: contact.location.trim() });
  }
  if (contact.linkedIn.trim()) {
    const li = contact.linkedIn.trim();
    chunks.push({
      kind: "link",
      label: "LinkedIn",
      href: li.startsWith("http") ? li : `https://${li}`,
    });
  }
  if (contact.website.trim()) {
    const w = contact.website.trim();
    chunks.push({
      kind: "link",
      label: "Website",
      href: w.startsWith("http") ? w : `https://${w}`,
    });
  }

  return chunks;
}

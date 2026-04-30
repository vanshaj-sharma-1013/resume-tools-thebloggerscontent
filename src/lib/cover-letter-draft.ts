import type { CoverLetterThemeId } from "@/lib/cover-letter-themes";
import { isCoverLetterThemeId } from "@/lib/cover-letter-themes";

export const COVER_LETTER_DRAFT_STORAGE_KEY = "cover-letter-tools-draft-v1";

export type ContactBlock = {
  fullName: string;
  professionalTitle: string;
  email: string;
  phone: string;
  location: string;
  linkedIn: string;
  website: string;
};

export type RecipientBlock = {
  name: string;
  company: string;
  role: string;
  address: string;
};

export type CoverLetterDraft = {
  version: 1;
  themeId: CoverLetterThemeId | null;
  contact: ContactBlock;
  recipient: RecipientBlock;
  date: string;
  subject: string;
  body: string;
  signOff: string;
};

export function defaultCoverLetterDraft(): CoverLetterDraft {
  const today = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return {
    version: 1,
    themeId: "modern-minimal",
    contact: {
      fullName: "",
      professionalTitle: "",
      email: "",
      phone: "",
      location: "",
      linkedIn: "",
      website: "",
    },
    recipient: {
      name: "Hiring Manager",
      company: "The Company Name",
      role: "",
      address: "",
    },
    date: today,
    subject: "Application for [Role Name]",
    body: `Dear Hiring Manager,

I am writing to express my strong interest in the [Role Name] position at [Company Name]. With my background in [Your Field] and my passion for [Relevant Passion], I am confident that I would be a valuable addition to your team.

In my previous roles, I have [Major Achievement 1]. This experience has allowed me to develop a deep understanding of [Skill/Process], which I believe aligns perfectly with the goals of [Company Name].

I am particularly impressed by [Company Name]'s commitment to [Company Goal or Value]. I am eager to bring my skills in [Key Skill 1] and [Key Skill 2] to help your team achieve even greater success.

Thank you for your time and consideration. I look forward to the possibility of discussing how my experience and passion can contribute to the continued growth of [Company Name].

Sincerely,`,
    signOff: "Sincerely,",
  };
}

export function normalizeCoverLetterDraft(raw: unknown): CoverLetterDraft {
  const base = defaultCoverLetterDraft();
  if (!raw || typeof raw !== "object") return base;
  const o = raw as Record<string, unknown>;

  const themeId = o.themeId;
  const resolvedTheme =
    themeId != null && isCoverLetterThemeId(themeId) ? themeId : base.themeId;

  const contact = (o.contact as Record<string, string>) || {};
  const recipient = (o.recipient as Record<string, string>) || {};

  return {
    version: 1,
    themeId: resolvedTheme,
    contact: {
      fullName: typeof contact.fullName === "string" ? contact.fullName : base.contact.fullName,
      professionalTitle: typeof contact.professionalTitle === "string" ? contact.professionalTitle : base.contact.professionalTitle,
      email: typeof contact.email === "string" ? contact.email : base.contact.email,
      phone: typeof contact.phone === "string" ? contact.phone : base.contact.phone,
      location: typeof contact.location === "string" ? contact.location : base.contact.location,
      linkedIn: typeof contact.linkedIn === "string" ? contact.linkedIn : base.contact.linkedIn,
      website: typeof contact.website === "string" ? contact.website : base.contact.website,
    },
    recipient: {
      name: typeof recipient.name === "string" ? recipient.name : base.recipient.name,
      company: typeof recipient.company === "string" ? recipient.company : base.recipient.company,
      role: typeof recipient.role === "string" ? recipient.role : base.recipient.role,
      address: typeof recipient.address === "string" ? recipient.address : base.recipient.address,
    },
    date: typeof o.date === "string" ? o.date : base.date,
    subject: typeof o.subject === "string" ? o.subject : base.subject,
    body: typeof o.body === "string" ? o.body : base.body,
    signOff: typeof o.signOff === "string" ? o.signOff : base.signOff,
  };
}

export function loadCoverLetterDraftFromStorage(): CoverLetterDraft | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(COVER_LETTER_DRAFT_STORAGE_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    if (
      parsed &&
      typeof parsed === "object" &&
      (parsed as { version?: unknown }).version === 1
    ) {
      return normalizeCoverLetterDraft(parsed);
    }
    return null;
  } catch {
    return null;
  }
}

export function saveCoverLetterDraftToStorage(draft: CoverLetterDraft): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(COVER_LETTER_DRAFT_STORAGE_KEY, JSON.stringify(draft));
  } catch {
    /* quota or private mode */
  }
}

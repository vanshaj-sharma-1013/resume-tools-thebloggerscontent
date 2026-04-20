import type { ResumeThemeId } from "@/lib/resume-themes";
import { isResumeThemeId } from "@/lib/resume-themes";

export const RESUME_DRAFT_STORAGE_KEY = "resume-tools-draft-v1";

export type ContactBlock = {
  fullName: string;
  professionalTitle: string;
  email: string;
  phone: string;
  location: string;
  linkedIn: string;
  website: string;
  github: string;
};

export type ExperienceEntry = {
  id: string;
  company: string;
  role: string;
  startDate: string;
  endDate: string;
  current: boolean;
  bullets: string;
};

export type EducationEntry = {
  id: string;
  school: string;
  degree: string;
  year: string;
};

/** Form steps 0–5; step 6 is the completion screen (still persisted). */
export type ResumeDraft = {
  version: 1;
  themeId: ResumeThemeId | null;
  currentStep: number;
  contact: ContactBlock;
  summary: string;
  experienceSkipped: boolean;
  experiences: ExperienceEntry[];
  educationSkipped: boolean;
  education: EducationEntry[];
  skills: string;
  languages: string;
};

export const RESUME_STEP_COUNT = 6;

export function newId(prefix: string): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `${prefix}-${crypto.randomUUID()}`;
  }
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function emptyExperience(): ExperienceEntry {
  return {
    id: newId("exp"),
    company: "",
    role: "",
    startDate: "",
    endDate: "",
    current: false,
    bullets: "",
  };
}

export function emptyEducation(): EducationEntry {
  return {
    id: newId("edu"),
    school: "",
    degree: "",
    year: "",
  };
}

export function defaultDraft(): ResumeDraft {
  return {
    version: 1,
    themeId: null,
    currentStep: 0,
    contact: {
      fullName: "",
      professionalTitle: "",
      email: "",
      phone: "",
      location: "",
      linkedIn: "",
      website: "",
      github: "",
    },
    summary: "",
    experienceSkipped: false,
    experiences: [emptyExperience()],
    educationSkipped: false,
    education: [emptyEducation()],
    skills: "",
    languages: "",
  };
}

function coerceExperience(raw: unknown): ExperienceEntry {
  const empty = emptyExperience();
  if (!raw || typeof raw !== "object") return empty;
  const o = raw as Record<string, unknown>;
  return {
    id: typeof o.id === "string" ? o.id : newId("exp"),
    company: typeof o.company === "string" ? o.company : "",
    role: typeof o.role === "string" ? o.role : "",
    startDate: typeof o.startDate === "string" ? o.startDate : "",
    endDate: typeof o.endDate === "string" ? o.endDate : "",
    current: Boolean(o.current),
    bullets: typeof o.bullets === "string" ? o.bullets : "",
  };
}

function coerceEducation(raw: unknown): EducationEntry {
  const empty = emptyEducation();
  if (!raw || typeof raw !== "object") return empty;
  const o = raw as Record<string, unknown>;
  return {
    id: typeof o.id === "string" ? o.id : newId("edu"),
    school: typeof o.school === "string" ? o.school : "",
    degree: typeof o.degree === "string" ? o.degree : "",
    year: typeof o.year === "string" ? o.year : "",
  };
}

function coerceContact(raw: unknown): ContactBlock {
  const c = defaultDraft().contact;
  if (!raw || typeof raw !== "object") return { ...c };
  const o = raw as Record<string, unknown>;
  return {
    fullName: typeof o.fullName === "string" ? o.fullName : "",
    professionalTitle:
      typeof o.professionalTitle === "string" ? o.professionalTitle : "",
    email: typeof o.email === "string" ? o.email : "",
    phone: typeof o.phone === "string" ? o.phone : "",
    location: typeof o.location === "string" ? o.location : "",
    linkedIn: typeof o.linkedIn === "string" ? o.linkedIn : "",
    website: typeof o.website === "string" ? o.website : "",
    github: typeof o.github === "string" ? o.github : "",
  };
}

export function normalizeDraft(raw: unknown): ResumeDraft {
  const base = defaultDraft();
  if (!raw || typeof raw !== "object") return base;
  const o = raw as Record<string, unknown>;

  const themeId = o.themeId;
  const resolvedTheme =
    themeId != null && isResumeThemeId(themeId) ? themeId : null;

  const currentStep =
    typeof o.currentStep === "number" && Number.isFinite(o.currentStep)
      ? Math.min(RESUME_STEP_COUNT, Math.max(0, Math.floor(o.currentStep)))
      : 0;

  const experiencesIn = Array.isArray(o.experiences) ? o.experiences : [];
  const experiences =
    experiencesIn.length > 0
      ? experiencesIn.map(coerceExperience)
      : [emptyExperience()];

  const educationIn = Array.isArray(o.education) ? o.education : [];
  const education =
    educationIn.length > 0
      ? educationIn.map(coerceEducation)
      : [emptyEducation()];

  return {
    version: 1,
    themeId: resolvedTheme,
    currentStep,
    contact: coerceContact(o.contact),
    summary: typeof o.summary === "string" ? o.summary : "",
    experienceSkipped: Boolean(o.experienceSkipped),
    experiences,
    educationSkipped: Boolean(o.educationSkipped),
    education,
    skills: typeof o.skills === "string" ? o.skills : "",
    languages: typeof o.languages === "string" ? o.languages : "",
  };
}

export function loadDraftFromStorage(): ResumeDraft | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(RESUME_DRAFT_STORAGE_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    if (
      parsed &&
      typeof parsed === "object" &&
      (parsed as { version?: unknown }).version === 1
    ) {
      return normalizeDraft(parsed);
    }
    return null;
  } catch {
    return null;
  }
}

export function saveDraftToStorage(draft: ResumeDraft): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(RESUME_DRAFT_STORAGE_KEY, JSON.stringify(draft));
  } catch {
    /* quota or private mode */
  }
}

export function clearDraftFromStorage(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(RESUME_DRAFT_STORAGE_KEY);
}

export const COVER_LETTER_THEME_IDS = [
  "modern-minimal",
  "classic-executive",
  "creative-elegant",
  "bold-professional",
] as const;

export type CoverLetterThemeId = (typeof COVER_LETTER_THEME_IDS)[number];

export type CoverLetterThemeMeta = {
  id: CoverLetterThemeId;
  name: string;
  tagline: string;
  description: string;
  accent: string;
  bestFor: string;
};

export const COVER_LETTER_THEMES: CoverLetterThemeMeta[] = [
  {
    id: "modern-minimal",
    name: "Modern Minimal",
    tagline: "Clean · Helvetica · Precise",
    description:
      "A clean, sans-serif layout that focuses on readability and professional clarity. Perfect for tech and modern startups.",
    accent: "#0f172a",
    bestFor: "Tech, startups, design",
  },
  {
    id: "classic-executive",
    name: "Classic Executive",
    tagline: "Serif · Traditional · Formal",
    description:
      "Traditional serif typography with a formal header structure. Ideal for legal, finance, and corporate leadership roles.",
    accent: "#1c1917",
    bestFor: "Law, finance, corporate leadership",
  },
  {
    id: "creative-elegant",
    name: "Creative Elegant",
    tagline: "Stylish · Serif · Modern",
    description:
      "A blend of modern serif titles and clean body text. Elegant spacing and subtle accents for a sophisticated look.",
    accent: "#7c3aed",
    bestFor: "Marketing, PR, creative arts",
  },
  {
    id: "bold-professional",
    name: "Bold Professional",
    tagline: "Strong · Sans · Impactful",
    description:
      "Features a bold header section with high-contrast typography. Makes a strong first impression for ambitious roles.",
    accent: "#2563eb",
    bestFor: "Sales, management, operations",
  },
];

export function isCoverLetterThemeId(
  value: unknown,
): value is CoverLetterThemeId {
  return (
    typeof value === "string" &&
    (COVER_LETTER_THEME_IDS as readonly string[]).includes(value)
  );
}

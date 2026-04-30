import type { Metadata } from "next";
import {
  defaultDescription,
  getSiteOrigin,
  SITE_BRAND,
  SITE_NAME,
} from "@/lib/site-config";
import { CoverLetterThemeSelectionClient } from "./theme-selection-client";

const origin = getSiteOrigin();

export const metadata: Metadata = {
  title: "Choose your cover letter theme",
  description:
    "Pick a professional cover letter layout and color theme. Your choice is saved locally — continue to the editor with no login.",
  keywords: [
    "cover letter theme",
    "cover letter layout",
    "free cover letter templates",
    "job application",
  ],
  authors: [{ name: SITE_BRAND, url: origin }],
  robots: { index: true, follow: true },
  alternates: { canonical: "/cover-letter-themes" },
};

export default function CoverLetterThemeSelectionPage() {
  return <CoverLetterThemeSelectionClient />;
}

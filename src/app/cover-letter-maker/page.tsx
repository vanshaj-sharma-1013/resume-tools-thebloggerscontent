import type { Metadata } from "next";
import {
  getSiteOrigin,
  SITE_BRAND,
} from "@/lib/site-config";
import { CoverLetterMakerClient } from "./cover-letter-maker-client";

const origin = getSiteOrigin();

export const metadata: Metadata = {
  title: "Cover Letter Builder | Free & Live Preview",
  description:
    "Create a professional cover letter with live preview and free PDF export. Choose from multiple themes and match your resume style.",
  keywords: [
    "cover letter builder",
    "free cover letter maker",
    "live preview cover letter",
    "job application letter",
  ],
  authors: [{ name: SITE_BRAND, url: origin }],
  robots: { index: true, follow: true },
  alternates: { canonical: "/cover-letter-maker" },
};

export default function CoverLetterMakerPage() {
  return <CoverLetterMakerClient />;
}

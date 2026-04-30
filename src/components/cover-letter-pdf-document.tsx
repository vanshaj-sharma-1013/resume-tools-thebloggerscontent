import { Document } from "@react-pdf/renderer";
import type { CoverLetterDraft } from "@/lib/cover-letter-draft";
import { ModernMinimalPage } from "@/components/cover-letter-pdf/modern-minimal-page";
import { ClassicExecutivePage } from "@/components/cover-letter-pdf/classic-executive-page";
import { CreativeElegantPage } from "@/components/cover-letter-pdf/creative-elegant-page";
import { BoldProfessionalPage } from "@/components/cover-letter-pdf/bold-professional-page";

type CoverLetterPdfDocumentProps = {
  draft: CoverLetterDraft;
};

export function CoverLetterPdfDocument({ draft }: CoverLetterPdfDocumentProps) {
  const contact = draft.contact;

  const page =
    draft.themeId === "classic-executive" ? (
      <ClassicExecutivePage draft={draft} />
    ) : draft.themeId === "creative-elegant" ? (
      <CreativeElegantPage draft={draft} />
    ) : draft.themeId === "bold-professional" ? (
      <BoldProfessionalPage draft={draft} />
    ) : (
      <ModernMinimalPage draft={draft} />
    );

  return (
    <Document
      title={`${contact.fullName.trim() || "Cover Letter"} — Cover Letter`}
      author={contact.fullName.trim() || "Cover Letter"}
      subject="Cover Letter"
      keywords="cover letter, application, jobs"
    >
      {page}
    </Document>
  );
}

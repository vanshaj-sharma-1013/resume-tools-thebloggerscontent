"use client";

import { useCallback, useEffect, useState } from "react";
import {
  defaultCoverLetterDraft,
  loadCoverLetterDraftFromStorage,
  saveCoverLetterDraftToStorage,
  type CoverLetterDraft,
} from "@/lib/cover-letter-draft";

export function useCoverLetterDraft() {
  const [draft, setDraft] = useState<CoverLetterDraft>(defaultCoverLetterDraft());
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const saved = loadCoverLetterDraftFromStorage();
    if (saved) {
      setDraft(saved);
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) {
      saveCoverLetterDraftToStorage(draft);
    }
  }, [draft, hydrated]);

  const updateDraft = useCallback(
    (patch: Partial<CoverLetterDraft> | ((prev: CoverLetterDraft) => CoverLetterDraft)) => {
      setDraft((prev) => {
        if (typeof patch === "function") {
          return patch(prev);
        }
        return { ...prev, ...patch };
      });
    },
    []
  );

  return {
    draft,
    updateDraft,
    hydrated,
  };
}

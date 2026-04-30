import type { CoverLetterThemeId } from "@/lib/cover-letter-themes";

type ThemeMiniPreviewProps = {
  themeId: CoverLetterThemeId;
  accent: string;
};

export function CoverLetterThemeMiniPreview({ themeId, accent }: ThemeMiniPreviewProps) {
  const line = (w: string) => (
    <div
      className="h-1 rounded-full bg-slate-200/90"
      style={{ width: w }}
      aria-hidden
    />
  );

  const paper = "flex h-[7.5rem] flex-col overflow-hidden rounded-md bg-white shadow-inner ring-1 ring-black/5";

  /* Modern Minimal */
  if (themeId === "modern-minimal") {
    return (
      <div className={`${paper} p-3`}>
        <div className="mb-2">
          <div className="h-2 w-[40%] rounded-full bg-slate-900" />
          <div className="mt-1 h-1 w-[20%] rounded-full bg-slate-400" />
        </div>
        <div className="mb-2 h-px w-full bg-slate-100" />
        <div className="flex flex-col gap-1">
          {line("100%")}
          {line("95%")}
          {line("98%")}
          {line("40%")}
        </div>
      </div>
    );
  }

  /* Classic Executive */
  if (themeId === "classic-executive") {
    return (
      <div className={`${paper} items-center p-3`}>
        <div className="mb-2 h-2 w-[50%] rounded-full bg-slate-900" />
        <div className="mb-2 h-px w-full bg-slate-900" />
        <div className="mb-1 h-1 w-[30%] self-start rounded-full bg-slate-300" />
        <div className="flex w-full flex-col gap-1">
          {line("100%")}
          {line("100%")}
          {line("85%")}
        </div>
      </div>
    );
  }

  /* Creative Elegant */
  if (themeId === "creative-elegant") {
    return (
      <div className={`${paper} relative p-3 pl-5`}>
        <div
          className="absolute bottom-0 left-0 top-0 w-1.5"
          style={{ backgroundColor: accent }}
        />
        <div className="mb-3">
          <div className="h-3 w-[60%] rounded-full bg-slate-800" />
          <div className="mt-1 h-1 w-[30%] rounded-full" style={{ backgroundColor: accent }} />
        </div>
        <div className="flex flex-col gap-1">
          {line("100%")}
          {line("100%")}
          {line("100%")}
          {line("60%")}
        </div>
      </div>
    );
  }

  /* Bold Professional */
  return (
    <div className={`${paper}`}>
      <div className="h-8 w-full p-2" style={{ backgroundColor: accent }}>
        <div className="h-2 w-[40%] rounded-full bg-white/40" />
      </div>
      <div className="p-3">
        <div className="mb-2 h-2 w-[30%] rounded-full bg-slate-200" />
        <div className="flex flex-col gap-1">
          {line("100%")}
          {line("100%")}
          {line("70%")}
        </div>
      </div>
    </div>
  );
}

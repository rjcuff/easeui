import { FileCode } from "lucide-react";
import { codeToHtml } from "shiki";
import { CollapsibleCode } from "@/components/app/docs/collapsible-code";
import { CopyButton } from "@/components/app/docs/copy-button";
import { cn } from "@/lib/utils";

/** Short names that shiki knows under a longer id. */
const LANGUAGE_ALIASES: Record<string, string> = {
  ts: "typescript",
  js: "javascript",
  sh: "bash",
};

/** Code longer than this many lines starts collapsed. */
const COLLAPSE_AFTER_LINES = 24;

export async function CodeBlock({
  code,
  lang = "tsx",
  filename,
  className,
}: {
  code: string;
  lang?: string;
  filename?: string;
  className?: string;
}) {
  const html = await codeToHtml(code, {
    lang: LANGUAGE_ALIASES[lang] ?? lang,
    themes: { light: "github-light-high-contrast", dark: "github-dark-high-contrast" },
    defaultColor: false,
  });
  const label = filename ?? lang;

  return (
    <figure
      className={cn(
        "overflow-hidden rounded-2xl border border-border bg-card font-mono text-[13px] leading-relaxed",
        className,
      )}
    >
      <figcaption className="flex min-h-11 items-center justify-between gap-3 border-b border-border pl-4 pr-1.5">
        <span className="flex min-w-0 items-center gap-2 font-sans text-xs text-muted-foreground">
          <FileCode aria-hidden="true" className="h-3.5 w-3.5 shrink-0" />
          <span className="truncate">{label}</span>
        </span>
        <CopyButton text={code} eventLabel={label} />
      </figcaption>
      <CollapsibleCode collapsible={code.split("\n").length > COLLAPSE_AFTER_LINES}>
        <div
          className="py-4 [&_.line]:px-4 [&_pre]:overflow-x-auto [&_pre]:!bg-transparent"
          // Highlighted from our own source files, not user input.
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </CollapsibleCode>
    </figure>
  );
}

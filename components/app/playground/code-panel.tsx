"use client";

import { useEffect, useState } from "react";
import { CopyButton } from "@/components/app/docs/copy-button";
import { cn } from "@/lib/utils";

/**
 * Generated snippet with syntax highlighting. The plain code renders first and
 * the highlighted version swaps in once shiki loads, so the layout never jumps.
 */
export function CodePanel({ code, className }: { code: string; className?: string }) {
  const [html, setHtml] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    setHtml(null);
    import("shiki")
      .then(({ codeToHtml }) =>
        codeToHtml(code, {
          lang: "tsx",
          themes: { light: "github-light-high-contrast", dark: "github-dark-high-contrast" },
          defaultColor: false,
        }),
      )
      .then((highlighted) => {
        if (active) setHtml(highlighted);
      })
      .catch((error: unknown) => {
        // Highlighting is an enhancement. The plain code stays visible if it fails.
        console.warn("Code highlighting failed", error);
      });
    return () => {
      active = false;
    };
  }, [code]);

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border border-border bg-card font-mono text-[13px] leading-relaxed",
        className,
      )}
    >
      <div className="absolute right-3 top-3 z-10">
        <CopyButton text={code} eventName="copy_playground" />
      </div>
      {html ? (
        <div
          className="py-4 [&_.line]:px-5 [&_pre]:overflow-x-auto [&_pre]:!bg-transparent"
          // Generated from our own snippet templates, not user input.
          dangerouslySetInnerHTML={{ __html: html }}
        />
      ) : (
        <pre className="overflow-x-auto px-5 py-4 text-foreground">
          <code>{code}</code>
        </pre>
      )}
    </div>
  );
}

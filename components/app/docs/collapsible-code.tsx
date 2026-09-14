"use client";

import { type ReactNode, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Long code starts clipped behind a soft fade. Expanding is instant, because
 * animating height would force layout work on every frame.
 */
export function CollapsibleCode({
  collapsible,
  children,
}: {
  collapsible: boolean;
  children: ReactNode;
}) {
  const [expanded, setExpanded] = useState(false);
  if (!collapsible) return <>{children}</>;

  return (
    <div className="relative">
      <div
        className={cn(
          !expanded &&
            "max-h-80 overflow-hidden [mask-image:linear-gradient(to_bottom,black_65%,transparent)]",
        )}
      >
        {children}
      </div>
      <div className={cn("flex justify-center pb-3", !expanded && "absolute inset-x-0 bottom-0")}>
        <button
          type="button"
          aria-expanded={expanded}
          onClick={() => setExpanded((value) => !value)}
          className="inline-flex min-h-9 touch-manipulation items-center rounded-full bg-background px-4 font-sans text-xs font-medium text-foreground shadow-[0_0_0_1px_var(--border-strong)] transition-[background-color,transform] duration-150 ease-out hover:bg-muted active:scale-[0.97]"
        >
          {expanded ? "Show less" : "Show all"}
        </button>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { getNewBadgeRemainingMs } from "@/lib/component-status";
import { cn } from "@/lib/utils";

/** Largest delay setTimeout accepts. */
const MAX_TIMEOUT = 2_147_483_647;

/** True while a launch is inside its "new" window. Checked on the client so it never goes stale. */
function useIsNew(launchedAt?: string) {
  const [isNew, setIsNew] = useState(false);

  useEffect(() => {
    const remaining = getNewBadgeRemainingMs(launchedAt);
    setIsNew(remaining > 0);
    if (remaining <= 0) return;
    const timeout = window.setTimeout(() => setIsNew(false), Math.min(remaining, MAX_TIMEOUT));
    return () => window.clearTimeout(timeout);
  }, [launchedAt]);

  return isNew;
}

/** A small rose dot for tight spaces, such as a card title. */
export function NewDot({ launchedAt, className }: { launchedAt?: string; className?: string }) {
  const isNew = useIsNew(launchedAt);
  if (!isNew) return null;
  return (
    <span className={cn("inline-flex items-center", className)}>
      <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-accent" />
      <span className="sr-only">New</span>
    </span>
  );
}

/** A labeled pill for page headings. */
export function NewLabel({ launchedAt, className }: { launchedAt?: string; className?: string }) {
  const isNew = useIsNew(launchedAt);
  if (!isNew) return null;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium text-accent shadow-[0_0_0_1px_color-mix(in_oklch,var(--accent)_35%,transparent)]",
        className,
      )}
    >
      <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-accent" />
      New
    </span>
  );
}

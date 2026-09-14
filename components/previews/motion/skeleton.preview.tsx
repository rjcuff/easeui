"use client";

import { RotateCw } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/motion/button";
import { Skeleton } from "@/components/motion/skeleton";

/** How long the pretend request takes, in ms. */
const LOAD_MS = 1600;

export function SkeletonPreview() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!loading) return;
    const timeout = setTimeout(() => setLoading(false), LOAD_MS);
    return () => clearTimeout(timeout);
  }, [loading]);

  return (
    <div className="flex w-full max-w-xs flex-col items-center gap-5">
      <div className="flex w-full items-center gap-3 rounded-2xl bg-background p-4 shadow-[0_0_0_1px_var(--border)]">
        <Skeleton loading={loading} className="shrink-0 [&>span]:rounded-full">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-accent text-sm font-semibold text-accent-foreground">
            MR
          </div>
        </Skeleton>
        <div className="flex min-w-0 flex-1 flex-col gap-1.5">
          <Skeleton loading={loading} className="w-fit [&>span]:rounded-md">
            <p className="text-sm font-medium text-foreground">Maya Rivera</p>
          </Skeleton>
          <Skeleton loading={loading} className="w-fit [&>span]:rounded-md">
            <p className="text-xs text-muted-foreground">Design lead, joined in March</p>
          </Skeleton>
        </div>
      </div>
      <Button variant="secondary" size="sm" onClick={() => setLoading(true)} disabled={loading}>
        <RotateCw aria-hidden="true" className="h-3.5 w-3.5" />
        Reload
      </Button>
    </div>
  );
}

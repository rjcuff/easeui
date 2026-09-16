"use client";

import { useState } from "react";
import { TextAnimation } from "@/components/motion/text-animation";
import { cn } from "@/lib/utils";

const VARIANTS = ["scramble", "reveal", "shimmer"] as const;
type Variant = (typeof VARIANTS)[number];

const PHRASES: Record<Variant, string> = {
  scramble: "Inspecting the repository",
  reveal: "Motion that feels considered.",
  shimmer: "Loading your dashboard…",
};

export function TextAnimationPreview() {
  const [variant, setVariant] = useState<Variant>("scramble");
  const [replayCount, setReplayCount] = useState(0);

  return (
    <div className="flex w-full flex-col items-center gap-8 text-center">
      <div key={`${variant}-${replayCount}`} className="flex min-h-16 items-center justify-center">
        {variant === "scramble" && (
          <span className="font-mono text-xl font-medium text-foreground">
            <TextAnimation variant="scramble" text={PHRASES.scramble} />
          </span>
        )}
        {variant === "reveal" && (
          <span className="text-2xl font-semibold tracking-tight text-foreground">
            <TextAnimation variant="reveal" text={PHRASES.reveal} />
          </span>
        )}
        {variant === "shimmer" && (
          <span className="text-2xl font-semibold">
            <TextAnimation variant="shimmer">{PHRASES.shimmer}</TextAnimation>
          </span>
        )}
      </div>

      <div className="flex flex-wrap items-center justify-center gap-2">
        {VARIANTS.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => {
              setVariant(item);
              setReplayCount((count) => count + 1);
            }}
            className={cn(
              "inline-flex h-9 items-center rounded-full px-4 text-xs font-medium capitalize transition-colors duration-150",
              variant === item
                ? "bg-foreground text-background"
                : "text-foreground shadow-[0_0_0_1px_var(--border-strong)] hover:bg-foreground/5",
            )}
          >
            {item}
          </button>
        ))}
        <button
          type="button"
          onClick={() => setReplayCount((count) => count + 1)}
          className="inline-flex h-9 items-center rounded-full px-4 text-xs font-medium text-foreground shadow-[0_0_0_1px_var(--border-strong)] transition-colors duration-150 hover:bg-foreground/5"
        >
          Replay
        </button>
      </div>
    </div>
  );
}

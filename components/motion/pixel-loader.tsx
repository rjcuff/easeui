"use client";

import { useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

const CELLS = 9;
const MIN_PULSE_MS = 500;
const MAX_PULSE_MS = 1100;

function useElapsed(active: boolean) {
  const [ms, setMs] = useState(0);
  useEffect(() => {
    if (!active) return;
    const startedAt = Date.now();
    const timer = setInterval(() => setMs(Date.now() - startedAt), 100);
    return () => clearInterval(timer);
  }, [active]);
  const seconds = ms / 1000;
  return seconds < 60 ? `${seconds.toFixed(1)}s` : `${Math.floor(seconds / 60)}m ${(seconds % 60).toFixed(1)}s`;
}

export interface PixelLoaderProps {
  /** Status label shown beside the grid. Default "Thinking". */
  label?: string;
  /** Shows a live elapsed-time counter after the label. Default false. */
  showElapsed?: boolean;
  className?: string;
}

/**
 * A 3x3 grid of cells that twinkle on their own independent, randomized
 * cycles, for work that runs long enough to want a sense of progress. No
 * two cells share a rhythm, so nothing about it reads as a sweep or a
 * pattern. Pairs a shimmering label with an optional live timer. Reduced
 * motion holds the grid dim; the timer still ticks.
 */
export function PixelLoader({ label = "Thinking", showElapsed = false, className }: PixelLoaderProps) {
  const cellRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const elapsed = useElapsed(showElapsed);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce) return;
    const animations = cellRefs.current.map((cell) =>
      cell?.animate([{ opacity: 0.15 }, { opacity: 1 }, { opacity: 0.15 }], {
        duration: MIN_PULSE_MS + Math.random() * (MAX_PULSE_MS - MIN_PULSE_MS),
        delay: Math.random() * MAX_PULSE_MS,
        iterations: Number.POSITIVE_INFINITY,
        easing: "ease-in-out",
      }),
    );
    return () => {
      for (const animation of animations) animation?.cancel();
    };
  }, [reduce]);

  return (
    <div role="status" className={cn("inline-flex items-center gap-2.5", className)}>
      <span aria-hidden="true" className="grid grid-cols-3 gap-[3px]">
        {Array.from({ length: CELLS }, (_, index) => (
          <span
            // biome-ignore lint/suspicious/noArrayIndexKey: a fixed 3x3 grid, cells never reorder.
            key={index}
            ref={(el) => {
              cellRefs.current[index] = el;
            }}
            className="h-[5px] w-[5px] rounded-[1px] bg-foreground"
            style={{ opacity: reduce ? 0.5 : 0.15 }}
          />
        ))}
      </span>
      <span
        className={cn(
          "inline-block text-sm font-medium",
          reduce
            ? "text-muted-foreground"
            : "animate-shimmer bg-[length:200%_100%] bg-clip-text text-transparent [-webkit-background-clip:text]",
        )}
        style={
          reduce
            ? undefined
            : {
                backgroundImage:
                  "linear-gradient(90deg, var(--muted-foreground) 30%, var(--foreground) 50%, var(--muted-foreground) 70%)",
              }
        }
      >
        {label}
      </span>
      {showElapsed ? (
        <span className="font-mono text-xs text-muted-foreground tabular-nums">{elapsed}</span>
      ) : null}
    </div>
  );
}

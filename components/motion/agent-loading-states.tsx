"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { type ReactNode, useEffect, useState } from "react";
import { Progress } from "@/components/motion/progress";
import { cn } from "@/lib/utils";

const EASE = [0.23, 1, 0.32, 1] as const;

export interface ShimmerTextProps {
  children: ReactNode;
  className?: string;
}

/** Status text with a bright band sweeping across it, for a quiet "still working" signal. */
export function ShimmerText({ children, className }: ShimmerTextProps) {
  const reduce = useReducedMotion();

  if (reduce) {
    return (
      <span className={cn("text-sm font-medium text-muted-foreground", className)}>
        {children}
      </span>
    );
  }

  return (
    <span
      className={cn(
        "inline-block animate-shimmer bg-[length:200%_100%] bg-clip-text text-sm font-medium text-transparent [-webkit-background-clip:text]",
        className,
      )}
      style={{
        backgroundImage:
          "linear-gradient(90deg, var(--muted-foreground) 30%, var(--foreground) 50%, var(--muted-foreground) 70%)",
      }}
    >
      {children}
    </span>
  );
}

export interface AgentProgressProps {
  label: string;
  /** 0 to 100. Omitted, the bar runs indeterminate. */
  value?: number;
  className?: string;
}

/** A labeled progress bar with a pulsing dot marking it as a live, running step. */
export function AgentProgress({ label, value, className }: AgentProgressProps) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <span className="flex items-center gap-2 text-sm text-foreground">
        <span className="relative flex h-2 w-2 shrink-0">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75 motion-reduce:hidden" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
        </span>
        {label}
      </span>
      <Progress value={value} />
    </div>
  );
}

export interface ReasoningPhasesProps {
  phases: string[];
  /** Milliseconds each phrase stays before crossfading to the next. Default 2200. */
  interval?: number;
  className?: string;
}

/** Cycles through short phrases, crossfading between them, to narrate an agent's steps. */
export function ReasoningPhases({ phases, interval = 2200, className }: ReasoningPhasesProps) {
  const [index, setIndex] = useState(0);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (phases.length < 2) return;
    const timer = setInterval(() => setIndex((i) => (i + 1) % phases.length), interval);
    return () => clearInterval(timer);
  }, [phases.length, interval]);

  return (
    <div className={cn("text-sm text-muted-foreground", className)}>
      <AnimatePresence mode="wait">
        <motion.span
          key={index}
          initial={reduce ? false : { opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4, transition: { duration: reduce ? 0 : 0.1 } }}
          transition={{ duration: reduce ? 0 : 0.2, ease: EASE }}
          className="block"
        >
          {phases[index]}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}

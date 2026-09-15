"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { type ReactNode, useEffect, useRef, useState } from "react";
import { Progress } from "@/components/motion/progress";
import { cn } from "@/lib/utils";

const EASE = [0.23, 1, 0.32, 1] as const;

const GRID = 3;
// One shared loop cut into 6 even slots, one per row or column, so only one ever turns.
const LOOP_MS = 6000;
const SLOTS = 6;
const TURN_MS = 400;

/** A full spin inside one slot of the loop; flat everywhere else. */
function turnKeyframes(axis: "X" | "Y", slot: number): Keyframe[] {
  const start = slot / SLOTS;
  const end = start + TURN_MS / LOOP_MS;
  return [
    { transform: `rotate${axis}(0deg)`, offset: 0 },
    { transform: `rotate${axis}(0deg)`, offset: start, easing: "ease-in-out" },
    { transform: `rotate${axis}(360deg)`, offset: end },
    { transform: `rotate${axis}(360deg)`, offset: 1 },
  ];
}

function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

type Turn = { axis: "X" | "Y"; index: number };

/** A random order for which row or column turns in each slot. */
function shuffledTurns(): Turn[] {
  const turns: Turn[] = [0, 1, 2].flatMap((index) => [
    { axis: "X" as const, index },
    { axis: "Y" as const, index },
  ]);
  for (let i = turns.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [turns[i], turns[j]] = [turns[j], turns[i]];
  }
  return turns;
}

export interface ThinkingCubeProps {
  /** Size of one tile, in pixels. Default 9. */
  tileSize?: number;
  /** Accessible name for the status it represents. Default "Thinking". */
  label?: string;
  className?: string;
}

/**
 * A 3x3 grid of white tiles that turns in 3D, a row or column at a time,
 * like a cube being worked. Real CSS 3D transforms, no scene or model.
 * Pauses with reduced motion on.
 */
export function ThinkingCube({ tileSize = 9, label = "Thinking", className }: ThinkingCubeProps) {
  const rowRefs = useRef<(HTMLDivElement | null)[]>([]);
  const cellRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const animations: Animation[] = [];
    const options = { duration: LOOP_MS, iterations: Number.POSITIVE_INFINITY };

    shuffledTurns().forEach((turn, slot) => {
      if (turn.axis === "X") {
        const wrapper = rowRefs.current[turn.index];
        if (wrapper?.animate) animations.push(wrapper.animate(turnKeyframes("X", slot), options));
        return;
      }
      for (let row = 0; row < GRID; row += 1) {
        const cell = cellRefs.current[row * GRID + turn.index];
        if (cell?.animate) animations.push(cell.animate(turnKeyframes("Y", slot), options));
      }
    });

    return () => {
      for (const animation of animations) animation.cancel();
    };
  }, []);

  const gap = Math.max(1, Math.round(tileSize * 0.15));

  return (
    <div
      role="status"
      aria-label={label}
      className={cn("inline-block", className)}
      style={{ perspective: tileSize * 18 }}
    >
      <div className="flex flex-col" style={{ gap, transformStyle: "preserve-3d" }}>
        {Array.from({ length: GRID }, (_, row) => (
          <div
            // biome-ignore lint/suspicious/noArrayIndexKey: a fixed 3x3 grid, rows never reorder.
            key={row}
            ref={(el) => {
              rowRefs.current[row] = el;
            }}
            className="flex"
            style={{ gap, transformStyle: "preserve-3d" }}
          >
            {Array.from({ length: GRID }, (_, col) => (
              <span
                // biome-ignore lint/suspicious/noArrayIndexKey: a fixed 3x3 grid, columns never reorder.
                key={col}
                ref={(el) => {
                  cellRefs.current[row * GRID + col] = el;
                }}
                aria-hidden="true"
                className="block rounded-[2px] bg-white shadow-[inset_0_0_0_1px_rgba(0,0,0,0.1)]"
                style={{ width: tileSize, height: tileSize }}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

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

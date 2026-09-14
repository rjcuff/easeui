"use client";

import { ArrowRight } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";
import { PressLink } from "@/components/app/press-link";
import { GradientText } from "@/components/motion/gradient-text";
import { EASE_OUT } from "@/lib/ease";

/** Gap between each piece of the hero arriving, in seconds. */
const STEP = 0.06;

const LINES: ReactNode[] = [
  "Components that",
  <>
    move{" "}
    <GradientText>naturally</GradientText>
  </>,
];

export function Hero() {
  const reduce = useReducedMotion();

  // Each piece fades in and rises 8px. Reduced motion jumps straight to the end state. Always
  // passing animate matters, because the server renders the starting state before it knows.
  const enter = (index: number) => ({
    initial: { opacity: 0, y: 8 },
    animate: { opacity: 1, y: 0 },
    transition: reduce
      ? { duration: 0 }
      : { duration: 0.35, ease: EASE_OUT, delay: index * STEP },
  });

  return (
    <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
      <h1 className="font-display text-5xl font-semibold leading-[0.95] tracking-tight text-foreground sm:text-6xl md:text-7xl">
        {LINES.map((line, index) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: the lines are static and never reorder.
          <motion.span key={index} className="block" {...enter(index)}>
            {line}
          </motion.span>
        ))}
      </h1>

      <motion.p
        {...enter(LINES.length)}
        className="mx-auto mt-6 max-w-lg text-pretty text-base leading-7 text-muted-foreground"
      >
        easeUI is a set of React components with smooth easing and spring
        animations. Add them to your project as source files with the shadcn
        CLI.
      </motion.p>

      <motion.div
        {...enter(LINES.length + 1)}
        className="mt-8 flex flex-wrap items-center justify-center gap-3"
      >
        <PressLink
          href="/components/motion"
          className="group inline-flex min-h-11 touch-manipulation items-center gap-2 rounded-full bg-foreground px-5 text-sm font-medium text-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          Browse components
          <ArrowRight className="h-4 w-4 transition-transform duration-150 group-hover:translate-x-0.5 motion-reduce:transition-none" />
        </PressLink>
      </motion.div>
    </div>
  );
}

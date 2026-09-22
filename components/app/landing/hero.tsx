"use client";

import { ArrowRight, ArrowUpRight, Sparkles } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";
import { PressLink } from "@/components/app/press-link";
import { GradientText } from "@/components/motion/gradient-text";
import { EASE_OUT } from "@/lib/ease";
import { registry } from "@/lib/registry";

/** The Pro catalog, which lives on its own domain. */
const PRO_URL = "https://pro.easeui.dev";

const MOTION_COUNT = registry.find((category) => category.slug === "motion")?.components.length ?? 0;
const AGENT_COUNT = registry.find((category) => category.slug === "agents")?.components.length ?? 0;

/** Gap between each piece of the hero arriving, in seconds. */
const STEP = 0.06;

const LINES: ReactNode[] = [
  "Interfaces that",
  <>
    feel <GradientText>considered</GradientText>
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
      <motion.div {...enter(0)}>
        <PressLink
          href="/components/motion"
          className="group inline-flex items-center gap-2 rounded-full bg-muted py-1 pl-1 pr-3 text-xs font-medium text-muted-foreground shadow-[0_0_0_1px_var(--border)] transition-colors duration-150 hover:text-foreground"
        >
          <span
            aria-hidden="true"
            className="flex h-5 w-5 items-center justify-center rounded-full bg-accent/15 text-accent"
          >
            <Sparkles className="h-3 w-3" />
          </span>
          {MOTION_COUNT + AGENT_COUNT} components · copy the source, skip the package
          <ArrowRight className="h-3.5 w-3.5 transition-transform duration-150 group-hover:translate-x-0.5 motion-reduce:transition-none" />
        </PressLink>
      </motion.div>

      <h1 className="mt-5 font-display text-5xl font-semibold leading-[0.95] tracking-tight text-foreground sm:text-6xl md:text-7xl">
        {LINES.map((line, index) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: the lines are static and never reorder.
          <motion.span key={index} className="block" {...enter(index + 1)}>
            {line}
          </motion.span>
        ))}
      </h1>

      <motion.p
        {...enter(LINES.length + 1)}
        className="mx-auto mt-6 max-w-lg text-pretty text-base leading-7 text-muted-foreground"
      >
        easeUI is a set of React components with the easing and spring motion
        already tuned. Copy the source into your project with the shadcn CLI,
        no package to depend on.
      </motion.p>

      {/* An even split on a phone, sized to their labels above it. The free
          catalog keeps the filled button; Pro sits beside it as the quieter of
          the two, because this page is not trying to sell first. */}
      <motion.div
        {...enter(LINES.length + 2)}
        className="mt-8 flex w-full items-stretch justify-center gap-3 sm:w-auto sm:flex-wrap sm:items-center"
      >
        <PressLink
          href="/components/motion"
          className="group inline-flex min-h-11 flex-1 touch-manipulation items-center justify-center gap-2 rounded-full bg-foreground px-5 text-sm font-medium text-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:flex-none"
        >
          {/* Two buttons cannot both fit their full labels in half a 320px
              screen, so the phone gets the shorter one. */}
          <span className="sm:hidden">Components</span>
          <span className="hidden sm:inline">Browse components</span>
          <ArrowRight className="hidden h-4 w-4 transition-transform duration-150 group-hover:translate-x-0.5 motion-reduce:transition-none sm:block" />
        </PressLink>

        <PressLink
          href={PRO_URL}
          target="_blank"
          rel="noreferrer noopener"
          className="group inline-flex min-h-11 flex-1 touch-manipulation items-center justify-center gap-2 rounded-full px-5 text-sm font-medium text-foreground shadow-[0_0_0_1px_var(--border-strong)] transition-colors duration-150 hover:bg-foreground/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/40 sm:flex-none"
        >
          easeUI Pro
          <ArrowUpRight
            aria-hidden="true"
            className="h-4 w-4 text-muted-foreground transition-transform duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 motion-reduce:transition-none"
          />
        </PressLink>
      </motion.div>
    </div>
  );
}

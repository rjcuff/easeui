"use client";

import { motion, useReducedMotion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { EASE_OUT } from "@/lib/ease";
import { PressLink } from "@/components/app/press-link";
import { TextReveal } from "@/components/motion/text-reveal";

const HEADLINE = ["Components that", "move naturally."];
const HEADLINE_WORDS = HEADLINE.reduce((n, l) => n + l.split(" ").length, 0);
const STAGGER = 0.04;
const START = 0.05;

export function Hero() {
  const reduce = useReducedMotion();
  const headlineEnd = START + HEADLINE_WORDS * STAGGER;
  const subDelay = headlineEnd + 0.05;
  const ctaDelay = subDelay + 0.1;

  // A short fade and 6px rise. Reduced motion renders the final state.
  const enter = (delay: number) =>
    reduce
      ? { initial: false as const }
      : {
          initial: { opacity: 0, y: 6 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.3, ease: EASE_OUT, delay },
        };

  return (
    <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
      <TextReveal
        as="h1"
        text={HEADLINE}
        delay={START}
        stagger={STAGGER}
        className="mx-auto font-display text-5xl font-semibold leading-[0.95] tracking-tight text-foreground sm:text-6xl md:text-7xl"
      />

      <motion.p
        {...enter(subDelay)}
        className="mx-auto mt-6 max-w-lg text-pretty text-base leading-7 text-muted-foreground"
      >
        easeUI is a set of React components with smooth easing and spring
        animations. Add them to your project as source files with the shadcn
        CLI.
      </motion.p>

      <motion.div
        {...enter(ctaDelay)}
        className="mt-8 flex flex-wrap items-center justify-center gap-3"
      >
        <PressLink
          href="/components/motion"
          className="group inline-flex min-h-11 touch-manipulation items-center gap-2 rounded-full bg-foreground px-5 text-sm font-medium text-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          Browse components
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </PressLink>
      </motion.div>
    </div>
  );
}

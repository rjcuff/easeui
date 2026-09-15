"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Children, isValidElement, type ReactElement, type ReactNode } from "react";
import { EASE_OUT } from "@/lib/ease";
import { cn } from "@/lib/utils";

export interface DynamicIslandViewProps {
  /** Matches the parent's `view` prop when this is the active view. */
  id: string;
  className?: string;
  children?: ReactNode;
}

/** A named live-activity view. Read by the parent DynamicIsland; never rendered on its own. */
export function DynamicIslandView({ children }: DynamicIslandViewProps) {
  return <>{children}</>;
}

export interface DynamicIslandProps {
  /** Which view is active. `null` shows the compact pill. */
  view: string | null;
  /** Compact pill content, shown while no view is active. */
  compact?: ReactNode;
  /** One or more DynamicIslandView elements. */
  children?: ReactNode;
  className?: string;
}

// A deliberate exception to this library's usual bounce:0 springs — the
// island is meant to feel soft and a little elastic, like it's made of
// liquid, not a stiff panel. Reduced motion drops the bounce entirely below.
const MORPH_SPRING = { type: "spring", bounce: 0.35, duration: 0.6 } as const;

/**
 * A pill that morphs between a compact status line and any number of named
 * live-activity views — the same element reshaping via layout animation
 * each time, rather than one panel swapping for another beside it.
 */
export function DynamicIsland({ view, compact, children, className }: DynamicIslandProps) {
  const reduce = useReducedMotion();
  const views = Children.toArray(children).filter(isValidElement) as ReactElement<DynamicIslandViewProps>[];
  const active = views.find((item) => item.props.id === view);

  return (
    <motion.div
      layout={!reduce}
      transition={reduce ? { duration: 0 } : MORPH_SPRING}
      style={{ borderRadius: active ? 28 : 9999, willChange: "transform" }}
      className={cn(
        "mx-auto flex w-fit max-w-full items-center justify-center overflow-hidden bg-foreground text-background",
        className,
      )}
    >
      <AnimatePresence mode="popLayout" initial={false}>
        {active ? (
          <motion.div
            key={active.props.id}
            layout
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1, transition: { delay: reduce ? 0 : 0.08, duration: 0.15, ease: EASE_OUT } }}
            exit={reduce ? undefined : { opacity: 0 }}
            className={cn("flex items-center gap-3 p-4", active.props.className)}
          >
            {active.props.children}
          </motion.div>
        ) : (
          <motion.div
            key="compact"
            layout
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduce ? undefined : { opacity: 0 }}
            transition={{ duration: 0.15, ease: EASE_OUT }}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium"
          >
            {compact}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

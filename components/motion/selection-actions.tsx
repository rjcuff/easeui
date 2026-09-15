"use client";

import { X } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";
import { EASE_OUT } from "@/lib/ease";
import { cn } from "@/lib/utils";

export interface SelectionActionsProps {
  /** How many items are selected. The bar hides itself at 0. */
  count: number;
  onClear?: () => void;
  /** Action buttons, such as icon buttons for delete or tag. */
  children: ReactNode;
  className?: string;
}

/**
 * A bar for bulk actions that floats over the page rather than sitting in
 * flow, so rows in a Table (or any list) above it never jump when it
 * appears or disappears. Fixed to the bottom of the viewport, centered.
 * Fades and rises in once count leaves zero, and back out once the
 * selection clears.
 */
export function SelectionActions({ count, onClear, children, className }: SelectionActionsProps) {
  const reduce = useReducedMotion();

  return (
    <AnimatePresence>
      {count > 0 ? (
        <motion.div
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 8, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={reduce ? { opacity: 0 } : { opacity: 0, y: 8, scale: 0.97 }}
          transition={{ duration: reduce ? 0.1 : 0.2, ease: EASE_OUT }}
          className={cn(
            "fixed inset-x-0 bottom-6 z-40 mx-auto flex w-fit items-center gap-2 rounded-full bg-foreground py-1.5 pl-1.5 pr-3 text-background shadow-[0_12px_24px_-12px_rgb(0_0_0/0.4)]",
            className,
          )}
        >
          <button
            type="button"
            onClick={onClear}
            aria-label="Clear selection"
            className="relative inline-flex h-7 w-7 shrink-0 touch-manipulation items-center justify-center rounded-full outline-none transition-colors duration-150 after:absolute after:-inset-1.5 hover:bg-background/15 focus-visible:ring-2 focus-visible:ring-background/60"
          >
            <X aria-hidden="true" className="h-3.5 w-3.5" />
          </button>
          <span className="text-sm font-medium tabular-nums">{count} selected</span>
          <div className="mx-1 h-4 w-px bg-background/25" />
          <div className="flex items-center gap-1">{children}</div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

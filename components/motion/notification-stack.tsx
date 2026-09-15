"use client";

import { AnimatePresence, motion } from "motion/react";
import { type FocusEvent, type ReactNode, useState } from "react";
import { SPRING_LAYOUT } from "@/lib/ease";
import { cn } from "@/lib/utils";

export interface NotificationStackItem {
  id: string;
  title: string;
  description?: string;
  /** A small trailing element, such as a retry count or a status icon. */
  trailing?: ReactNode;
}

export interface NotificationStackProps {
  items: NotificationStackItem[];
  /** Controlled expanded state. */
  expanded?: boolean;
  /** Starting state when uncontrolled. Default false. */
  defaultExpanded?: boolean;
  onExpandedChange?: (expanded: boolean) => void;
  /** How many cards peek out behind the top one when collapsed. Default 3. */
  maxVisible?: number;
  emptyLabel?: string;
  className?: string;
}

function Card({ item }: { item: NotificationStackItem }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -8, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.15 } }}
      transition={SPRING_LAYOUT}
      style={{ willChange: "transform" }}
      className="relative z-10 flex items-start gap-3 rounded-xl bg-background p-3 shadow-[0_0_0_1px_var(--border)]"
    >
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-medium text-foreground">{item.title}</span>
        {item.description ? (
          <span className="mt-0.5 block truncate text-xs text-muted-foreground">{item.description}</span>
        ) : null}
      </span>
      {item.trailing ? <span className="shrink-0 text-xs font-medium">{item.trailing}</span> : null}
    </motion.div>
  );
}

/**
 * A deck of notification cards: collapsed to the top card with peeking
 * edges behind it, fanning into a readable list on hover or focus.
 */
export function NotificationStack({
  items,
  expanded: expandedProp,
  defaultExpanded = false,
  onExpandedChange,
  maxVisible = 3,
  emptyLabel = "All caught up",
  className,
}: NotificationStackProps) {
  const [uncontrolled, setUncontrolled] = useState(defaultExpanded);
  const isControlled = expandedProp !== undefined;
  const expanded = isControlled ? expandedProp : uncontrolled;

  const setExpanded = (next: boolean) => {
    if (!isControlled) setUncontrolled(next);
    onExpandedChange?.(next);
  };

  const onBlur = (event: FocusEvent<HTMLDivElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget as Node)) setExpanded(false);
  };

  if (items.length === 0) {
    return (
      <p
        className={cn(
          "rounded-xl bg-background p-3 text-center text-xs text-muted-foreground shadow-[0_0_0_1px_var(--border)]",
          className,
        )}
      >
        {emptyLabel}
      </p>
    );
  }

  const peek = items.slice(0, maxVisible);

  return (
    // biome-ignore lint/a11y/noStaticElementInteractions: only tracks hover/focus to expand the stack; any interactive trailing content underneath is its own focusable control.
    <div
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
      onFocus={() => setExpanded(true)}
      onBlur={onBlur}
      className={cn("relative isolate flex flex-col gap-2", className)}
    >
      {!expanded && peek.length > 1 ? (
        <span
          aria-hidden="true"
          className="absolute inset-x-2 top-2 -z-10 h-12 rounded-xl bg-card shadow-[0_0_0_1px_var(--border)]"
        />
      ) : null}
      {!expanded && peek.length > 2 ? (
        <span
          aria-hidden="true"
          className="absolute inset-x-4 top-4 -z-20 h-12 rounded-xl bg-card/70 shadow-[0_0_0_1px_var(--border)]"
        />
      ) : null}
      <AnimatePresence mode="popLayout" initial={false}>
        {(expanded ? items : peek.slice(0, 1)).map((item) => (
          <Card key={item.id} item={item} />
        ))}
      </AnimatePresence>
    </div>
  );
}

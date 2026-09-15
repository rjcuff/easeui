"use client";

import { motion } from "motion/react";
import { type KeyboardEvent, type ReactNode, useState } from "react";
import { SPRING_LAYOUT } from "@/lib/ease";
import { cn } from "@/lib/utils";

export interface ExpandableTab {
  id: string;
  label: string;
  icon: ReactNode;
}

export interface ExpandableTabsProps {
  tabs: ExpandableTab[];
  /** Controlled selected tab id. */
  value?: string;
  /** Starting selection when uncontrolled. Defaults to the first tab. */
  defaultValue?: string;
  onChange?: (id: string) => void;
  className?: string;
}

const NAV_KEYS = new Set(["ArrowRight", "ArrowLeft", "Home", "End"]);

/**
 * A row of icon tabs where the selected one expands to reveal its label,
 * sliding a shared background pill to match.
 */
export function ExpandableTabs({ tabs, value, defaultValue, onChange, className }: ExpandableTabsProps) {
  const [uncontrolled, setUncontrolled] = useState(defaultValue ?? tabs[0]?.id);
  const isControlled = value !== undefined;
  const current = isControlled ? value : uncontrolled;

  const select = (id: string) => {
    if (!isControlled) setUncontrolled(id);
    onChange?.(id);
  };

  // Arrow keys, Home, and End move between tabs and select them.
  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!NAV_KEYS.has(event.key)) return;
    const buttons = Array.from(event.currentTarget.querySelectorAll<HTMLButtonElement>('[role="tab"]'));
    const index = buttons.indexOf(document.activeElement as HTMLButtonElement);
    if (index < 0) return;
    event.preventDefault();
    const next =
      event.key === "Home"
        ? 0
        : event.key === "End"
          ? buttons.length - 1
          : (index + (event.key === "ArrowRight" ? 1 : -1) + buttons.length) % buttons.length;
    buttons[next].focus();
    buttons[next].click();
  };

  return (
    <div
      role="tablist"
      onKeyDown={onKeyDown}
      className={cn(
        "inline-flex items-center gap-1 rounded-full bg-card p-1 shadow-[0_0_0_1px_var(--border)]",
        className,
      )}
    >
      {tabs.map((tab) => {
        const active = tab.id === current;
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={active}
            tabIndex={active ? 0 : -1}
            onClick={() => select(tab.id)}
            className="relative flex h-9 shrink-0 items-center gap-1.5 rounded-full px-3 text-sm font-medium outline-none transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-foreground/40"
          >
            {active ? (
              <motion.span
                layoutId="expandable-tabs-indicator"
                transition={SPRING_LAYOUT}
                className="absolute inset-0 rounded-full bg-background shadow-[0_0_0_1px_var(--border)]"
              />
            ) : null}
            <span
              className={cn(
                "relative z-10 flex shrink-0 items-center",
                active ? "text-foreground" : "text-muted-foreground",
              )}
            >
              {tab.icon}
            </span>
            <motion.span
              initial={false}
              animate={{ width: active ? "auto" : 0, opacity: active ? 1 : 0 }}
              transition={SPRING_LAYOUT}
              className="relative z-10 overflow-hidden whitespace-nowrap text-foreground"
            >
              {tab.label}
            </motion.span>
          </button>
        );
      })}
    </div>
  );
}

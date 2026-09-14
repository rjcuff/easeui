"use client";

import { MotionConfig, motion, useReducedMotion } from "motion/react";
import {
  createContext,
  type KeyboardEvent,
  type ReactNode,
  useCallback,
  useContext,
  useId,
  useMemo,
  useState,
} from "react";
import { cn } from "@/lib/utils";

type Variant = "pill" | "segment" | "underline";

interface TabsContextValue {
  value: string;
  select: (value: string) => void;
  baseId: string;
  variant: Variant;
}

const TabsContext = createContext<TabsContextValue | null>(null);

function useTabs(part: string) {
  const ctx = useContext(TabsContext);
  if (!ctx) throw new Error(`${part} must be used inside <Tabs>`);
  return ctx;
}

const EASE = [0.23, 1, 0.32, 1] as const;
// The indicator glides between tabs. A tween with no bounce, so a scrolling
// tab list never overshoots and flashes a scrollbar.
const INDICATOR_TRANSITION = { duration: 0.2, ease: EASE } as const;

const LIST_CLASS: Record<Variant, string> = {
  pill: "inline-flex items-center gap-1 rounded-full bg-muted p-1",
  segment: "inline-flex items-center gap-0.5 rounded-lg bg-muted p-0.5",
  underline: "flex items-center gap-5 border-b border-border",
};

const TRIGGER_CLASS: Record<Variant, string> = {
  pill: "min-h-9 rounded-full px-3.5",
  segment: "min-h-8 rounded-md px-3",
  underline: "-mb-px min-h-11 px-0.5",
};

const INDICATOR_CLASS: Record<Variant, string> = {
  pill: "absolute inset-0 rounded-full bg-background shadow-[0_1px_2px_rgb(0_0_0/0.12)]",
  segment: "absolute inset-0 rounded-md bg-background shadow-[0_1px_2px_rgb(0_0_0/0.12)]",
  underline: "absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-foreground",
};

export interface TabsProps {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /** Visual style. Default "pill". */
  variant?: Variant;
  className?: string;
  children: ReactNode;
}

export function Tabs({
  value,
  defaultValue,
  onValueChange,
  variant = "pill",
  className,
  children,
}: TabsProps) {
  const [inner, setInner] = useState(defaultValue ?? "");
  const baseId = useId();
  const reduce = useReducedMotion();
  const current = value ?? inner;

  const select = useCallback(
    (next: string) => {
      if (value === undefined) setInner(next);
      onValueChange?.(next);
    },
    [value, onValueChange],
  );

  const ctx = useMemo(
    () => ({ value: current, select, baseId, variant }),
    [current, select, baseId, variant],
  );

  return (
    <TabsContext.Provider value={ctx}>
      <MotionConfig transition={reduce ? { duration: 0 } : INDICATOR_TRANSITION}>
        {/* layoutRoot keeps the indicator measuring inside this component, so a
            fixed or scrolled parent never turns scroll offset into movement. */}
        <motion.div layoutRoot className={className}>
          {children}
        </motion.div>
      </MotionConfig>
    </TabsContext.Provider>
  );
}

const NAV_KEYS = new Set(["ArrowRight", "ArrowLeft", "Home", "End"]);

export function TabsList({ className, children }: { className?: string; children: ReactNode }) {
  const { variant } = useTabs("TabsList");

  // Arrow keys, Home, and End move between tabs and select them.
  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!NAV_KEYS.has(event.key)) return;
    const tabs = Array.from(
      event.currentTarget.querySelectorAll<HTMLButtonElement>('[role="tab"]:not(:disabled)'),
    );
    const index = tabs.indexOf(document.activeElement as HTMLButtonElement);
    if (index < 0) return;
    event.preventDefault();
    const next =
      event.key === "Home"
        ? 0
        : event.key === "End"
          ? tabs.length - 1
          : (index + (event.key === "ArrowRight" ? 1 : -1) + tabs.length) % tabs.length;
    tabs[next].focus();
    tabs[next].click();
  };

  return (
    <div role="tablist" onKeyDown={onKeyDown} className={cn(LIST_CLASS[variant], className)}>
      {children}
    </div>
  );
}

export interface TabsTriggerProps {
  value: string;
  className?: string;
  indicatorClassName?: string;
  children: ReactNode;
}

export function TabsTrigger({ value, className, indicatorClassName, children }: TabsTriggerProps) {
  const ctx = useTabs("TabsTrigger");
  const active = ctx.value === value;

  return (
    <button
      type="button"
      role="tab"
      id={`${ctx.baseId}-tab-${value}`}
      aria-selected={active}
      aria-controls={`${ctx.baseId}-panel-${value}`}
      tabIndex={active || !ctx.value ? 0 : -1}
      onClick={() => ctx.select(value)}
      className={cn(
        "relative inline-flex touch-manipulation items-center justify-center whitespace-nowrap text-sm font-medium outline-none transition-colors duration-150",
        "focus-visible:ring-2 focus-visible:ring-foreground/40",
        TRIGGER_CLASS[ctx.variant],
        active ? "text-foreground" : "text-muted-foreground hover:text-foreground",
        className,
      )}
    >
      {active ? (
        <motion.span
          layoutId={`${ctx.baseId}-indicator`}
          aria-hidden="true"
          className={cn(INDICATOR_CLASS[ctx.variant], indicatorClassName)}
        />
      ) : null}
      <span className="relative">{children}</span>
    </button>
  );
}

export interface TabsContentProps {
  value: string;
  className?: string;
  children: ReactNode;
}

export function TabsContent({ value, className, children }: TabsContentProps) {
  const ctx = useTabs("TabsContent");
  const reduce = useReducedMotion();
  const active = ctx.value === value;

  // Inactive panels stay in the DOM, hidden, so their content is still in the
  // server HTML. The active panel fades in.
  return (
    <motion.div
      role="tabpanel"
      id={`${ctx.baseId}-panel-${value}`}
      aria-labelledby={`${ctx.baseId}-tab-${value}`}
      hidden={!active}
      initial={false}
      animate={{ opacity: active ? 1 : 0 }}
      transition={{ duration: reduce ? 0 : 0.15, ease: EASE }}
      className={cn("mt-4", className)}
    >
      {children}
    </motion.div>
  );
}

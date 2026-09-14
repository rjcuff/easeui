"use client";

import { Check, ChevronDown } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import {
  createContext,
  type KeyboardEvent,
  type ReactNode,
  type RefObject,
  useCallback,
  useContext,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { cn } from "@/lib/utils";

const EASE = [0.23, 1, 0.32, 1] as const;
// The menu opens in 150ms and closes a little faster, scaling a touch from the
// trigger edge so it stays visually connected to the button.
const OPEN = { duration: 0.15, ease: EASE } as const;
const CLOSE = { duration: 0.1, ease: EASE } as const;

interface SelectContextValue {
  value: string | undefined;
  open: boolean;
  setOpen: (open: boolean) => void;
  choose: (value: string) => void;
  labelOf: (value: string | undefined) => string | undefined;
  setLabel: (value: string, label: string) => void;
  triggerRef: RefObject<HTMLButtonElement | null>;
  listRef: RefObject<HTMLDivElement | null>;
  triggerId: string;
  listId: string;
  disabled: boolean;
}

const SelectContext = createContext<SelectContextValue | null>(null);

function useSelect(part: string) {
  const ctx = useContext(SelectContext);
  if (!ctx) throw new Error(`${part} must be used inside <Select>`);
  return ctx;
}

function enabledOptions(list: HTMLElement | null) {
  return Array.from(
    list?.querySelectorAll<HTMLButtonElement>('[role="option"]:not(:disabled)') ?? [],
  );
}

export interface SelectProps {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /** Controlled open state. */
  open?: boolean;
  /** Initial open state when uncontrolled. Default false. */
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  disabled?: boolean;
  className?: string;
  children: ReactNode;
}

export function Select({
  value,
  defaultValue,
  onValueChange,
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  disabled = false,
  className,
  children,
}: SelectProps) {
  const id = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const [innerValue, setInnerValue] = useState(defaultValue);
  const [innerOpen, setInnerOpen] = useState(defaultOpen);
  const [labels, setLabels] = useState<Record<string, string>>({});
  const current = value ?? innerValue;
  const open = openProp ?? innerOpen;

  const setOpen = useCallback(
    (next: boolean) => {
      if (openProp === undefined) setInnerOpen(next);
      onOpenChange?.(next);
    },
    [openProp, onOpenChange],
  );

  const choose = useCallback(
    (next: string) => {
      if (value === undefined) setInnerValue(next);
      onValueChange?.(next);
      setOpen(false);
      triggerRef.current?.focus();
    },
    [value, onValueChange, setOpen],
  );

  const setLabel = useCallback((key: string, label: string) => {
    setLabels((prev) => (prev[key] === label ? prev : { ...prev, [key]: label }));
  }, []);

  // A press anywhere outside the select closes the menu.
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    window.addEventListener("pointerdown", onPointerDown);
    return () => window.removeEventListener("pointerdown", onPointerDown);
  }, [open, setOpen]);

  const ctx = useMemo<SelectContextValue>(
    () => ({
      value: current,
      open,
      setOpen,
      choose,
      labelOf: (key) => (key === undefined ? undefined : labels[key]),
      setLabel,
      triggerRef,
      listRef,
      triggerId: `${id}-trigger`,
      listId: `${id}-list`,
      disabled,
    }),
    [current, open, setOpen, choose, labels, setLabel, id, disabled],
  );

  return (
    <SelectContext.Provider value={ctx}>
      <div ref={rootRef} className={cn("relative", className)}>
        {children}
      </div>
    </SelectContext.Provider>
  );
}

export function SelectTrigger({ className, children }: { className?: string; children: ReactNode }) {
  const s = useSelect("SelectTrigger");

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      s.setOpen(true);
    }
  };

  return (
    <button
      ref={s.triggerRef}
      type="button"
      id={s.triggerId}
      disabled={s.disabled}
      aria-haspopup="listbox"
      aria-expanded={s.open}
      aria-controls={s.listId}
      onClick={() => s.setOpen(!s.open)}
      onKeyDown={onKeyDown}
      className={cn(
        "flex h-10 w-full touch-manipulation items-center justify-between gap-2 rounded-lg bg-background px-3 text-left text-sm text-foreground outline-none",
        "shadow-[0_0_0_1px_var(--border-strong)] transition-shadow duration-150",
        "focus-visible:shadow-[0_0_0_2px_color-mix(in_oklch,var(--foreground)_40%,transparent)]",
        "disabled:pointer-events-none disabled:opacity-50",
        className,
      )}
    >
      {children}
      <ChevronDown
        aria-hidden="true"
        className={cn(
          "h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-150 ease-out",
          s.open && "rotate-180",
        )}
      />
    </button>
  );
}

export function SelectValue({ placeholder, className }: { placeholder?: string; className?: string }) {
  const s = useSelect("SelectValue");
  const label = s.labelOf(s.value);
  return (
    <span className={cn("truncate", label ? "text-foreground" : "text-muted-foreground", className)}>
      {label ?? placeholder ?? "Select"}
    </span>
  );
}

export function SelectContent({ className, children }: { className?: string; children: ReactNode }) {
  const s = useSelect("SelectContent");
  const reduce = useReducedMotion();
  const [placement, setPlacement] = useState<"top" | "bottom">("bottom");
  const { open, triggerRef, listRef } = s;

  // Open upward when there is not enough room below the trigger.
  useLayoutEffect(() => {
    if (!open) return;
    const trigger = triggerRef.current;
    const list = listRef.current;
    if (!trigger || !list) return;
    const rect = trigger.getBoundingClientRect();
    const below = window.innerHeight - rect.bottom;
    setPlacement(below < list.offsetHeight + 16 && rect.top > below ? "top" : "bottom");
  }, [open, triggerRef, listRef]);

  // Move focus into the menu, starting from the chosen option.
  useEffect(() => {
    if (!open) return;
    const items = enabledOptions(listRef.current);
    const start = items.find((item) => item.getAttribute("aria-selected") === "true") ?? items[0];
    start?.focus({ preventScroll: true });
  }, [open, listRef]);

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Escape") {
      event.preventDefault();
      s.setOpen(false);
      triggerRef.current?.focus();
      return;
    }
    if (event.key === "Tab") {
      s.setOpen(false);
      return;
    }
    const items = enabledOptions(listRef.current);
    if (items.length === 0) return;
    const index = items.indexOf(document.activeElement as HTMLButtonElement);
    const next =
      event.key === "ArrowDown"
        ? index + 1
        : event.key === "ArrowUp"
          ? index - 1
          : event.key === "Home"
            ? 0
            : event.key === "End"
              ? items.length - 1
              : null;
    if (next === null) return;
    event.preventDefault();
    items[(next + items.length) % items.length].focus();
  };

  const isTop = placement === "top";

  // Options stay mounted while closed so the trigger always knows each label.
  return (
    <motion.div
      ref={listRef}
      id={s.listId}
      role="listbox"
      aria-labelledby={s.triggerId}
      aria-hidden={!open}
      inert={!open}
      onKeyDown={onKeyDown}
      initial={false}
      animate={
        reduce
          ? { opacity: open ? 1 : 0 }
          : { opacity: open ? 1 : 0, scale: open ? 1 : 0.97 }
      }
      transition={reduce ? { duration: 0 } : open ? OPEN : CLOSE}
      style={{
        transformOrigin: isTop ? "bottom" : "top",
        pointerEvents: open ? "auto" : "none",
      }}
      className={cn(
        "absolute inset-x-0 z-30 flex flex-col gap-0.5 rounded-lg bg-background p-1",
        "shadow-[0_0_0_1px_var(--border-strong),0_12px_24px_-12px_rgb(0_0_0/0.3)]",
        isTop ? "bottom-full mb-1.5" : "top-full mt-1.5",
        className,
      )}
    >
      {children}
    </motion.div>
  );
}

export interface SelectItemProps {
  value: string;
  disabled?: boolean;
  className?: string;
  children: ReactNode;
}

export function SelectItem({ value, disabled = false, className, children }: SelectItemProps) {
  const s = useSelect("SelectItem");
  const selected = s.value === value;
  const label = typeof children === "string" ? children : value;
  const { setLabel } = s;

  useLayoutEffect(() => {
    setLabel(value, label);
  }, [setLabel, value, label]);

  return (
    <button
      type="button"
      role="option"
      aria-selected={selected}
      disabled={disabled}
      tabIndex={-1}
      onClick={() => s.choose(value)}
      className={cn(
        "flex min-h-9 w-full touch-manipulation items-center justify-between gap-2 rounded-md px-2.5 text-left text-sm outline-none transition-colors duration-150",
        selected ? "text-foreground" : "text-muted-foreground",
        "hover:bg-muted hover:text-foreground focus:bg-muted focus:text-foreground",
        "disabled:pointer-events-none disabled:opacity-50",
        className,
      )}
    >
      {children}
      {selected ? <Check aria-hidden="true" className="h-3.5 w-3.5 shrink-0" /> : null}
    </button>
  );
}

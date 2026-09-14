"use client";

import { motion, useReducedMotion } from "motion/react";
import {
  type ButtonHTMLAttributes,
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
// Matches Select: opens in 150ms, closes a little faster.
const OPEN = { duration: 0.15, ease: EASE } as const;
const CLOSE = { duration: 0.1, ease: EASE } as const;

interface DropdownMenuContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
  triggerRef: RefObject<HTMLButtonElement | null>;
  listRef: RefObject<HTMLDivElement | null>;
  triggerId: string;
  listId: string;
}

const DropdownMenuContext = createContext<DropdownMenuContextValue | null>(null);

function useDropdownMenu(part: string) {
  const ctx = useContext(DropdownMenuContext);
  if (!ctx) throw new Error(`${part} must be used inside <DropdownMenu>`);
  return ctx;
}

function enabledItems(list: HTMLElement | null) {
  return Array.from(
    list?.querySelectorAll<HTMLButtonElement>('[role="menuitem"]:not(:disabled)') ?? [],
  );
}

export interface DropdownMenuProps {
  /** Controlled open state. */
  open?: boolean;
  /** Initial open state when uncontrolled. Default false. */
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
  children: ReactNode;
}

export function DropdownMenu({
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  className,
  children,
}: DropdownMenuProps) {
  const id = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const [innerOpen, setInnerOpen] = useState(defaultOpen);
  const open = openProp ?? innerOpen;

  const setOpen = useCallback(
    (next: boolean) => {
      if (openProp === undefined) setInnerOpen(next);
      onOpenChange?.(next);
    },
    [openProp, onOpenChange],
  );

  // A press anywhere outside the menu closes it.
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    window.addEventListener("pointerdown", onPointerDown);
    return () => window.removeEventListener("pointerdown", onPointerDown);
  }, [open, setOpen]);

  const ctx = useMemo<DropdownMenuContextValue>(
    () => ({
      open,
      setOpen,
      triggerRef,
      listRef,
      triggerId: `${id}-trigger`,
      listId: `${id}-menu`,
    }),
    [open, setOpen, id],
  );

  return (
    <DropdownMenuContext.Provider value={ctx}>
      <div ref={rootRef} className={cn("relative inline-block", className)}>
        {children}
      </div>
    </DropdownMenuContext.Provider>
  );
}

export type DropdownMenuTriggerProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "type" | "id" | "onClick" | "onKeyDown"
>;

export function DropdownMenuTrigger({
  className,
  children,
  ...props
}: DropdownMenuTriggerProps) {
  const m = useDropdownMenu("DropdownMenuTrigger");

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      m.setOpen(true);
    }
  };

  return (
    <button
      ref={m.triggerRef}
      type="button"
      id={m.triggerId}
      aria-haspopup="menu"
      aria-expanded={m.open}
      aria-controls={m.listId}
      onClick={() => m.setOpen(!m.open)}
      onKeyDown={onKeyDown}
      className={cn(
        "relative inline-flex h-9 w-9 touch-manipulation items-center justify-center rounded-full text-muted-foreground outline-none transition-colors duration-150",
        "hover:bg-muted hover:text-foreground",
        "focus-visible:ring-2 focus-visible:ring-foreground/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        "disabled:pointer-events-none disabled:opacity-50",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export interface DropdownMenuContentProps {
  /** Which trigger edge the menu hangs from. Default "start". */
  align?: "start" | "end";
  className?: string;
  children: ReactNode;
}

export function DropdownMenuContent({
  align = "start",
  className,
  children,
}: DropdownMenuContentProps) {
  const m = useDropdownMenu("DropdownMenuContent");
  const reduce = useReducedMotion();
  const [placement, setPlacement] = useState<"top" | "bottom">("bottom");
  const { open, triggerRef, listRef } = m;

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

  useEffect(() => {
    if (!open) return;
    enabledItems(listRef.current)[0]?.focus({ preventScroll: true });
  }, [open, listRef]);

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Escape") {
      event.preventDefault();
      m.setOpen(false);
      triggerRef.current?.focus();
      return;
    }
    if (event.key === "Tab") {
      m.setOpen(false);
      return;
    }
    const items = enabledItems(listRef.current);
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

  // Items stay mounted while closed so the exit transition can play.
  return (
    <motion.div
      ref={listRef}
      id={m.listId}
      role="menu"
      aria-labelledby={m.triggerId}
      aria-hidden={!open}
      inert={!open}
      onKeyDown={onKeyDown}
      initial={false}
      animate={reduce ? { opacity: open ? 1 : 0 } : { opacity: open ? 1 : 0, scale: open ? 1 : 0.97 }}
      transition={reduce ? { duration: 0 } : open ? OPEN : CLOSE}
      style={{
        transformOrigin: `${isTop ? "bottom" : "top"} ${align === "end" ? "right" : "left"}`,
        pointerEvents: open ? "auto" : "none",
      }}
      className={cn(
        "absolute z-30 flex min-w-40 flex-col gap-0.5 rounded-lg bg-background p-1",
        "shadow-[0_0_0_1px_var(--border-strong),0_12px_24px_-12px_rgb(0_0_0/0.3)]",
        isTop ? "bottom-full mb-1.5" : "top-full mt-1.5",
        align === "end" ? "right-0" : "left-0",
        className,
      )}
    >
      {children}
    </motion.div>
  );
}

export interface DropdownMenuItemProps {
  onSelect?: () => void;
  disabled?: boolean;
  /** Styles the item for a destructive action, such as Delete. Default false. */
  destructive?: boolean;
  className?: string;
  children: ReactNode;
}

export function DropdownMenuItem({
  onSelect,
  disabled = false,
  destructive = false,
  className,
  children,
}: DropdownMenuItemProps) {
  const m = useDropdownMenu("DropdownMenuItem");

  return (
    <button
      type="button"
      role="menuitem"
      disabled={disabled}
      tabIndex={-1}
      onClick={() => {
        onSelect?.();
        m.setOpen(false);
        m.triggerRef.current?.focus();
      }}
      className={cn(
        "flex min-h-9 w-full touch-manipulation items-center gap-2 rounded-md px-2.5 text-left text-sm outline-none transition-colors duration-150",
        destructive
          ? "text-destructive hover:bg-destructive/10 focus:bg-destructive/10"
          : "text-foreground hover:bg-muted focus:bg-muted",
        "disabled:pointer-events-none disabled:opacity-50",
        className,
      )}
    >
      {children}
    </button>
  );
}

export function DropdownMenuSeparator({ className }: { className?: string }) {
  return <hr className={cn("-mx-1 my-1 border-t border-border", className)} />;
}

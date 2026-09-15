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
// Matches DropdownMenu: opens in 150ms, closes a little faster.
const OPEN = { duration: 0.15, ease: EASE } as const;
const CLOSE = { duration: 0.1, ease: EASE } as const;

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

interface PopoverContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
  triggerRef: RefObject<HTMLButtonElement | null>;
  contentRef: RefObject<HTMLDivElement | null>;
  triggerId: string;
  contentId: string;
}

const PopoverContext = createContext<PopoverContextValue | null>(null);

function usePopover(part: string) {
  const ctx = useContext(PopoverContext);
  if (!ctx) throw new Error(`${part} must be used inside <Popover>`);
  return ctx;
}

export interface PopoverProps {
  /** Controlled open state. */
  open?: boolean;
  /** Initial open state when uncontrolled. Default false. */
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
  children: ReactNode;
}

/**
 * A panel of arbitrary content anchored to a trigger. Opens on click, not
 * hover, and flips above the trigger when there's no room below.
 */
export function Popover({
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  className,
  children,
}: PopoverProps) {
  const id = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [innerOpen, setInnerOpen] = useState(defaultOpen);
  const open = openProp ?? innerOpen;

  const setOpen = useCallback(
    (next: boolean) => {
      if (openProp === undefined) setInnerOpen(next);
      onOpenChange?.(next);
    },
    [openProp, onOpenChange],
  );

  // A press anywhere outside the popover closes it.
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    window.addEventListener("pointerdown", onPointerDown);
    return () => window.removeEventListener("pointerdown", onPointerDown);
  }, [open, setOpen]);

  // Moves focus into the content, onto its first focusable element.
  useEffect(() => {
    if (!open) return;
    contentRef.current?.querySelector<HTMLElement>(FOCUSABLE)?.focus();
  }, [open]);

  const ctx = useMemo<PopoverContextValue>(
    () => ({
      open,
      setOpen,
      triggerRef,
      contentRef,
      triggerId: `${id}-trigger`,
      contentId: `${id}-content`,
    }),
    [open, setOpen, id],
  );

  return (
    <PopoverContext.Provider value={ctx}>
      <div ref={rootRef} className={cn("relative inline-block", className)}>
        {children}
      </div>
    </PopoverContext.Provider>
  );
}

export type PopoverTriggerProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "type" | "id" | "onClick" | "onKeyDown"
>;

export function PopoverTrigger({ className, children, ...props }: PopoverTriggerProps) {
  const p = usePopover("PopoverTrigger");

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === "ArrowDown" && !p.open) {
      event.preventDefault();
      p.setOpen(true);
    }
  };

  return (
    <button
      ref={p.triggerRef}
      type="button"
      id={p.triggerId}
      aria-haspopup="dialog"
      aria-expanded={p.open}
      aria-controls={p.contentId}
      onClick={() => p.setOpen(!p.open)}
      onKeyDown={onKeyDown}
      className={className}
      {...props}
    >
      {children}
    </button>
  );
}

export interface PopoverContentProps {
  /** Which trigger edge the panel hangs from. Default "bottom". */
  side?: "top" | "bottom";
  /** Which trigger edge the panel aligns to. Default "start". */
  align?: "start" | "end";
  className?: string;
  children: ReactNode;
}

export function PopoverContent({ side = "bottom", align = "start", className, children }: PopoverContentProps) {
  const p = usePopover("PopoverContent");
  const reduce = useReducedMotion();
  const [placement, setPlacement] = useState<"top" | "bottom">(side);
  const { open, triggerRef, contentRef } = p;

  // Opens upward when there is not enough room below the trigger.
  useLayoutEffect(() => {
    if (!open) return;
    const trigger = triggerRef.current;
    const content = contentRef.current;
    if (!trigger || !content) return;
    const rect = trigger.getBoundingClientRect();
    const below = window.innerHeight - rect.bottom;
    setPlacement(below < content.offsetHeight + 16 && rect.top > below ? "top" : side);
  }, [open, side, triggerRef, contentRef]);

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "Escape") return;
    event.preventDefault();
    p.setOpen(false);
    p.triggerRef.current?.focus();
  };

  const isTop = placement === "top";

  // Stays mounted while closed so the exit transition can play.
  return (
    <motion.div
      ref={contentRef}
      id={p.contentId}
      role="dialog"
      aria-labelledby={p.triggerId}
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
        "absolute z-30 min-w-56 max-w-[calc(100vw-2rem)] rounded-2xl bg-background p-4",
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

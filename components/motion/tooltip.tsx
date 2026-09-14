"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  cloneElement,
  isValidElement,
  type PointerEvent,
  type ReactElement,
  type ReactNode,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import { cn } from "@/lib/utils";

type Side = "top" | "bottom" | "left" | "right";

export interface TooltipProps {
  content: ReactNode;
  /** The element the tooltip describes. */
  children: ReactNode;
  /** Which side of the trigger the tooltip appears on. Default "top". */
  side?: Side;
  /** Milliseconds to wait before the first tooltip opens. Default 200. */
  delay?: number;
  className?: string;
  wrapperClassName?: string;
}

const EASE = [0.23, 1, 0.32, 1] as const;

// After one tooltip closes, others open at once with no animation for a short
// window, so moving along a toolbar feels instant.
const WARM_MS = 400;
let lastClosedAt = 0;

const POSITION: Record<Side, string> = {
  top: "bottom-full left-1/2 mb-2 -translate-x-1/2",
  bottom: "top-full left-1/2 mt-2 -translate-x-1/2",
  left: "right-full top-1/2 mr-2 -translate-y-1/2",
  right: "left-full top-1/2 ml-2 -translate-y-1/2",
};

const ORIGIN: Record<Side, string> = {
  top: "bottom center",
  bottom: "top center",
  left: "center right",
  right: "center left",
};

export function Tooltip({
  content,
  children,
  side = "top",
  delay = 200,
  className,
  wrapperClassName,
}: TooltipProps) {
  const [open, setOpen] = useState(false);
  const [instant, setInstant] = useState(false);
  const id = useId();
  const reduce = useReducedMotion();
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const openRef = useRef(false);
  openRef.current = open;

  const clear = useCallback(() => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = null;
  }, []);

  const show = useCallback(() => {
    clear();
    if (Date.now() - lastClosedAt < WARM_MS) {
      setInstant(true);
      setOpen(true);
      return;
    }
    setInstant(false);
    timer.current = setTimeout(() => setOpen(true), delay);
  }, [clear, delay]);

  const hide = useCallback(() => {
    clear();
    if (openRef.current) lastClosedAt = Date.now();
    setOpen(false);
  }, [clear]);

  useEffect(() => clear, [clear]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") hide();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, hide]);

  const trigger = isValidElement(children)
    ? cloneElement(children as ReactElement<Record<string, unknown>>, {
        "aria-describedby": open ? id : undefined,
      })
    : children;

  const skipMotion = reduce || instant;

  return (
    // biome-ignore lint/a11y/noStaticElementInteractions: the wrapper only observes hover and focus on the trigger it contains.
    <span
      className={cn("relative inline-flex", wrapperClassName)}
      // Hover opens only for a real mouse, so a tap on a phone never sticks a tooltip open.
      onPointerEnter={(event: PointerEvent) => {
        if (event.pointerType === "mouse") show();
      }}
      onPointerLeave={hide}
      onFocus={show}
      onBlur={hide}
    >
      {trigger}
      <AnimatePresence>
        {open ? (
          <motion.span
            role="tooltip"
            id={id}
            initial={skipMotion ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, transition: { duration: reduce ? 0 : 0.08, ease: EASE } }}
            transition={{ duration: skipMotion ? 0 : 0.12, ease: EASE }}
            style={{ transformOrigin: ORIGIN[side] }}
            className={cn(
              "pointer-events-none absolute z-50 whitespace-nowrap rounded-md bg-foreground px-2 py-1 text-xs font-medium text-background shadow-md",
              POSITION[side],
              className,
            )}
          >
            {content}
          </motion.span>
        ) : null}
      </AnimatePresence>
    </span>
  );
}

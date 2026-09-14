"use client";

import { Check } from "lucide-react";
import {
  type KeyboardEvent,
  type PointerEvent,
  type ReactNode,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import { cn } from "@/lib/utils";

/** How long the confirmed state stays before the button resets, in ms. */
const RESET_MS = 2000;
const EASE_OUT = "cubic-bezier(0.23, 1, 0.32, 1)";

type HoldState = "idle" | "holding" | "done";

export interface HoldToConfirmProps {
  /** Runs once the hold completes. */
  onConfirm: () => void;
  /** Button label, such as "Hold to delete". */
  children: ReactNode;
  /** Label shown with a check after confirming. Default "Done". */
  confirmedLabel?: ReactNode;
  /** How long to hold, in ms. Default 1500. */
  duration?: number;
  disabled?: boolean;
  className?: string;
}

const LABEL =
  "col-start-1 row-start-1 inline-flex items-center justify-center gap-1.5 whitespace-nowrap transition-[opacity,scale] duration-200 ease-out motion-reduce:transition-none";

/**
 * Both labels share one grid cell, so the button is always as wide as the
 * longer one and never jumps in size. They trade places with a crossfade.
 */
function Labels({ done, idle, confirmed }: { done: boolean; idle: ReactNode; confirmed: ReactNode }) {
  return (
    <span className="grid">
      <span aria-hidden={done} className={cn(LABEL, done ? "scale-[0.97] opacity-0" : "opacity-100")}>
        {idle}
      </span>
      <span aria-hidden={!done} className={cn(LABEL, done ? "opacity-100" : "scale-[0.97] opacity-0")}>
        <Check aria-hidden="true" className="h-4 w-4" />
        {confirmed}
      </span>
    </span>
  );
}

export function HoldToConfirm({
  onConfirm,
  children,
  confirmedLabel = "Done",
  duration = 1500,
  disabled,
  className,
}: HoldToConfirmProps) {
  const hintId = useId();
  const [state, setState] = useState<HoldState>("idle");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  const start = () => {
    if (disabled || state !== "idle") return;
    setState("holding");
    timer.current = setTimeout(() => {
      setState("done");
      onConfirm();
      timer.current = setTimeout(() => setState("idle"), RESET_MS);
    }, duration);
  };

  const release = () => {
    if (state !== "holding") return;
    if (timer.current) clearTimeout(timer.current);
    timer.current = null;
    setState("idle");
  };

  const isConfirmKey = (event: KeyboardEvent) => event.key === " " || event.key === "Enter";
  const done = state === "done";

  // Holding fills at a steady rate so progress reads honestly. Letting go early drains fast,
  // and the reset after confirming drains a little slower so the change never feels abrupt.
  const fillTransition =
    state === "holding"
      ? `clip-path ${duration}ms linear`
      : `clip-path ${done ? 150 : 300}ms ${EASE_OUT}`;

  return (
    <>
      <button
        type="button"
        disabled={disabled}
        aria-describedby={hintId}
        data-state={state}
        onPointerDown={(event: PointerEvent<HTMLButtonElement>) => {
          if (event.button !== 0) return;
          // Keep receiving the release even if the finger slides off the button.
          event.currentTarget.setPointerCapture(event.pointerId);
          start();
        }}
        onPointerUp={release}
        onPointerCancel={release}
        onKeyDown={(event) => {
          if (!isConfirmKey(event) || event.repeat) return;
          event.preventDefault();
          start();
        }}
        onKeyUp={(event) => {
          if (!isConfirmKey(event)) return;
          event.preventDefault();
          release();
        }}
        // A long press on touch screens would otherwise open the context menu.
        onContextMenu={(event) => event.preventDefault()}
        className={cn(
          "relative inline-flex h-10 touch-manipulation select-none items-center justify-center overflow-hidden rounded-full bg-card px-5 text-sm font-medium text-foreground outline-none [-webkit-touch-callout:none]",
          "shadow-[0_0_0_1px_var(--border-strong)] transition-[scale] duration-150 ease-out active:scale-[0.97] motion-reduce:active:scale-100",
          "focus-visible:ring-2 focus-visible:ring-foreground/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          "disabled:pointer-events-none disabled:opacity-50",
          done && "pointer-events-none",
          className,
        )}
      >
        <Labels done={done} idle={children} confirmed={confirmedLabel} />
        {/* The fill is a copy of the labels in the accent color, revealed left to right. */}
        <span
          aria-hidden="true"
          className="absolute inset-0 flex items-center justify-center bg-accent px-5 text-accent-foreground"
          style={{
            clipPath: state === "idle" ? "inset(0 100% 0 0)" : "inset(0 0 0 0)",
            transition: fillTransition,
          }}
        >
          <Labels done={done} idle={children} confirmed={confirmedLabel} />
        </span>
      </button>
      <span id={hintId} className="sr-only">
        Press and hold to confirm
      </span>
      <span aria-live="polite" className="sr-only">
        {done ? confirmedLabel : null}
      </span>
    </>
  );
}

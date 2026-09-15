"use client";

import { RefreshCw } from "lucide-react";
import { type PointerEvent as ReactPointerEvent, type ReactNode, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

const EASE = "cubic-bezier(0.23, 1, 0.32, 1)";
const SETTLE_MS = 220;
/** Pull distance, in px, that arms a refresh on release. */
const TRIGGER = 64;
/** How far the indicator can still be dragged past the trigger, resisting more with distance. */
const MAX_PULL = 96;

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);
  return reduced;
}

export interface PullToRefreshProps {
  /** Called on release past the trigger distance. The indicator keeps spinning until it resolves. */
  onRefresh: () => Promise<void> | void;
  /** The scrollable content. Give this element a height through className. */
  children: ReactNode;
  className?: string;
}

/**
 * A pull-down-to-refresh gesture over scrollable content: the indicator
 * tracks the finger 1:1, then resists past the trigger distance. Only
 * starts when the content is already scrolled to the top.
 */
export function PullToRefresh({ onRefresh, children, className }: PullToRefreshProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const [drag, setDrag] = useState<{ startY: number } | null>(null);
  const [pull, setPull] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (refreshing || (scrollRef.current?.scrollTop ?? 0) > 0) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    setDrag({ startY: event.clientY });
  };

  const onPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!drag) return;
    const raw = event.clientY - drag.startY;
    if (raw <= 0) {
      setPull(0);
      return;
    }
    // Tracks 1:1 up to the trigger distance, then resists.
    const eased = raw <= TRIGGER ? raw : TRIGGER + (raw - TRIGGER) * 0.35;
    setPull(Math.min(eased, MAX_PULL));
  };

  const onPointerUp = () => {
    if (!drag) return;
    const armed = pull >= TRIGGER;
    setDrag(null);
    if (armed) {
      setPull(TRIGGER);
      setRefreshing(true);
      Promise.resolve(onRefresh()).finally(() => {
        setRefreshing(false);
        setPull(0);
      });
    } else {
      setPull(0);
    }
  };

  const dragging = drag !== null;
  const armed = pull >= TRIGGER;
  const transition = dragging || reduceMotion ? "none" : `transform ${SETTLE_MS}ms ${EASE}`;
  const spin = Math.min(pull / TRIGGER, 1) * 180;

  return (
    <div className={cn("relative overflow-hidden rounded-2xl", className)}>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 flex justify-center pt-3"
        style={{ transform: `translateY(${Math.min(pull, TRIGGER) - TRIGGER}px)`, opacity: Math.min(1, pull / 24), transition }}
      >
        <span
          className={cn(
            "flex h-8 w-8 items-center justify-center rounded-full bg-background text-muted-foreground shadow-[0_0_0_1px_var(--border-strong)] transition-colors duration-150",
            armed && "text-accent",
          )}
        >
          <RefreshCw
            className={cn("h-4 w-4", refreshing && "animate-spin")}
            style={refreshing ? undefined : { transform: `rotate(${spin}deg)`, transition }}
          />
        </span>
      </div>
      <div
        ref={scrollRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        style={{ transform: `translateY(${pull}px)`, transition }}
        className="overflow-y-auto overscroll-y-contain"
      >
        {children}
      </div>
    </div>
  );
}

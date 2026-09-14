"use client";

import { CircleAlert, CircleCheck, X } from "lucide-react";
import {
  type CSSProperties,
  type PointerEvent,
  type ReactNode,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { cn } from "@/lib/utils";

export type ToastTone = "neutral" | "success" | "error";

export interface ToastAction {
  label: string;
  onClick: () => void;
}

export interface ToastOptions {
  /** Second line with more detail. */
  description?: string;
  /** Adds a status icon. Default "neutral". */
  tone?: ToastTone;
  /** Time on screen in ms. By default it is worked out from the word count. */
  duration?: number;
  /** One button, such as Undo. Pressing it also closes the toast. */
  action?: ToastAction;
}

type ToastItem = {
  id: number;
  title: string;
  description?: string;
  tone: ToastTone;
  duration: number;
  action?: ToastAction;
  closing: boolean;
  swiped: boolean;
};

/** Cards visible in the stack. Older ones wait out of sight until there is room. */
const VISIBLE = 3;
/** Older toasts are closed once this many are waiting. */
const MAX_QUEUED = 8;
/** Space between cards when the stack is spread out. */
const GAP = 10;
/** How far each card behind the front one peeks out above it. */
const PEEK = 12;
/** How much smaller each card behind the front one is. */
const SCALE_STEP = 0.05;
const MOVE_MS = 400;
/** Exits are quicker than entrances. */
const EXIT_MS = 200;
/** Drag distance, in px, that dismisses a toast. */
const SWIPE_DISTANCE = 45;
/** Drag speed, in px per ms, that dismisses a toast even when the drag is short. */
const SWIPE_VELOCITY = 0.11;
const EASE_OUT = "cubic-bezier(0.23, 1, 0.32, 1)";
/** An average reading speed, in words per minute. */
const READING_WPM = 220;

let items: ToastItem[] = [];
let nextId = 0;
const listeners = new Set<() => void>();
const EMPTY: ToastItem[] = [];

function emit() {
  for (const listener of listeners) listener();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/** Long enough to read the message once at a normal pace, plus a moment to notice it. */
function readingTime(text: string) {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.min(10_000, Math.max(3000, 1500 + (words / READING_WPM) * 60_000));
}

function dismiss(id: number, swiped = false) {
  if (!items.some((item) => item.id === id && !item.closing)) return;
  items = items.map((item) => (item.id === id ? { ...item, closing: true, swiped } : item));
  emit();
  setTimeout(() => {
    items = items.filter((item) => item.id !== id);
    emit();
  }, EXIT_MS);
}

function show(title: string, options: ToastOptions = {}) {
  nextId += 1;
  const { description, tone = "neutral", action } = options;
  const duration = options.duration ?? readingTime(`${title} ${description ?? ""}`);
  items = [
    ...items,
    { id: nextId, title, description, tone, duration, action, closing: false, swiped: false },
  ];
  emit();
  const open = items.filter((item) => !item.closing);
  for (const item of open.slice(0, Math.max(0, open.length - MAX_QUEUED))) dismiss(item.id);
  return nextId;
}

/** Shows a toast and returns its id. Render one Toaster somewhere in the app. */
export const toast = Object.assign(show, {
  success: (title: string, options?: Omit<ToastOptions, "tone">) =>
    show(title, { ...options, tone: "success" }),
  error: (title: string, options?: Omit<ToastOptions, "tone">) =>
    show(title, { ...options, tone: "error" }),
  dismiss: (id: number) => dismiss(id),
});

function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false);
  useEffect(() => {
    const list = window.matchMedia(query);
    const update = () => setMatches(list.matches);
    update();
    list.addEventListener("change", update);
    return () => list.removeEventListener("change", update);
  }, [query]);
  return matches;
}

/** True while the tab is in the background. */
function useDocumentHidden() {
  const [hidden, setHidden] = useState(false);
  useEffect(() => {
    const update = () => setHidden(document.hidden);
    update();
    document.addEventListener("visibilitychange", update);
    return () => document.removeEventListener("visibilitychange", update);
  }, []);
  return hidden;
}

const TONE_ICON: Record<ToastTone, ReactNode> = {
  neutral: null,
  success: <CircleCheck aria-hidden="true" className="mt-px h-4 w-4 shrink-0 text-success" />,
  error: <CircleAlert aria-hidden="true" className="mt-px h-4 w-4 shrink-0 text-destructive" />,
};

type Slot = {
  /** 0 is the newest card, at the front of the stack. */
  index: number;
  /** Distance from the bottom when the stack is spread out, in px. */
  offset: number;
};

type CardProps = {
  item: ToastItem;
  slot: Slot | undefined;
  expanded: boolean;
  height: number | undefined;
  frontHeight: number;
  paused: boolean;
  reduceMotion: boolean;
  onHeight: (id: number, height: number) => void;
};

function ToastCard({
  item,
  slot,
  expanded,
  height,
  frontHeight,
  paused,
  reduceMotion,
  onHeight,
}: CardProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const remaining = useRef(item.duration);
  // A closing card has no slot any more, so it stays where it was while it leaves.
  const lastSlot = useRef<Slot>({ index: 0, offset: 0 });
  if (slot) lastSlot.current = slot;
  const { index, offset } = lastSlot.current;

  const [mounted, setMounted] = useState(false);
  const [drag, setDrag] = useState<{ startY: number; startedAt: number; y: number } | null>(null);
  const [swipeY, setSwipeY] = useState(0);

  // Mount below the stack first, then move into place on the next frame so the entrance transitions.
  useEffect(() => {
    const frame = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  // Report the natural height, measured on the content so a clipped card still reports its full size.
  useLayoutEffect(() => {
    const content = contentRef.current;
    if (!content) return;
    const report = () => onHeight(item.id, content.offsetHeight);
    report();
    const observer = new ResizeObserver(report);
    observer.observe(content);
    return () => observer.disconnect();
  }, [item.id, onHeight]);

  // The countdown only runs while nobody is reading or dragging. Pausing keeps the time that is left.
  const dragging = drag !== null;
  useEffect(() => {
    if (paused || dragging || item.closing) return;
    const startedAt = Date.now();
    const timeout = setTimeout(() => dismiss(item.id), remaining.current);
    return () => {
      clearTimeout(timeout);
      remaining.current -= Date.now() - startedAt;
    };
  }, [paused, dragging, item.closing, item.id]);

  const onPointerDown = (event: PointerEvent<HTMLLIElement>) => {
    if (item.closing || event.button !== 0) return;
    if ((event.target as HTMLElement).closest("button")) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    setDrag({ startY: event.clientY, startedAt: Date.now(), y: 0 });
  };

  const onPointerMove = (event: PointerEvent<HTMLLIElement>) => {
    if (!drag) return;
    const raw = event.clientY - drag.startY;
    // Down follows the finger. Up resists, since there is nowhere to go.
    setDrag({ ...drag, y: raw > 0 ? raw : -Math.sqrt(-raw) });
  };

  const onPointerUp = () => {
    if (!drag) return;
    const velocity = drag.y / Math.max(1, Date.now() - drag.startedAt);
    if (drag.y > SWIPE_DISTANCE || (drag.y > 8 && velocity > SWIPE_VELOCITY)) {
      setSwipeY(drag.y);
      dismiss(item.id, true);
    }
    setDrag(null);
  };

  const front = index === 0;
  const hidden = index >= VISIBLE;
  const lift = expanded ? offset : index * PEEK;
  const scale = expanded ? 1 : 1 - index * SCALE_STEP;

  let transform = `translateY(${-lift + (drag?.y ?? 0)}px) scale(${scale})`;
  let opacity = hidden ? 0 : 1;
  if (!mounted) {
    transform = "translateY(100%)";
    opacity = 0;
  } else if (item.closing) {
    transform = item.swiped
      ? `translateY(calc(${-lift + swipeY}px + 100%))`
      : `translateY(${-lift}px) translateY(${front ? "50%" : "0px"}) scale(${scale})`;
    opacity = 0;
  }

  const duration = item.closing ? EXIT_MS : MOVE_MS;
  const style: CSSProperties = {
    transform,
    opacity,
    // Cards behind the front one take its height while stacked, so the stack stays tidy.
    height: height === undefined ? undefined : expanded || front ? height : frontHeight,
    zIndex: VISIBLE * 10 - index,
    transition:
      dragging || reduceMotion
        ? "none"
        : `transform ${duration}ms ${EASE_OUT}, opacity ${duration}ms ${EASE_OUT}, height ${MOVE_MS}ms ${EASE_OUT}`,
  };

  return (
    <li
      data-front={front}
      aria-hidden={hidden || undefined}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={() => setDrag(null)}
      style={style}
      className={cn(
        "absolute inset-x-0 bottom-0 origin-bottom touch-none select-none overflow-hidden rounded-2xl bg-background",
        "shadow-[0_0_0_1px_var(--border-strong),0_10px_30px_-12px_rgb(0_0_0/0.3)]",
        (hidden || item.closing) && "pointer-events-none",
      )}
    >
      <div
        ref={contentRef}
        className={cn(
          "flex items-start gap-3 py-3 pl-4 pr-2 transition-opacity duration-200 ease-out",
          !expanded && !front && "opacity-0",
        )}
      >
        {TONE_ICON[item.tone]}
        <div className="min-w-0 flex-1 text-sm">
          <p className="font-medium text-foreground">{item.title}</p>
          {item.description ? (
            <p className="mt-0.5 text-pretty text-muted-foreground">{item.description}</p>
          ) : null}
        </div>
        {item.action ? (
          <button
            type="button"
            onClick={() => {
              item.action?.onClick();
              dismiss(item.id);
            }}
            className="inline-flex h-7 shrink-0 items-center rounded-full bg-foreground px-3 text-xs font-medium text-background transition-[background-color,scale] duration-150 ease-out hover:bg-foreground/85 active:scale-[0.97]"
          >
            {item.action.label}
          </button>
        ) : null}
        <button
          type="button"
          aria-label="Dismiss"
          onClick={() => dismiss(item.id)}
          className="relative inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors duration-150 after:absolute after:-inset-1.5 hover:bg-muted hover:text-foreground"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    </li>
  );
}

/**
 * Where toasts appear. New toasts slide up from the bottom and push older ones
 * back into a stack. Hovering spreads the stack out and pauses every countdown,
 * and so does leaving the tab. Swipe a toast down to dismiss it.
 */
export function Toaster({ className }: { className?: string }) {
  const toasts = useSyncExternalStore(subscribe, () => items, () => EMPTY);
  const hiddenTab = useDocumentHidden();
  const reduceMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const [expanded, setExpanded] = useState(false);
  const [heights, setHeights] = useState<Record<number, number>>({});

  const onHeight = useCallback((id: number, height: number) => {
    setHeights((prev) => (prev[id] === height ? prev : { ...prev, [id]: height }));
  }, []);

  const open = toasts.filter((item) => !item.closing).reverse();
  const slots = new Map<number, Slot>();
  let offset = 0;
  open.forEach((item, index) => {
    slots.set(item.id, { index, offset });
    offset += (heights[item.id] ?? 0) + GAP;
  });

  const frontHeight = open[0] ? (heights[open[0].id] ?? 0) : 0;
  const shown = open.slice(0, VISIBLE);
  const spreadHeight =
    shown.reduce((sum, item) => sum + (heights[item.id] ?? 0), 0) +
    GAP * Math.max(0, shown.length - 1);

  // Collapse once the last toast is gone, so the next one starts stacked.
  useEffect(() => {
    if (open.length === 0) setExpanded(false);
  }, [open.length]);

  return (
    <section aria-label="Notifications">
      <ol
        aria-live="polite"
        onPointerEnter={(event) => {
          if (event.pointerType === "mouse") setExpanded(true);
        }}
        onPointerLeave={() => setExpanded(false)}
        // A tap spreads the stack on touch screens, where there is no hover.
        onPointerDown={(event) => {
          if (event.pointerType !== "mouse") setExpanded(true);
        }}
        style={{ height: expanded ? spreadHeight : frontHeight }}
        className={cn(
          "fixed bottom-4 right-4 z-[400] w-[min(22rem,calc(100vw-2rem))]",
          toasts.length === 0 && "pointer-events-none",
          className,
        )}
      >
        {toasts.map((item) => (
          <ToastCard
            key={item.id}
            item={item}
            slot={slots.get(item.id)}
            expanded={expanded}
            height={heights[item.id]}
            frontHeight={frontHeight}
            paused={expanded || hiddenTab}
            reduceMotion={reduceMotion}
            onHeight={onHeight}
          />
        ))}
      </ol>
    </section>
  );
}

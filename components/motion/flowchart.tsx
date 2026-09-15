"use client";

import { type PointerEvent as ReactPointerEvent, type ReactNode, useLayoutEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export interface FlowStep {
  id: string;
  /** Small label above the card, such as "Trigger" or "Action". */
  kind?: string;
  title: string;
  description?: string;
  icon?: ReactNode;
}

export interface FlowchartProps {
  /** Stacked top to bottom by default; drag a card anywhere on the canvas. */
  steps: FlowStep[];
  className?: string;
}

const GAP = 64;
const PAD = 24;
const EST_HEIGHT = 76;
const CARD_WIDTH = 256;
/** Pointer movement, in px, before a press counts as a drag rather than a click. */
const DRAG_THRESHOLD = 3;

type Offset = { dx: number; dy: number };
type DragState = { id: string; startX: number; startY: number; baseDx: number; baseDy: number; moved: boolean };

/**
 * A sequence of steps on a dotted canvas, connected by curves that measure
 * the actual rendered cards. Each card can be dragged anywhere on the
 * canvas and the connector follows it live; click a card (without dragging
 * it) to light up the connectors on either side of it.
 */
export function Flowchart({ steps, className }: FlowchartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [containerWidth, setContainerWidth] = useState(0);
  const [heights, setHeights] = useState<number[]>(() => steps.map(() => EST_HEIGHT));
  const [offsets, setOffsets] = useState<Record<string, Offset>>({});
  const [selected, setSelected] = useState<string | null>(null);
  const dragRef = useRef<DragState | null>(null);

  // steps.length is never read directly, but a changed step count means new
  // cards to observe, so the effect needs to re-run and re-attach.
  // biome-ignore lint/correctness/useExhaustiveDependencies: steps.length is intentional, see comment above.
  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const measure = () => {
      setContainerWidth(container.clientWidth);
      setHeights((previous) =>
        cardRefs.current.map((card, index) => {
          const measured = card?.offsetHeight;
          return measured && measured > 0 ? measured : (previous[index] ?? EST_HEIGHT);
        }),
      );
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(container);
    for (const card of cardRefs.current) {
      if (card) observer.observe(card);
    }
    return () => observer.disconnect();
  }, [steps.length]);

  // Where each card sits before any dragging: stacked with a gap for the connector to arc through.
  const baseTops: number[] = [];
  steps.forEach((_, index) => {
    baseTops[index] = index === 0 ? PAD : baseTops[index - 1] + heights[index - 1] + GAP;
  });
  const canvasHeight = (baseTops.at(-1) ?? PAD) + (heights.at(-1) ?? EST_HEIGHT) + PAD;
  const centerX = containerWidth / 2;

  const positionOf = (index: number) => {
    const offset = offsets[steps[index].id];
    return { x: centerX + (offset?.dx ?? 0), top: baseTops[index] + (offset?.dy ?? 0) };
  };

  const onPointerDown = (id: string) => (event: ReactPointerEvent<HTMLDivElement>) => {
    const offset = offsets[id];
    dragRef.current = {
      id,
      startX: event.clientX,
      startY: event.clientY,
      baseDx: offset?.dx ?? 0,
      baseDy: offset?.dy ?? 0,
      moved: false,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const onPointerMove = (id: string, index: number) => (event: ReactPointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.id !== id) return;
    const dx = drag.baseDx + event.clientX - drag.startX;
    const dy = drag.baseDy + event.clientY - drag.startY;
    if (!drag.moved && Math.hypot(dx - drag.baseDx, dy - drag.baseDy) < DRAG_THRESHOLD) return;
    drag.moved = true;

    // Keep the card inside the canvas.
    const halfWidth = CARD_WIDTH / 2;
    const clampedDx = Math.min(Math.max(dx, halfWidth + PAD - centerX), containerWidth - halfWidth - PAD - centerX);
    const height = heights[index] ?? EST_HEIGHT;
    const clampedDy = Math.min(
      Math.max(dy, PAD - baseTops[index]),
      canvasHeight - PAD - height - baseTops[index],
    );
    setOffsets((current) => ({ ...current, [id]: { dx: clampedDx, dy: clampedDy } }));
  };

  const onPointerUp = (id: string) => () => {
    const drag = dragRef.current;
    if (drag?.id !== id) return;
    // A real drag shouldn't also toggle selection on release, but the click
    // still needs to see `moved`, so clear the ref one tick later.
    if (drag.moved) setTimeout(() => { dragRef.current = null; }, 0);
    else dragRef.current = null;
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative w-full touch-none select-none overflow-hidden rounded-2xl bg-card shadow-[0_0_0_1px_var(--border)]",
        className,
      )}
      style={{
        height: canvasHeight,
        backgroundImage: "radial-gradient(var(--border-strong) 1px, transparent 1.25px)",
        backgroundSize: "20px 20px",
      }}
    >
      <svg aria-hidden="true" className="pointer-events-none absolute inset-0 h-full w-full">
        {steps.slice(1).map((step, index) => {
          const from = positionOf(index);
          const to = positionOf(index + 1);
          const fromBottom = from.top + (heights[index] ?? EST_HEIGHT);
          const lit = selected === steps[index].id || selected === step.id;
          const bend = Math.min(Math.max((to.top - fromBottom) * 0.6, 16), 48);
          return (
            <path
              key={step.id}
              d={`M ${from.x} ${fromBottom} C ${from.x} ${fromBottom + bend}, ${to.x} ${to.top - bend}, ${to.x} ${to.top}`}
              fill="none"
              stroke={lit ? "var(--accent)" : "var(--border-strong)"}
              strokeWidth={1.5}
              className="transition-[stroke] duration-150"
            />
          );
        })}
      </svg>

      {steps.map((step, index) => {
        const { x, top } = positionOf(index);
        const active = selected === step.id;
        return (
          <div
            key={step.id}
            onPointerDown={onPointerDown(step.id)}
            onPointerMove={onPointerMove(step.id, index)}
            onPointerUp={onPointerUp(step.id)}
            className="absolute flex -translate-x-1/2 cursor-grab touch-none flex-col items-center gap-1.5 active:cursor-grabbing"
            style={{ left: x, top, width: CARD_WIDTH, zIndex: dragRef.current?.id === step.id ? 2 : 1 }}
          >
            {step.kind ? (
              <span className="rounded-md bg-accent/10 px-2 py-0.5 text-xs font-medium text-accent">
                {step.kind}
              </span>
            ) : null}
            <button
              type="button"
              ref={(el) => {
                cardRefs.current[index] = el;
              }}
              onClick={() => {
                if (dragRef.current?.moved) return;
                setSelected((current) => (current === step.id ? null : step.id));
              }}
              aria-pressed={active}
              className={cn(
                "flex w-full items-center gap-3 rounded-2xl bg-background p-3 text-left outline-none transition-shadow duration-150",
                active
                  ? "shadow-[0_0_0_1.5px_var(--accent)]"
                  : "shadow-[0_0_0_1px_var(--border)] hover:shadow-[0_0_0_1px_var(--border-strong)]",
              )}
            >
              {step.icon ? (
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
                  {step.icon}
                </span>
              ) : null}
              <span className="min-w-0">
                <span className="block truncate text-sm font-semibold text-foreground">{step.title}</span>
                {step.description ? (
                  <span className="mt-0.5 block text-pretty text-xs leading-snug text-muted-foreground">
                    {step.description}
                  </span>
                ) : null}
              </span>
            </button>
          </div>
        );
      })}
    </div>
  );
}

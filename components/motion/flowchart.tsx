"use client";

import { Check, ChevronDown } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import {
  type MouseEvent as ReactMouseEvent,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { Badge, type BadgeVariant } from "@/components/motion/badge";
import { EASE_OUT } from "@/lib/ease";
import { cn } from "@/lib/utils";

/** One dropdown chip inside a condition clause: its current value and the choices it offers. */
export interface ConditionField {
  value: string;
  options: string[];
}

export interface ConditionClause {
  id: string;
  /** "if" for the first clause in a step, "and" for every clause after it. */
  connector: "if" | "and";
  /** The record a comparison reads from, shown as a small chip, e.g. "order". */
  source: string;
  property: ConditionField;
  value: ConditionField;
}

export interface FlowStep {
  id: string;
  /** Small label above the card, such as "Trigger" or "If / Else". */
  kind?: string;
  /** Color treatment for the kind pill and icon tint. Default "accent". */
  kindVariant?: BadgeVariant;
  title?: string;
  description?: string;
  icon?: ReactNode;
  /** Renders an editable if/else condition list instead of the title and description. */
  condition?: ConditionClause[];
  /** Card width in px. Default 256, or 340 for a condition card. */
  width?: number;
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
const CONDITION_WIDTH = 340;
/** Pointer movement, in px, before a press counts as a drag rather than a click. */
const DRAG_THRESHOLD = 3;
const OPEN = { duration: 0.15, ease: EASE_OUT } as const;
const CLOSE = { duration: 0.1, ease: EASE_OUT } as const;

type Offset = { dx: number; dy: number };
type DragState = { id: string; startX: number; startY: number; baseDx: number; baseDy: number; moved: boolean };

const ICON_TINT: Record<BadgeVariant, string> = {
  neutral: "bg-muted text-muted-foreground",
  accent: "bg-accent/10 text-accent",
  success: "bg-success/15 text-success",
  warning: "bg-warning/15 text-warning",
  destructive: "bg-destructive/15 text-destructive",
};

/** A small chip that opens an upward dropdown, used for the property and value in a condition clause. */
function ChipSelect({
  value,
  options,
  align = "left",
  onChange,
}: {
  value: string;
  options: string[];
  align?: "left" | "right";
  onChange: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    window.addEventListener("pointerdown", onPointerDown);
    return () => window.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  return (
    <div ref={rootRef} data-no-drag className="relative inline-flex min-w-0">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
        onKeyDown={(event) => {
          if (event.key === "Escape") setOpen(false);
        }}
        className={cn(
          "inline-flex h-6 min-w-0 items-center gap-1 rounded-md px-1.5 text-xs font-medium text-foreground outline-none transition-colors duration-150",
          open ? "bg-muted" : "bg-card hover:bg-muted",
        )}
      >
        <span className="min-w-0 truncate">{value}</span>
        <ChevronDown
          aria-hidden="true"
          className={cn("h-3 w-3 shrink-0 text-muted-foreground transition-transform duration-150", open && "rotate-180")}
        />
      </button>
      <motion.div
        role="listbox"
        aria-hidden={!open}
        inert={!open}
        initial={false}
        animate={reduce ? { opacity: open ? 1 : 0 } : { opacity: open ? 1 : 0, scale: open ? 1 : 0.97 }}
        transition={reduce ? { duration: 0 } : open ? OPEN : CLOSE}
        style={{
          transformOrigin: `bottom ${align === "right" ? "right" : "left"}`,
          pointerEvents: open ? "auto" : "none",
        }}
        className={cn(
          "absolute bottom-full z-20 mb-1.5 flex min-w-36 max-w-[calc(100vw-2rem)] flex-col gap-0.5 rounded-lg bg-background p-1",
          "shadow-[0_0_0_1px_var(--border-strong),0_12px_24px_-12px_rgb(0_0_0/0.3)]",
          align === "right" ? "right-0" : "left-0",
        )}
      >
        {options.map((option) => (
          <button
            key={option}
            type="button"
            role="option"
            aria-selected={option === value}
            onClick={() => {
              onChange(option);
              setOpen(false);
            }}
            className={cn(
              "flex min-h-8 w-full touch-manipulation items-center justify-between gap-2 rounded-md px-2 text-left text-xs outline-none transition-colors duration-150",
              option === value ? "text-foreground" : "text-muted-foreground",
              "hover:bg-muted hover:text-foreground",
            )}
          >
            <span className="truncate">{option}</span>
            {option === value ? <Check aria-hidden="true" className="h-3 w-3 shrink-0" /> : null}
          </button>
        ))}
      </motion.div>
    </div>
  );
}

/** The if/else editor body: one row per clause, each a "connector, source, property is value" line. */
function ConditionBody({ clauses }: { clauses: ConditionClause[] }) {
  const [selection, setSelection] = useState<Record<string, { property: string; value: string }>>(() =>
    Object.fromEntries(clauses.map((clause) => [clause.id, { property: clause.property.value, value: clause.value.value }])),
  );

  return (
    <div className="flex flex-col gap-2 p-3">
      {clauses.map((clause) => (
        <div key={clause.id} className="flex min-w-0 flex-wrap items-center gap-x-1.5 gap-y-1.5">
          <span className="w-7 shrink-0 text-xs text-muted-foreground">{clause.connector === "if" ? "If" : "and"}</span>
          <span className="inline-flex h-6 shrink-0 items-center rounded-md bg-card px-1.5 text-xs font-medium text-foreground shadow-[0_0_0_1px_var(--border)]">
            {clause.source}
          </span>
          <ChipSelect
            value={selection[clause.id].property}
            options={clause.property.options}
            onChange={(next) => setSelection((current) => ({ ...current, [clause.id]: { ...current[clause.id], property: next } }))}
          />
          <span className="text-xs text-muted-foreground">is</span>
          <ChipSelect
            value={selection[clause.id].value}
            options={clause.value.options}
            align="right"
            onChange={(next) => setSelection((current) => ({ ...current, [clause.id]: { ...current[clause.id], value: next } }))}
          />
        </div>
      ))}
    </div>
  );
}

/**
 * A sequence of steps on a dotted canvas, connected by curves that measure
 * the actual rendered cards. Each card can be dragged anywhere on the
 * canvas and the connector follows it live; click a card (without dragging
 * it) to light up the connectors on either side of it. A step can also
 * render as an if/else condition editor, with its property and value chips
 * opening real dropdowns, instead of the usual title and description.
 */
export function Flowchart({ steps, className }: FlowchartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLElement | null)[]>([]);
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

  const widths = steps.map((step) => {
    const base = step.width ?? (step.condition ? CONDITION_WIDTH : CARD_WIDTH);
    return containerWidth > 0 ? Math.min(base, containerWidth * 0.92) : base;
  });

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
    // A press on a chip's own dropdown should open it, not drag the card.
    if ((event.target as Element).closest("[data-no-drag]")) return;
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
    const halfWidth = widths[index] / 2;
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

  const toggleSelected = (id: string) => setSelected((current) => (current === id ? null : id));

  const onCardClick = (id: string) => (event: ReactMouseEvent<HTMLElement>) => {
    if ((event.target as Element).closest("[data-no-drag]")) return;
    if (dragRef.current?.moved) return;
    toggleSelected(id);
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        // No overflow-hidden here: border-radius already clips the dotted
        // background on its own, and a condition card's dropdown needs to
        // spill past the canvas's tightly-fit height without being clipped.
        "relative w-full touch-none select-none rounded-2xl bg-card shadow-[0_0_0_1px_var(--border)]",
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
        const variant = step.kindVariant ?? "accent";
        return (
          <div
            key={step.id}
            ref={(el) => {
              cardRefs.current[index] = el;
            }}
            onPointerDown={onPointerDown(step.id)}
            onPointerMove={onPointerMove(step.id, index)}
            onPointerUp={onPointerUp(step.id)}
            className="absolute flex -translate-x-1/2 cursor-grab touch-none flex-col items-center gap-1.5 active:cursor-grabbing"
            style={{ left: x, top, width: widths[index], zIndex: dragRef.current?.id === step.id ? 2 : 1 }}
          >
            {step.kind ? <Badge variant={variant}>{step.kind}</Badge> : null}
            {step.condition ? (
              // biome-ignore lint/a11y/useSemanticElements: a <button> can't nest the chip buttons inside it.
              <div
                role="button"
                tabIndex={0}
                onClick={onCardClick(step.id)}
                onKeyDown={(event) => {
                  if (event.target === event.currentTarget && (event.key === "Enter" || event.key === " ")) {
                    event.preventDefault();
                    toggleSelected(step.id);
                  }
                }}
                aria-pressed={active}
                className={cn(
                  "w-full cursor-pointer rounded-2xl bg-background text-left outline-none transition-shadow duration-150",
                  active
                    ? "shadow-[0_0_0_1.5px_var(--accent)]"
                    : "shadow-[0_0_0_1px_var(--border)] hover:shadow-[0_0_0_1px_var(--border-strong)]",
                )}
              >
                <ConditionBody clauses={step.condition} />
              </div>
            ) : (
              <button
                type="button"
                onClick={onCardClick(step.id)}
                aria-pressed={active}
                className={cn(
                  "flex w-full items-center gap-3 rounded-2xl bg-background p-3 text-left outline-none transition-shadow duration-150",
                  active
                    ? "shadow-[0_0_0_1.5px_var(--accent)]"
                    : "shadow-[0_0_0_1px_var(--border)] hover:shadow-[0_0_0_1px_var(--border-strong)]",
                )}
              >
                {step.icon ? (
                  <span className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-lg", ICON_TINT[variant])}>
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
            )}
          </div>
        );
      })}
    </div>
  );
}

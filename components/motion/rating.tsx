"use client";

import { Star } from "lucide-react";
import { useId, useState } from "react";
import { cn } from "@/lib/utils";

export type RatingSize = "sm" | "md" | "lg";

export interface RatingProps {
  /** Controlled value, from 0 to `max`. */
  value?: number;
  /** Starting value when uncontrolled. Default 0. */
  defaultValue?: number;
  /** Called with the new value each time a star is picked. */
  onValueChange?: (value: number) => void;
  /** How many stars. Default 5. */
  max?: number;
  /** Shows the value without letting anyone change it. Default false. */
  readOnly?: boolean;
  /** Default "md". */
  size?: RatingSize;
  /** Names the group for screen readers. Default "Rating". */
  label?: string;
  className?: string;
}

const SIZES: Record<RatingSize, string> = { sm: "h-4 w-4", md: "h-6 w-6", lg: "h-8 w-8" };

/**
 * A row of stars. Hovering previews the score, picking one fills the row up to it in a quick
 * wave, and the arrow keys move it one star at a time. Built on native radio inputs.
 */
export function Rating({
  value,
  defaultValue = 0,
  onValueChange,
  max = 5,
  readOnly = false,
  size = "md",
  label = "Rating",
  className,
}: RatingProps) {
  const name = useId();
  const [inner, setInner] = useState(defaultValue);
  const current = value ?? inner;
  const [hover, setHover] = useState<number | null>(null);
  // Bumped on every pick, so the pop replays even when the same star is picked twice.
  const [wave, setWave] = useState(0);
  const shown = hover ?? current;

  const pick = (next: number) => {
    if (readOnly) return;
    setInner(next);
    setWave((n) => n + 1);
    onValueChange?.(next);
  };

  return (
    <fieldset
      onPointerLeave={() => setHover(null)}
      disabled={readOnly}
      className={cn("m-0 inline-flex min-w-0 items-center gap-0.5 border-0 p-0", className)}
    >
      <legend className="sr-only">{label}</legend>
      {Array.from({ length: max }, (_, index) => index + 1).map((score) => {
        const on = score <= shown;
        return (
          <label
            key={score}
            onPointerEnter={() => !readOnly && setHover(score)}
            className={cn(
              "relative grid touch-manipulation place-items-center rounded-md",
              readOnly ? "cursor-default" : "cursor-pointer",
              // Grows the hit area without spacing the stars apart.
              "after:absolute after:-inset-1",
            )}
          >
            <input
              type="radio"
              name={name}
              value={score}
              checked={score === current}
              onChange={() => pick(score)}
              className="peer sr-only"
            />
            <span className="sr-only">
              {score} star{score === 1 ? "" : "s"}
            </span>
            <span aria-hidden="true" className="grid rounded-md peer-focus-visible:ring-2 peer-focus-visible:ring-foreground/40">
              <Star
                key={score <= current ? wave : 0}
                style={{ animationDelay: `${(score - 1) * 35}ms` }}
                className={cn(
                  SIZES[size],
                  // Hover is instant, since it fires as the pointer sweeps along the row.
                  on ? "fill-warning text-warning" : "fill-transparent text-foreground/25",
                  wave > 0 && score <= current && "animate-[rating-pop_320ms_cubic-bezier(0.23,1,0.32,1)_both] motion-reduce:animate-none",
                )}
              />
            </span>
          </label>
        );
      })}
      <style>{"@keyframes rating-pop { 40% { transform: scale(1.22) } }"}</style>
    </fieldset>
  );
}

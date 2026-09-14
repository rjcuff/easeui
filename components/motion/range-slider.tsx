"use client";

import { type ChangeEvent, useState } from "react";
import { cn } from "@/lib/utils";

export interface RangeSliderProps {
  value?: number;
  defaultValue?: number;
  onValueChange?: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  /** Draw a dot at each step when there are 20 steps or fewer. Default true. */
  showTicks?: boolean;
  disabled?: boolean;
  name?: string;
  id?: string;
  className?: string;
  "aria-label"?: string;
  "aria-labelledby"?: string;
}

const MAX_TICKS = 20;
/** Thumb diameter in px. The fill and ticks line up with the thumb's center. */
const THUMB = 20;

// Pseudo-element styles for the native thumb and track in both engines.
const THUMB_CLASS = [
  "[&::-webkit-slider-runnable-track]:bg-transparent",
  "[&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-background",
  "[&::-webkit-slider-thumb]:shadow-[0_0_0_1px_var(--border-strong),0_1px_3px_rgb(0_0_0/0.25)]",
  "[&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:duration-150 [&::-webkit-slider-thumb]:ease-out",
  "active:[&::-webkit-slider-thumb]:scale-110",
  "focus-visible:[&::-webkit-slider-thumb]:shadow-[0_0_0_4px_color-mix(in_oklch,var(--foreground)_25%,transparent)]",
  "[&::-moz-range-track]:bg-transparent",
  "[&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-background",
  "[&::-moz-range-thumb]:shadow-[0_0_0_1px_var(--border-strong),0_1px_3px_rgb(0_0_0/0.25)]",
  "[&::-moz-range-thumb]:transition-transform [&::-moz-range-thumb]:duration-150 [&::-moz-range-thumb]:ease-out",
  "active:[&::-moz-range-thumb]:scale-110",
].join(" ");

/** Position along the track, accounting for the thumb staying inside the edges. */
const along = (fraction: number) => `calc(${THUMB / 2}px + (100% - ${THUMB}px) * ${fraction})`;

export function RangeSlider({
  value,
  defaultValue,
  onValueChange,
  min = 0,
  max = 100,
  step = 1,
  showTicks = true,
  disabled = false,
  className,
  ...inputProps
}: RangeSliderProps) {
  const [inner, setInner] = useState(defaultValue ?? min);
  const current = value ?? inner;
  const fraction = max === min ? 0 : (current - min) / (max - min);
  // toFixed guards against float noise like 0.3 / 0.1 = 2.9999999999999996.
  const steps = Math.floor(Number(((max - min) / step).toFixed(6)));
  const ticks =
    showTicks && steps > 0 && steps <= MAX_TICKS
      ? Array.from({ length: steps + 1 }, (_, i) => i / steps)
      : [];

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    const next = Number(event.target.value);
    if (value === undefined) setInner(next);
    onValueChange?.(next);
  };

  return (
    <div className={cn("relative flex h-10 w-full items-center", disabled && "opacity-50", className)}>
      {/* Track and fill are decoration. The native input underneath does the work. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 h-1.5 rounded-full bg-muted">
        <div className="h-full rounded-full bg-foreground" style={{ width: along(fraction) }} />
      </div>
      {ticks.map((tick) => (
        <span
          key={tick}
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute top-1/2 size-1 -translate-x-1/2 -translate-y-1/2 rounded-full",
            tick <= fraction ? "bg-background/70" : "bg-foreground/25",
          )}
          style={{ left: along(tick) }}
        />
      ))}
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={current}
        disabled={disabled}
        onChange={onChange}
        className={cn(
          "relative z-10 h-10 w-full cursor-pointer touch-manipulation appearance-none bg-transparent outline-none disabled:cursor-not-allowed",
          THUMB_CLASS,
        )}
        {...inputProps}
      />
    </div>
  );
}

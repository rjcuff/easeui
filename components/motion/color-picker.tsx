"use client";

import { Check } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { type CSSProperties, type PointerEvent, useEffect, useId, useRef, useState } from "react";
import { SPRING_PRESS } from "@/lib/ease";
import { cn } from "@/lib/utils";

export interface ColorPickerProps {
  /** Controlled opaque color as #RGB or #RRGGBB. Invalid values use #6366f1. */
  value?: string;
  /** Initial opaque color when uncontrolled. Default "#6366f1". */
  defaultValue?: string;
  /** Called with a lowercase #RRGGBB color as the selection changes. */
  onValueChange?: (value: string) => void;
  /** Preset colors as #RGB or #RRGGBB. Pass [] to hide them. */
  swatches?: readonly string[];
  /** Accessible name for the picker. Default "Color". */
  label?: string;
  /** Disables every control. Default false. */
  disabled?: boolean;
  /** Form field name for the selected #RRGGBB value. */
  name?: string;
  /** Additional classes for the panel. */
  className?: string;
}

type HSV = { h: number; s: number; v: number };
const DEFAULT = "#6366f1";
const SWATCHES = ["#ef4444", "#eab308", "#22c55e", "#06b6d4", "#6366f1", "#ec4899"];

function normalize(value: string): string | null {
  const hex = value.trim().replace(/^#/, "");
  if (/^[\da-f]{3}$/i.test(hex)) return `#${[...hex].map((c) => c + c).join("").toLowerCase()}`;
  return /^[\da-f]{6}$/i.test(hex) ? `#${hex.toLowerCase()}` : null;
}

function fromHex(hex: string): HSV {
  const [r, g, b] = [1, 3, 5].map((i) => Number.parseInt(hex.slice(i, i + 2), 16) / 255);
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;
  let h = 0;
  if (delta) {
    if (max === r) h = ((g - b) / delta) % 6;
    else if (max === g) h = (b - r) / delta + 2;
    else h = (r - g) / delta + 4;
  }
  return { h: (h * 60 + 360) % 360, s: max ? delta / max * 100 : 0, v: max * 100 };
}

function toHex({ h, s, v }: HSV): string {
  const channel = (offset: number) => {
    const k = (offset + h / 60) % 6;
    return Math.round((v / 100 - v / 100 * s / 100 * Math.max(0, Math.min(k, 4 - k, 1))) * 255)
      .toString(16).padStart(2, "0");
  };
  return `#${channel(5)}${channel(3)}${channel(1)}`;
}

const RANGE = cn(
  "h-11 w-full cursor-pointer appearance-none bg-transparent outline-none disabled:cursor-not-allowed",
  "[&::-webkit-slider-runnable-track]:h-2.5 [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:bg-[image:var(--picker-track)]",
  "[&::-moz-range-track]:h-2.5 [&::-moz-range-track]:rounded-full [&::-moz-range-track]:bg-[image:var(--picker-track)]",
  "[&::-webkit-slider-thumb]:-mt-1.5 [&::-webkit-slider-thumb]:size-[22px] [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white",
  "[&::-moz-range-thumb]:size-[22px] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-white",
  "[&::-webkit-slider-thumb]:shadow-[0_0_0_1px_var(--border-strong),0_1px_3px_rgb(0_0_0/0.25)]",
  "[&::-moz-range-thumb]:shadow-[0_0_0_1px_var(--border-strong),0_1px_3px_rgb(0_0_0/0.25)]",
  "focus-visible:[&::-webkit-slider-thumb]:outline-2 focus-visible:[&::-webkit-slider-thumb]:outline-offset-2 focus-visible:[&::-webkit-slider-thumb]:outline-foreground",
  "focus-visible:[&::-moz-range-thumb]:outline-2 focus-visible:[&::-moz-range-thumb]:outline-offset-2 focus-visible:[&::-moz-range-thumb]:outline-foreground",
);

/**
 * An inline opaque color picker. Drag the color field or use the three native
 * sliders with arrow keys, Home and End. HEX edits commit on blur or Enter;
 * invalid edits revert, and Escape cancels an edit. Color changes follow input
 * immediately. Only pointer presses on presets animate, with reduced motion
 * turning that feedback off.
 */
export function ColorPicker({
  value, defaultValue = DEFAULT, onValueChange, swatches = SWATCHES,
  label = "Color", disabled = false, name, className,
}: ColorPickerProps) {
  const id = useId();
  const reduce = useReducedMotion();
  const inputRef = useRef<HTMLInputElement>(null);
  const initial = normalize(defaultValue) ?? DEFAULT;
  const [model, setModel] = useState(() => ({ hex: initial, hsv: fromHex(initial) }));
  const controlled = value === undefined ? null : normalize(value) ?? DEFAULT;
  const current = controlled !== null && controlled !== model.hex
    ? { hex: controlled, hsv: fromHex(controlled) } : model;
  const { hex, hsv } = current;
  const [draft, setDraft] = useState(hex);
  const [pointerPress, setPointerPress] = useState(false);
  
  // Retain hue at zero saturation and black, where HEX cannot encode it.
  if (current !== model) {
    setModel(current);
    setDraft(hex);
  }

  useEffect(() => {
    const form = inputRef.current?.form;
    if (!form || value !== undefined) return;
    const reset = (event: Event) => {
      queueMicrotask(() => {
        if (event.defaultPrevented) return;
        setModel({ hex: initial, hsv: fromHex(initial) });
        setDraft(initial);
      });
    };
    form.addEventListener("reset", reset);
    return () => form.removeEventListener("reset", reset);
  }, [initial, value]);

  const update = (next: HSV) => {
    if (disabled) return;
    const nextHex = toHex(next);
    setModel({ hex: nextHex, hsv: next });
    // Sync in the input event: a passive update on every drag can cascade.
    setDraft(nextHex);
    if (nextHex !== hex) onValueChange?.(nextHex);
  };
  const commit = () => {
    const next = normalize(draft);
    if (next && next !== hex) update(fromHex(next));
    else setDraft(hex);
  };
  const move = (event: PointerEvent<HTMLDivElement>) => {
    if (disabled) return;
    const rect = event.currentTarget.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    update({
      ...hsv,
      s: Math.max(0, Math.min(100, (event.clientX - rect.left) / rect.width * 100)),
      v: Math.max(0, Math.min(100, 100 - (event.clientY - rect.top) / rect.height * 100)),
    });
  };
  const presets = [...new Set(swatches.map(normalize).filter((color): color is string => color !== null))];
  const invalid = normalize(draft) === null;
  const tracks = [
    { key: "h", label: "Hue", max: 360, suffix: "degrees", track: "linear-gradient(to right, #f00, #ff0, #0f0, #0ff, #00f, #f0f, #f00)" },
    { key: "s", label: "Saturation", max: 100, suffix: "percent", track: `linear-gradient(to right, ${toHex({ ...hsv, s: 0 })}, ${toHex({ ...hsv, s: 100 })})` },
    { key: "v", label: "Brightness", max: 100, suffix: "percent", track: `linear-gradient(to right, #000, ${toHex({ ...hsv, v: 100 })})` },
  ] as const;

  return (
    <fieldset disabled={disabled} aria-label={label} className={cn(
      "m-0 w-80 min-w-0 max-w-full rounded-2xl border-0 bg-background p-4 text-foreground",
      "shadow-[0_0_0_1px_var(--border-strong),0_4px_12px_-4px_rgb(0_0_0/0.12)]",
      disabled && "opacity-50", className,
    )}>
      <div className="mb-3 text-sm font-medium">
        <span>{label}</span>
      </div>
      {/* Pointer shortcut. The sliders below provide the same controls to keyboards and assistive technology. */}
      <div
        aria-hidden="true"
        className={cn("relative h-40 touch-none rounded-xl", disabled ? "cursor-not-allowed" : "cursor-crosshair")}
        style={{ background: `linear-gradient(to top, #000, transparent), linear-gradient(to right, #fff, transparent), hsl(${hsv.h} 100% 50%)` }}
        onPointerDown={(event) => {
          if (disabled || event.button !== 0 || !event.isPrimary) return;
          event.preventDefault();
          event.currentTarget.setPointerCapture(event.pointerId);
          move(event);
        }}
        onPointerMove={(event) => {
          if (event.currentTarget.hasPointerCapture(event.pointerId)) move(event);
        }}
        onPointerUp={(event) => {
          if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
        }}
      >
        <span className="pointer-events-none absolute size-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-[0_0_0_1px_rgb(0_0_0/0.3)]" style={{ left: `${hsv.s}%`, top: `${100 - hsv.v}%`, backgroundColor: hex }} />
      </div>
      <div className="mt-3 space-y-0.5">
        {tracks.map((track) => (
          <label key={track.key} className="flex items-center gap-3">
            <span className="w-16 shrink-0 text-xs text-muted-foreground">{track.label}</span>
            <input type="range" min={0} max={track.max} step={1} value={hsv[track.key]}
              aria-valuetext={`${Math.round(hsv[track.key])} ${track.suffix}`}
              onChange={(event) => update({ ...hsv, [track.key]: Number(event.target.value) })}
              className={RANGE} style={{ "--picker-track": track.track } as CSSProperties} />
          </label>
        ))}
      </div>
      <label htmlFor={`${id}-hex`} className="mt-2 flex items-center gap-3">
        <span className="w-16 shrink-0 text-xs text-muted-foreground">HEX</span>
        <input id={`${id}-hex`} type="text" value={draft} spellCheck={false} autoComplete="off"
          maxLength={7} aria-invalid={invalid} aria-describedby={invalid ? `${id}-hint` : undefined}
          onChange={(event) => setDraft(event.target.value)} onBlur={commit}
          onKeyDown={(event) => {
            if (event.key === "Enter") { event.preventDefault(); commit(); }
            if (event.key === "Escape") { event.preventDefault(); event.stopPropagation(); setDraft(hex); }
          }}
          className="h-11 min-w-0 w-full rounded-lg bg-muted px-3 font-mono text-xs outline-none focus-visible:ring-2 focus-visible:ring-foreground/40" />
      </label>
      {invalid && <p id={`${id}-hint`} className="mt-2 text-xs text-muted-foreground">Use 3 or 6 hex digits.</p>}
      {presets.length > 0 && (
        <fieldset aria-label="Preset colors" className="m-0 mt-3 flex min-w-0 flex-wrap border-0 p-0">
          {presets.map((color) => (
            <motion.button key={color} type="button" aria-label={`Use ${color}`} aria-pressed={hex === color}
              onPointerDown={() => setPointerPress(true)} onKeyDown={() => setPointerPress(false)}
              whileTap={reduce || !pointerPress ? undefined : { scale: 0.97 }} transition={SPRING_PRESS}
              onClick={() => update(fromHex(color))}
              className="flex size-11 items-center justify-center rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-foreground/40 disabled:cursor-not-allowed">
              <span className="flex size-6 items-center justify-center rounded-full shadow-[0_0_0_1px_var(--border-strong)]" style={{ backgroundColor: color }}>
                {hex === color && <Check aria-hidden="true" className="size-3.5 text-white mix-blend-difference" strokeWidth={3} />}
              </span>
            </motion.button>
          ))}
        </fieldset>
      )}
      <input ref={inputRef} type="hidden" name={name} value={hex} disabled={disabled} />
    </fieldset>
  );
}

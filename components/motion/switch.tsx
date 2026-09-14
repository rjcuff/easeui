"use client";

import { type ButtonHTMLAttributes, forwardRef, useState } from "react";
import { cn } from "@/lib/utils";

export type SwitchSize = "sm" | "md";

export interface SwitchProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "onChange" | "value" | "defaultValue"> {
  /** Controlled on state. */
  checked?: boolean;
  /** Starting state when uncontrolled. Default false. */
  defaultChecked?: boolean;
  /** Called with the next state each time the switch is toggled. */
  onCheckedChange?: (checked: boolean) => void;
  /** Track size. Default "md". */
  size?: SwitchSize;
}

const SIZES: Record<SwitchSize, { track: string; thumb: string }> = {
  sm: { track: "h-5 w-9", thumb: "h-4 w-4 group-data-[state=on]:translate-x-4" },
  md: { track: "h-6 w-11", thumb: "h-5 w-5 group-data-[state=on]:translate-x-5" },
};

/**
 * An on and off switch. Put it inside a label and the whole row becomes the
 * tap target, with no dead space between the text and the track.
 */
export const Switch = forwardRef<HTMLButtonElement, SwitchProps>(function Switch(
  { checked, defaultChecked = false, onCheckedChange, size = "md", className, onClick, ...props },
  ref,
) {
  const [uncontrolled, setUncontrolled] = useState(defaultChecked);
  const isControlled = checked !== undefined;
  const on = isControlled ? checked : uncontrolled;

  return (
    <button
      ref={ref}
      type="button"
      role="switch"
      aria-checked={on}
      data-state={on ? "on" : "off"}
      onClick={(event) => {
        onClick?.(event);
        if (event.defaultPrevented) return;
        if (!isControlled) setUncontrolled(!on);
        onCheckedChange?.(!on);
      }}
      className={cn(
        "group relative inline-flex shrink-0 touch-manipulation items-center rounded-full p-0.5 outline-none",
        "bg-foreground/15 transition-colors duration-150 ease-out data-[state=on]:bg-accent",
        "focus-visible:ring-2 focus-visible:ring-foreground/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        "disabled:cursor-not-allowed disabled:opacity-50",
        // Grows the hit area to about 44px tall without changing the layout.
        "after:absolute after:-inset-x-1 after:-inset-y-2.5",
        SIZES[size].track,
        className,
      )}
      {...props}
    >
      <span
        aria-hidden="true"
        className={cn(
          "block rounded-full bg-white shadow-[0_1px_2px_rgb(0_0_0/0.25)] transition-[translate] duration-150 ease-out motion-reduce:transition-none",
          SIZES[size].thumb,
        )}
      />
    </button>
  );
});

"use client";

import { Check } from "lucide-react";
import { forwardRef, type InputHTMLAttributes, useState } from "react";
import { cn } from "@/lib/utils";

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  /** Controlled checked state. */
  checked?: boolean;
  /** Starting state when uncontrolled. Default false. */
  defaultChecked?: boolean;
  /** Called with the next state each time the checkbox is toggled. */
  onCheckedChange?: (checked: boolean) => void;
}

/**
 * A checkbox on a real checkbox input, with a check mark that pops in rather
 * than just appearing. Put it inside a label and the whole row becomes the
 * tap target, with no dead space between the text and the box.
 */
export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  { checked, defaultChecked = false, onCheckedChange, className, onChange, ...props },
  ref,
) {
  const [uncontrolled, setUncontrolled] = useState(defaultChecked);
  const isControlled = checked !== undefined;
  const on = isControlled ? checked : uncontrolled;

  return (
    <span className={cn("relative inline-flex h-5 w-5 shrink-0 items-center justify-center", className)}>
      <input
        ref={ref}
        type="checkbox"
        checked={on}
        onChange={(event) => {
          onChange?.(event);
          if (!isControlled) setUncontrolled(event.target.checked);
          onCheckedChange?.(event.target.checked);
        }}
        className={cn(
          "peer absolute inset-0 m-0 h-5 w-5 shrink-0 touch-manipulation cursor-pointer appearance-none rounded-md outline-none",
          "shadow-[0_0_0_1px_var(--border-strong)] transition-colors duration-150 ease-out",
          "checked:bg-accent checked:shadow-[0_0_0_1px_var(--accent)]",
          "focus-visible:ring-2 focus-visible:ring-foreground/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          "disabled:cursor-not-allowed disabled:opacity-50",
          // Grows the hit area to about 44px without changing the layout.
          "after:absolute after:-inset-3",
        )}
        {...props}
      />
      <Check
        aria-hidden="true"
        strokeWidth={3}
        className="pointer-events-none relative h-3.5 w-3.5 scale-50 text-accent-foreground opacity-0 transition-[opacity,scale] duration-150 ease-out peer-checked:scale-100 peer-checked:opacity-100 motion-reduce:transition-none"
      />
    </span>
  );
});

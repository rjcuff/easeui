"use client";

import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export type InputProps = InputHTMLAttributes<HTMLInputElement>;

/**
 * Text input whose focus ring grows from a hairline to two px. Pass
 * aria-invalid to switch the ring to the destructive color.
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, ...props },
  ref,
) {
  return (
    <input
      ref={ref}
      className={cn(
        "h-10 w-full rounded-xl bg-card px-3 text-base text-foreground shadow-[0_0_0_1px_var(--border-strong)] outline-none transition-shadow duration-150 ease-out sm:text-sm",
        "placeholder:text-muted-foreground",
        "focus:shadow-[0_0_0_2px_var(--accent)]",
        "aria-invalid:shadow-[0_0_0_2px_var(--destructive)]",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
});

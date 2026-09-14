"use client";

import { forwardRef, type TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement>;

/**
 * Textarea that grows with its content instead of scrolling, down to three
 * rows and up to a scrollable cap. Shares Input's focus ring.
 */
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { className, rows = 3, ...props },
  ref,
) {
  return (
    <textarea
      ref={ref}
      rows={rows}
      className={cn(
        "block max-h-64 w-full resize-none rounded-xl bg-card px-3 py-2 text-base text-foreground shadow-[0_0_0_1px_var(--border-strong)] outline-none transition-shadow duration-150 ease-out sm:text-sm",
        "[field-sizing:content]",
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

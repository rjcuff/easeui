"use client";

import { Check, Copy } from "lucide-react";
import { type ButtonHTMLAttributes, forwardRef, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type CopyState = "idle" | "copied" | "failed";

export interface CopyButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children" | "value" | "onCopy"> {
  /** Text written to the clipboard. */
  value: string;
  /** Visible text. Leave it out for an icon only button. */
  label?: string;
  /** Visible text after copying. Default "Copied". */
  copiedLabel?: string;
  /** How long the copied state stays, in ms. Default 1500. */
  timeout?: number;
  /** Called after the text reaches the clipboard. */
  onCopied?: (value: string) => void;
}

// Both icons, and both labels, share a grid cell and trade places with a fade and a small
// scale. Sharing the cell keeps the button the same width in either state.
const SWAP =
  "col-start-1 row-start-1 transition-[opacity,scale] duration-200 ease-out motion-reduce:transition-none";
const SHOWN = "scale-100 opacity-100";
const ICON_HIDDEN = "scale-50 opacity-0";
const TEXT_HIDDEN = "scale-[0.97] opacity-0";

export const CopyButton = forwardRef<HTMLButtonElement, CopyButtonProps>(function CopyButton(
  { value, label, copiedLabel = "Copied", timeout = 1500, onCopied, className, onClick, ...props },
  ref,
) {
  const [state, setState] = useState<CopyState>("idle");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setState("copied");
      onCopied?.(value);
    } catch {
      // Clipboard access can be blocked, for example in an insecure context.
      setState("failed");
    }
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setState("idle"), timeout);
  };

  const copied = state === "copied";
  const status = copied ? "Copied to clipboard" : state === "failed" ? "Could not copy" : "";

  return (
    <button
      ref={ref}
      type="button"
      aria-label={label ?? "Copy"}
      data-state={state}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) void copy();
      }}
      className={cn(
        "relative inline-flex h-9 shrink-0 touch-manipulation select-none items-center justify-center gap-2 rounded-full bg-card text-sm font-medium text-foreground outline-none",
        "shadow-[0_0_0_1px_var(--border)] transition-[background-color,scale] duration-150 ease-out hover:bg-muted active:scale-[0.97] motion-reduce:active:scale-100",
        "focus-visible:ring-2 focus-visible:ring-foreground/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        label ? "px-3.5" : "w-9 after:absolute after:-inset-1",
        className,
      )}
      {...props}
    >
      <span aria-hidden="true" className="grid place-items-center">
        <Copy className={cn(SWAP, "h-4 w-4", copied ? ICON_HIDDEN : SHOWN)} />
        <Check className={cn(SWAP, "h-4 w-4", copied ? SHOWN : ICON_HIDDEN)} />
      </span>
      {label ? (
        <span aria-hidden="true" className="grid whitespace-nowrap">
          <span className={cn(SWAP, copied ? TEXT_HIDDEN : SHOWN)}>{label}</span>
          <span className={cn(SWAP, copied ? SHOWN : TEXT_HIDDEN)}>{copiedLabel}</span>
        </span>
      ) : null}
      <span aria-live="polite" className="sr-only">
        {status}
      </span>
    </button>
  );
});

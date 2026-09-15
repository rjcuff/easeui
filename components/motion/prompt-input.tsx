"use client";

import { ArrowUp, Square } from "lucide-react";
import { type KeyboardEvent, type TextareaHTMLAttributes, useState } from "react";
import { cn } from "@/lib/utils";

export interface PromptInputProps
  extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "value" | "defaultValue" | "onChange" | "onSubmit"> {
  /** Controlled value. */
  value?: string;
  /** Starting value when uncontrolled. Default "". */
  defaultValue?: string;
  onChange?: (value: string) => void;
  /** Called with the trimmed text on Enter or the send button. */
  onSubmit: (value: string) => void;
  /** Swaps the send button for a stop button. Default false. */
  loading?: boolean;
  /** Called from the stop button while loading. */
  onStop?: () => void;
  className?: string;
}

// Same crossfade CopyButton uses, so the button never changes size.
const SWAP = "col-start-1 row-start-1 transition-[opacity,scale] duration-200 ease-out motion-reduce:transition-none";
const SHOWN = "scale-100 opacity-100";
const HIDDEN = "scale-50 opacity-0";

/**
 * A chat composer: a textarea that grows with its content up to a scrollable
 * cap, and a send button beside it. Enter submits, Shift+Enter starts a new
 * line, and the button crossfades into a stop button while a reply streams.
 */
export function PromptInput({
  value,
  defaultValue = "",
  onChange,
  onSubmit,
  loading = false,
  onStop,
  disabled = false,
  placeholder = "Message...",
  className,
  ...props
}: PromptInputProps) {
  const [uncontrolled, setUncontrolled] = useState(defaultValue);
  const isControlled = value !== undefined;
  const text = isControlled ? value : uncontrolled;

  const setValue = (next: string) => {
    if (!isControlled) setUncontrolled(next);
    onChange?.(next);
  };

  const submit = () => {
    const trimmed = text.trim();
    if (!trimmed || loading || disabled) return;
    onSubmit(trimmed);
    if (!isControlled) setUncontrolled("");
  };

  const onKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey && !loading && !disabled) {
      event.preventDefault();
      submit();
    }
  };

  return (
    <div
      className={cn(
        "flex items-end gap-2 rounded-2xl bg-card p-2 pl-3.5 shadow-[0_0_0_1px_var(--border-strong)] outline-none transition-shadow duration-150 ease-out",
        "focus-within:shadow-[0_0_0_2px_var(--accent)]",
        className,
      )}
    >
      <textarea
        rows={1}
        disabled={disabled}
        placeholder={placeholder}
        value={text}
        onChange={(event) => setValue(event.target.value)}
        onKeyDown={onKeyDown}
        className={cn(
          "max-h-48 flex-1 resize-none bg-transparent py-1.5 text-base text-foreground outline-none sm:text-sm",
          "[field-sizing:content]",
          "placeholder:text-muted-foreground",
          "disabled:cursor-not-allowed disabled:opacity-50",
        )}
        {...props}
      />
      <button
        type="button"
        aria-label={loading ? "Stop" : "Send"}
        disabled={loading ? false : disabled || !text.trim()}
        onClick={() => (loading ? onStop?.() : submit())}
        className={cn(
          "relative inline-flex h-9 w-9 shrink-0 touch-manipulation items-center justify-center rounded-full bg-foreground text-background outline-none",
          "transition-[background-color,opacity] duration-150 ease-out hover:bg-foreground/90",
          "focus-visible:ring-2 focus-visible:ring-foreground/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          "disabled:pointer-events-none disabled:opacity-40",
        )}
      >
        <span aria-hidden="true" className="grid place-items-center">
          <ArrowUp className={cn(SWAP, "h-4 w-4", loading ? HIDDEN : SHOWN)} />
          <Square className={cn(SWAP, "h-3 w-3 fill-current", loading ? SHOWN : HIDDEN)} />
        </span>
      </button>
    </div>
  );
}

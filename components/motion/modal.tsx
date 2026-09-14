"use client";

import { X } from "lucide-react";
import { type ReactNode, useEffect, useId, useRef, useState } from "react";
import { cn } from "@/lib/utils";

/** Matches the exit transition below. Closing is quicker than opening. */
const EXIT_MS = 150;

export interface ModalProps {
  /** Whether the modal is open. */
  open: boolean;
  /** Called when the modal asks to close, from Escape, the backdrop, or the close button. */
  onOpenChange: (open: boolean) => void;
  /** Heading that also names the dialog for screen readers. */
  title: ReactNode;
  /** Optional line under the title. */
  description?: ReactNode;
  /** Buttons along the bottom edge. */
  footer?: ReactNode;
  children?: ReactNode;
  className?: string;
}

/**
 * A centered dialog built on the native dialog element, so focus stays inside,
 * the page behind is inert, and focus returns to the trigger on close. It fades
 * and scales in from 0.97, and leaves a little faster than it arrived.
 */
export function Modal({
  open,
  onOpenChange,
  title,
  description,
  footer,
  children,
  className,
}: ModalProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const descriptionId = useId();
  // Drives the CSS transition. It lags one frame behind opening so the entrance can animate.
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;

    if (open) {
      if (!dialog.open) dialog.showModal();
      const frame = requestAnimationFrame(() => setShown(true));
      return () => cancelAnimationFrame(frame);
    }

    setShown(false);
    if (!dialog.open) return;
    // Let the exit transition finish before the dialog leaves the top layer.
    const timeout = setTimeout(() => dialog.close(), EXIT_MS);
    return () => clearTimeout(timeout);
  }, [open]);

  // The native dialog does not stop the page behind it from scrolling.
  useEffect(() => {
    if (!open) return;
    const root = document.documentElement;
    const previous = root.style.overflow;
    root.style.overflow = "hidden";
    return () => {
      root.style.overflow = previous;
    };
  }, [open]);

  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      aria-describedby={description ? descriptionId : undefined}
      data-shown={shown}
      // Escape fires cancel. Close through state instead so the exit animates.
      onCancel={(event) => {
        event.preventDefault();
        onOpenChange(false);
      }}
      onClose={() => {
        if (open) onOpenChange(false);
      }}
      className="group fixed inset-0 m-0 h-dvh max-h-none w-screen max-w-none items-center justify-center overflow-hidden bg-transparent p-4 text-foreground backdrop:bg-transparent open:flex"
    >
      <button
        type="button"
        aria-label="Close"
        tabIndex={-1}
        onClick={() => onOpenChange(false)}
        className="absolute inset-0 cursor-default bg-black/40 opacity-0 transition-opacity duration-150 ease-out group-data-[shown=true]:opacity-100 group-data-[shown=true]:duration-200 motion-reduce:transition-none"
      />
      <div
        className={cn(
          "relative flex max-h-full w-full max-w-md flex-col overflow-y-auto rounded-3xl bg-background p-6 shadow-[0_0_0_1px_var(--border-strong),0_24px_60px_-20px_rgb(0_0_0/0.45)]",
          "scale-[0.97] opacity-0 transition-[opacity,scale] duration-150 ease-out",
          "group-data-[shown=true]:scale-100 group-data-[shown=true]:opacity-100 group-data-[shown=true]:duration-200",
          "motion-reduce:transition-none",
          className,
        )}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-1.5">
            <h2 id={titleId} className="text-lg font-semibold tracking-tight">
              {title}
            </h2>
            {description ? (
              <p id={descriptionId} className="text-pretty text-sm text-muted-foreground">
                {description}
              </p>
            ) : null}
          </div>
          <button
            type="button"
            aria-label="Close"
            onClick={() => onOpenChange(false)}
            className="relative -mr-2 -mt-1 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors duration-150 after:absolute after:-inset-1.5 hover:bg-muted hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        {children ? <div className="mt-5">{children}</div> : null}
        {footer ? <div className="mt-6 flex flex-wrap justify-end gap-2">{footer}</div> : null}
      </div>
    </dialog>
  );
}

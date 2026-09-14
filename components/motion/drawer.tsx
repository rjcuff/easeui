"use client";

import { X } from "lucide-react";
import {
  type CSSProperties,
  type ReactNode,
  type PointerEvent as ReactPointerEvent,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import { cn } from "@/lib/utils";

/** Matches --ease-drawer in globals.css. The iOS sheet curve: steep start, gentle settle. */
const EASE_DRAWER = "cubic-bezier(0.32, 0.72, 0, 1)";
const ENTER_MS = 300;
/** Matches the exit transition below. Closing is quicker than opening. */
const EXIT_MS = 200;
/** Drag distance, as a fraction of the panel's height, that dismisses it. */
const SWIPE_FRACTION = 0.4;
/** Drag speed, in px per ms, that dismisses it even on a short drag. */
const SWIPE_VELOCITY = 0.5;

export interface DrawerProps {
  /** Whether the drawer is open. */
  open: boolean;
  /** Called when the drawer asks to close, from Escape, the backdrop, or a drag past the threshold. */
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

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);
  return reduced;
}

/**
 * A sheet that slides up from the bottom edge, built on the native dialog
 * element like Modal. Drag the handle down, or flick it, to dismiss.
 */
export function Drawer({
  open,
  onOpenChange,
  title,
  description,
  footer,
  children,
  className,
}: DrawerProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const descriptionId = useId();
  const reduceMotion = useReducedMotion();

  // Drives the transition. It lags one frame behind opening so the entrance can animate.
  const [shown, setShown] = useState(false);
  const [drag, setDrag] = useState<{ startY: number; startedAt: number; y: number } | null>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
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

  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.button !== 0) return;
    if ((event.target as HTMLElement).closest("button")) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    setDrag({ startY: event.clientY, startedAt: Date.now(), y: 0 });
  };

  const onPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!drag) return;
    const raw = event.clientY - drag.startY;
    // Down follows the finger. Up resists, since there is nowhere to go.
    setDrag({ ...drag, y: raw > 0 ? raw : -Math.sqrt(-raw) });
  };

  const onPointerUp = () => {
    if (!drag) return;
    const height = panelRef.current?.offsetHeight ?? 1;
    const velocity = drag.y / Math.max(1, Date.now() - drag.startedAt);
    if (drag.y > height * SWIPE_FRACTION || (drag.y > 8 && velocity > SWIPE_VELOCITY)) {
      onOpenChange(false);
    }
    setDrag(null);
  };

  const dragging = drag !== null;
  const dragY = Math.max(0, drag?.y ?? 0);
  const height = panelRef.current?.offsetHeight ?? 1;
  const backdropOpacity = shown ? Math.min(1, Math.max(0, 1 - dragY / height)) : 0;
  const settleMs = shown ? ENTER_MS : EXIT_MS;
  const transition = dragging || reduceMotion ? "none" : `transform ${settleMs}ms ${EASE_DRAWER}`;

  const panelStyle: CSSProperties = {
    transform: shown ? `translateY(${dragY}px)` : "translateY(100%)",
    transition,
  };
  const backdropStyle: CSSProperties = {
    opacity: backdropOpacity,
    transition:
      dragging || reduceMotion ? "none" : `opacity ${settleMs}ms ${EASE_DRAWER}`,
  };

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      aria-describedby={description ? descriptionId : undefined}
      // Escape fires cancel. Close through state instead so the exit animates.
      onCancel={(event) => {
        event.preventDefault();
        onOpenChange(false);
      }}
      onClose={() => {
        if (open) onOpenChange(false);
      }}
      className="fixed inset-0 m-0 h-dvh max-h-none w-screen max-w-none items-end justify-center overflow-hidden bg-transparent p-0 text-foreground backdrop:bg-transparent open:flex"
    >
      <button
        type="button"
        aria-label="Close"
        tabIndex={-1}
        onClick={() => onOpenChange(false)}
        style={backdropStyle}
        className="absolute inset-0 cursor-default bg-black/40"
      />
      <div
        ref={panelRef}
        style={panelStyle}
        className={cn(
          "relative flex w-full max-w-lg flex-col overflow-y-auto rounded-t-3xl bg-background pb-[env(safe-area-inset-bottom)] shadow-[0_0_0_1px_var(--border-strong),0_-24px_60px_-20px_rgb(0_0_0/0.45)]",
          "max-h-[85dvh]",
          className,
        )}
      >
        {/* Handle plus header are draggable; the close button is excluded. */}
        <div
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={() => setDrag(null)}
          className={cn(
            "flex shrink-0 touch-none flex-col gap-1.5 px-6 pt-2",
            !open && "pointer-events-none",
          )}
        >
          <span
            aria-hidden="true"
            className="mx-auto h-1.5 w-10 shrink-0 cursor-grab rounded-full bg-foreground/20 active:cursor-grabbing"
          />
          <div className="flex items-start justify-between gap-4 pb-4 pt-3">
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
        </div>
        {children ? <div className="px-6">{children}</div> : null}
        {footer ? (
          <div className="flex flex-wrap justify-end gap-2 px-6 pb-6 pt-6">{footer}</div>
        ) : null}
      </div>
    </dialog>
  );
}

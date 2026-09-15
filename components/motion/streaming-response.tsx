"use client";

import { RotateCcw, Share2, ThumbsDown, ThumbsUp } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { type ReactNode, useState } from "react";
import { CopyButton } from "@/components/motion/copy-button";
import { EASE_OUT } from "@/lib/ease";
import { cn } from "@/lib/utils";

export type StreamingResponseStatus = "streaming" | "complete" | "error";
export type StreamingResponseFeedback = "up" | "down" | null;

export interface StreamingResponseProps {
  /** The response itself, such as a StreamingText or rendered markdown. Left unstyled: no card, no border. */
  children: ReactNode;
  /** Default "streaming". The action row fades in once this leaves "streaming". */
  status?: StreamingResponseStatus;
  /** Text the copy action writes to the clipboard. Omit to hide that action. */
  copyText?: string;
  /** Shows a replay action. Omit to hide it. */
  onRetry?: () => void;
  /** Shows a share action. Omit to hide it. */
  onShare?: () => void;
  /** Shows a thumbs up / down toggle. Default false. */
  showFeedback?: boolean;
  /** Controlled feedback value. */
  feedback?: StreamingResponseFeedback;
  /** Starting feedback when uncontrolled. Default null. */
  defaultFeedback?: StreamingResponseFeedback;
  onFeedbackChange?: (feedback: StreamingResponseFeedback) => void;
  className?: string;
}

const ICON_BUTTON = cn(
  "relative inline-flex h-8 w-8 shrink-0 touch-manipulation items-center justify-center rounded-full text-muted-foreground outline-none",
  "transition-colors duration-150 ease-out hover:bg-muted hover:text-foreground",
  "focus-visible:ring-2 focus-visible:ring-foreground/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
);

/**
 * Wraps a response with the actions people expect once it settles: copy,
 * replay, share, and a thumbs up or down. It adds no card or border around
 * the content itself, so a streamed answer reads as part of the page rather
 * than a box sitting on it. The action row fades in only once status moves
 * off "streaming", and every action is opt-in: pass a handler to show it.
 */
export function StreamingResponse({
  children,
  status = "streaming",
  copyText,
  onRetry,
  onShare,
  showFeedback = false,
  feedback,
  defaultFeedback = null,
  onFeedbackChange,
  className,
}: StreamingResponseProps) {
  const reduce = useReducedMotion();
  const [uncontrolled, setUncontrolled] = useState(defaultFeedback);
  const isControlled = feedback !== undefined;
  const current = isControlled ? feedback : uncontrolled;

  const setFeedback = (next: StreamingResponseFeedback) => {
    if (!isControlled) setUncontrolled(next);
    onFeedbackChange?.(next);
  };

  const settled = status !== "streaming";
  const hasActions =
    settled && (copyText !== undefined || Boolean(onRetry) || Boolean(onShare) || showFeedback);

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <div aria-busy={!settled}>{children}</div>
      {hasActions ? (
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, ease: EASE_OUT }}
          className="-ml-2 flex items-center gap-0.5"
        >
          {copyText !== undefined ? (
            <CopyButton
              value={copyText}
              className={cn(ICON_BUTTON, "bg-transparent shadow-none hover:bg-muted")}
            />
          ) : null}
          {onRetry ? (
            <button type="button" aria-label="Replay" onClick={onRetry} className={ICON_BUTTON}>
              <RotateCcw aria-hidden="true" className="h-4 w-4" />
            </button>
          ) : null}
          {onShare ? (
            <button type="button" aria-label="Share" onClick={onShare} className={ICON_BUTTON}>
              <Share2 aria-hidden="true" className="h-4 w-4" />
            </button>
          ) : null}
          {showFeedback ? (
            <>
              <button
                type="button"
                aria-label="Good response"
                aria-pressed={current === "up"}
                onClick={() => setFeedback(current === "up" ? null : "up")}
                className={cn(ICON_BUTTON, current === "up" && "bg-muted text-success")}
              >
                <ThumbsUp aria-hidden="true" className="h-4 w-4" />
              </button>
              <button
                type="button"
                aria-label="Bad response"
                aria-pressed={current === "down"}
                onClick={() => setFeedback(current === "down" ? null : "down")}
                className={cn(ICON_BUTTON, current === "down" && "bg-muted text-destructive")}
              >
                <ThumbsDown aria-hidden="true" className="h-4 w-4" />
              </button>
            </>
          ) : null}
        </motion.div>
      ) : null}
    </div>
  );
}

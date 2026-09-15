"use client";

import { motion, useReducedMotion } from "motion/react";
import { useEffect, useMemo, useRef } from "react";
import { EASE_OUT } from "@/lib/ease";
import { cn } from "@/lib/utils";

export interface StreamingTextProps {
  /** The text so far. Append to it as more arrives; characters already shown never replay. */
  text: string;
  /** Shows a blinking cursor at the end, for while more is still on its way. Default false. */
  streaming?: boolean;
  className?: string;
}

/** Splits into individual characters, so each one can fade in on its own as it arrives. */
function tokenize(text: string): string[] {
  return Array.from(text);
}

/**
 * Reveals text as it streams in. Feed it a growing string, such as the
 * running output of a model response, and each newly appended character
 * fades in on its own, quickly enough that a run of them reads as one
 * smooth ribbon of text rather than single letters popping in. Characters
 * already on screen never replay, so scrollback stays still while new
 * content keeps arriving behind it.
 */
export function StreamingText({ text, streaming = false, className }: StreamingTextProps) {
  const reduce = useReducedMotion();
  const tokens = useMemo(() => tokenize(text), [text]);
  // How many tokens were already on screen as of the last render, read here
  // before the effect below updates it, so only tokens appended since the
  // last render count as new. A text that shrinks (a fresh message replacing
  // this one) is treated as fully settled instead of animating a jump backward.
  const shown = useRef(0);
  const settled = Math.min(tokens.length, shown.current);

  useEffect(() => {
    shown.current = tokens.length;
  }, [tokens.length]);

  return (
    <p className={cn("text-sm leading-6 text-foreground", className)}>
      {tokens.map((token, index) => {
        const isGlyph = /\S/.test(token);
        if (!isGlyph || index < settled || reduce) {
          // biome-ignore lint/suspicious/noArrayIndexKey: streaming only appends, so a token's index never changes once shown.
          return <span key={index}>{token}</span>;
        }
        return (
          <motion.span
            // biome-ignore lint/suspicious/noArrayIndexKey: streaming only appends, so a token's index never changes once shown.
            key={index}
            initial={{ opacity: 0, y: 3 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.12, ease: EASE_OUT }}
          >
            {token}
          </motion.span>
        );
      })}
      {streaming ? (
        <span
          aria-hidden="true"
          className="ml-0.5 inline-block h-3.5 w-0.5 translate-y-[2px] animate-pulse bg-foreground align-middle motion-reduce:animate-none"
        />
      ) : null}
    </p>
  );
}

"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type MessageBubbleTone = "neutral" | "accent";
export type MessageBubbleAlign = "start" | "end";

export interface MessageBubbleProps {
  /** Which side the bubble sits on, matching who sent it. Default "start". */
  align?: MessageBubbleAlign;
  /** Visual treatment. Default "neutral". */
  tone?: MessageBubbleTone;
  children: ReactNode;
  className?: string;
}

const TONE_CLASS: Record<MessageBubbleTone, string> = {
  neutral: "bg-card text-foreground shadow-[0_0_0_1px_var(--border)]",
  accent: "bg-accent text-accent-foreground",
};

const EASE = [0.23, 1, 0.32, 1] as const;

/** A chat message surface with a speech-bubble tail that pops in from the side it belongs to. */
export function MessageBubble({
  align = "start",
  tone = "neutral",
  children,
  className,
}: MessageBubbleProps) {
  const reduce = useReducedMotion();
  const fromX = align === "end" ? 10 : -10;

  return (
    <motion.div
      initial={reduce ? { opacity: 0 } : { opacity: 0, x: fromX, scale: 0.97 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      transition={{ duration: reduce ? 0.1 : 0.2, ease: EASE }}
      className={cn(
        "max-w-[85%] text-pretty rounded-2xl px-3.5 py-2.5 text-sm leading-6",
        align === "end" ? "ml-auto rounded-br-sm" : "mr-auto rounded-bl-sm",
        TONE_CLASS[tone],
        className,
      )}
    >
      {children}
    </motion.div>
  );
}

"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

const EASE = [0.23, 1, 0.32, 1] as const;

export interface NumberTickerProps {
  /** The number to display. Changing it rolls each digit to its new value. */
  value: number;
  /** Formats the number before it is split into characters. Default: grouped with commas. */
  format?: (value: number) => string;
  className?: string;
}

const defaultFormat = (value: number) => Math.round(value).toLocaleString("en-US");

/**
 * A number that rolls to a new value like an odometer: each character that
 * changes slides up and out while its replacement slides up into place.
 * Characters keep their slot counting from the right, so a comma or a new
 * leading digit never disturbs the ones already on screen.
 */
export function NumberTicker({ value, format = defaultFormat, className }: NumberTickerProps) {
  const reduce = useReducedMotion();
  const text = format(value);
  const characters = text.split("");

  return (
    <span className={cn("inline-flex tabular-nums", className)}>
      <span aria-hidden="true" className="inline-flex">
        {characters.map((char, index) => (
          <span
            // biome-ignore lint/suspicious/noArrayIndexKey: the key is distance from the right edge, stable as digits are added.
            key={characters.length - index}
            className="relative inline-block overflow-hidden"
          >
            <span className="invisible">{char}</span>
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.span
                key={char}
                initial={reduce ? false : { y: "70%", opacity: 0 }}
                animate={{ y: "0%", opacity: 1 }}
                exit={reduce ? undefined : { y: "-70%", opacity: 0 }}
                transition={{ duration: reduce ? 0 : 0.35, ease: EASE }}
                className="absolute inset-0"
              >
                {char}
              </motion.span>
            </AnimatePresence>
          </span>
        ))}
      </span>
      <span className="sr-only">{text}</span>
    </span>
  );
}

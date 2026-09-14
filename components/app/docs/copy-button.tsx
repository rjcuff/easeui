"use client";

import { Check, Copy } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/motion/button";
import { trackEvent } from "@/lib/analytics";
import { cn } from "@/lib/utils";

const EASE = [0.23, 1, 0.32, 1] as const;
/** How long the check mark stays before the copy icon returns, in ms. */
const CONFIRM_MS = 1500;

export function CopyButton({
  text,
  className,
  eventName = "copy_code",
  eventLabel,
}: {
  text: string;
  className?: string;
  /** Analytics event name. Default "copy_code". */
  eventName?: string;
  /** What was copied, such as a slug or filename. */
  eventLabel?: string;
}) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reduce = useReducedMotion();

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // Clipboard access can be denied. The icon stays as copy so nothing claims success.
      return;
    }
    setCopied(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), CONFIRM_MS);
    trackEvent(eventName, { label: eventLabel, chars: text.length });
  };

  return (
    <Button
      variant="secondary"
      size="icon"
      onClick={copy}
      aria-label={copied ? "Copied" : "Copy code"}
      className={cn("text-muted-foreground hover:text-foreground", className)}
    >
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={copied ? "check" : "copy"}
          initial={reduce ? false : { opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.6, transition: { duration: reduce ? 0 : 0.1, ease: EASE } }}
          transition={{ duration: reduce ? 0 : 0.15, ease: EASE }}
          className="inline-flex"
        >
          {copied ? (
            <Check aria-hidden="true" className="h-3.5 w-3.5 text-(--color-success)" />
          ) : (
            <Copy aria-hidden="true" className="h-3.5 w-3.5" />
          )}
        </motion.span>
      </AnimatePresence>
    </Button>
  );
}

"use client";

import { Check, Copy, TriangleAlert } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/motion/button";
import { trackEvent } from "@/lib/analytics";

type Status = "idle" | "busy" | "done" | "failed";

const EASE = [0.23, 1, 0.32, 1] as const;
/** How long the result stays on the button before it resets, in ms. */
const RESET_MS = 2000;

const LABEL: Record<Status, string> = {
  idle: "Copy page",
  busy: "Copying",
  done: "Copied",
  failed: "Try again",
};

/** Copies the component page as Markdown, ready to paste into a chat or a doc. */
export function CopyPage({
  markdownPath,
  componentName,
}: {
  markdownPath: string;
  componentName: string;
}) {
  const [status, setStatus] = useState<Status>("idle");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reduce = useReducedMotion();

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  const copy = async () => {
    setStatus("busy");
    try {
      const response = await fetch(markdownPath);
      if (!response.ok) throw new Error(`Markdown request failed with ${response.status}`);
      const markdown = await response.text();
      await navigator.clipboard.writeText(markdown);
      setStatus("done");
      trackEvent("copy_component_page", { label: componentName, chars: markdown.length });
    } catch (error) {
      console.warn("Copy page failed", error);
      setStatus("failed");
    }
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setStatus("idle"), RESET_MS);
  };

  const Icon = status === "done" ? Check : status === "failed" ? TriangleAlert : Copy;

  return (
    <Button
      variant="secondary"
      size="sm"
      onClick={copy}
      disabled={status === "busy"}
      // A fixed width keeps the button from resizing as its label changes.
      className="hidden w-28 justify-start sm:inline-flex"
    >
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={status === "busy" ? "idle" : status}
          initial={reduce ? false : { opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.6, transition: { duration: reduce ? 0 : 0.1, ease: EASE } }}
          transition={{ duration: reduce ? 0 : 0.15, ease: EASE }}
          className="inline-flex"
        >
          <Icon aria-hidden="true" className="h-3.5 w-3.5" />
        </motion.span>
      </AnimatePresence>
      <span aria-live="polite">{LABEL[status]}</span>
    </Button>
  );
}

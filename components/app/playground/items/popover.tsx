"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useState } from "react";
import { EASE_OUT } from "@/lib/ease";
import { fmtNum, num, type PlaygroundItem, str, type Values } from "../core";

/** Exits run a little quicker than entrances. */
const EXIT_RATIO = 0.7;

function PopoverDemo({ values }: { values: Values }) {
  const reduce = useReducedMotion();
  const [open, setOpen] = useState(true);
  const origin = str(values, "origin", "trigger") === "trigger" ? "top center" : "center";
  const startScale = num(values, "startScale", 0.95);
  const duration = num(values, "duration", 0.2);

  return (
    <div className="flex h-64 flex-col items-center">
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="inline-flex h-10 touch-manipulation items-center rounded-full bg-primary px-5 text-sm font-medium text-primary-foreground transition-transform duration-150 ease-out active:scale-[0.97]"
      >
        Menu
      </button>
      <AnimatePresence>
        {open ? (
          <motion.div
            key="panel"
            initial={reduce ? { opacity: 0 } : { opacity: 0, scale: startScale }}
            animate={{ opacity: 1, scale: 1 }}
            exit={
              reduce
                ? { opacity: 0, transition: { duration: 0 } }
                : {
                    opacity: 0,
                    scale: startScale,
                    transition: { duration: duration * EXIT_RATIO, ease: EASE_OUT },
                  }
            }
            transition={reduce ? { duration: 0 } : { duration, ease: EASE_OUT }}
            style={{ transformOrigin: origin }}
            className="mt-2 flex w-48 flex-col gap-1.5 rounded-xl bg-background p-2 shadow-lg"
          >
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-8 rounded-md bg-muted" />
            ))}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

function PopoverPreview({ values, replayKey }: { values: Values; replayKey: number }) {
  // Remounting on replay reopens the panel so the entrance plays again.
  return <PopoverDemo key={replayKey} values={values} />;
}

export const popoverItem: PlaygroundItem = {
  slug: "popover",
  label: "Popover",
  blurb:
    "Dropdowns should grow out of the button that opened them, start close to full size, and close a little faster than they open.",
  controls: [
    {
      kind: "select",
      key: "origin",
      label: "Grows from",
      hint: "Growing out of the trigger keeps the connection between button and menu clear.",
      options: [
        { label: "Trigger", value: "trigger" },
        { label: "Center", value: "center" },
      ],
    },
    {
      kind: "slider",
      key: "startScale",
      label: "Starting scale",
      hint: "Starting near 0.95 looks natural. Starting at 0 looks like it came from nowhere.",
      min: 0,
      max: 1,
      step: 0.01,
    },
    {
      kind: "slider",
      key: "duration",
      label: "Duration",
      hint: "Dropdowns and popovers feel right between 150 and 250ms.",
      min: 0.05,
      max: 0.8,
      step: 0.01,
      unit: "s",
    },
  ],
  defaults: { origin: "trigger", startScale: 0.95, duration: 0.2 },
  Preview: PopoverPreview,
  toCode: (v) => {
    const duration = num(v, "duration", 0.2);
    const scale = fmtNum(num(v, "startScale", 0.95));
    const origin = str(v, "origin", "trigger") === "trigger" ? "top center" : "center";
    return `import { AnimatePresence, motion } from "motion/react";

const ease = [0.23, 1, 0.32, 1];

export function Menu({ open }: { open: boolean }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, scale: ${scale} }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: ${scale}, transition: { duration: ${fmtNum(duration * EXIT_RATIO)}, ease } }}
          transition={{ duration: ${fmtNum(duration)}, ease }}
          style={{ transformOrigin: "${origin}" }}
        />
      )}
    </AnimatePresence>
  );
}`;
  },
};

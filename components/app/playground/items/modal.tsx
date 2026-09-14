"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useState } from "react";
import { EASE_OUT } from "@/lib/ease";
import { fmtNum, num, type PlaygroundItem, type Values } from "../core";

function ModalDemo({ values }: { values: Values }) {
  const reduce = useReducedMotion();
  const [open, setOpen] = useState(true);
  const enter = reduce ? 0 : num(values, "enter", 0.25);
  const exit = reduce ? 0 : num(values, "exit", 0.15);
  // Overlay and panel share one timing so they move as a single unit.
  const enterT = { duration: enter, ease: EASE_OUT };
  const exitT = { duration: exit, ease: EASE_OUT };

  return (
    <div className="relative mx-auto flex h-64 w-full max-w-md items-center justify-center overflow-hidden rounded-xl">
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex h-10 touch-manipulation items-center rounded-full bg-primary px-5 text-sm font-medium text-primary-foreground transition-transform duration-150 ease-out active:scale-[0.97]"
      >
        Open
      </button>
      <AnimatePresence>
        {open ? (
          <motion.button
            key="overlay"
            type="button"
            aria-label="Close dialog"
            onClick={() => setOpen(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: exitT }}
            transition={enterT}
            className="absolute inset-0 bg-foreground/10"
          />
        ) : null}
        {open ? (
          <motion.div
            key="panel"
            role="dialog"
            aria-label="Example dialog"
            initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={reduce ? { opacity: 0, transition: exitT } : { opacity: 0, scale: 0.97, transition: exitT }}
            transition={enterT}
            className="absolute flex w-60 flex-col gap-2 rounded-2xl bg-background p-4 shadow-xl"
          >
            <div className="h-3 w-24 rounded-full bg-muted" />
            <div className="h-3 w-40 rounded-full bg-muted" />
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="mt-3 inline-flex h-8 touch-manipulation items-center self-end rounded-full bg-primary px-4 text-xs font-medium text-primary-foreground transition-transform duration-150 ease-out active:scale-[0.97]"
            >
              Close
            </button>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

function ModalPreview({ values, replayKey }: { values: Values; replayKey: number }) {
  // Remounting on replay reopens the dialog so the entrance plays again.
  return <ModalDemo key={replayKey} values={values} />;
}

export const modalItem: PlaygroundItem = {
  slug: "modal",
  label: "Modal",
  blurb:
    "A dialog and its overlay move together with the same easing. Closing can be quicker than opening because the person has already decided to leave.",
  controls: [
    {
      kind: "slider",
      key: "enter",
      label: "Open duration",
      hint: "Modals and drawers feel right between 200 and 300ms.",
      min: 0.05,
      max: 0.8,
      step: 0.01,
      unit: "s",
    },
    {
      kind: "slider",
      key: "exit",
      label: "Close duration",
      hint: "Keep it shorter than the open duration.",
      min: 0.05,
      max: 0.8,
      step: 0.01,
      unit: "s",
    },
  ],
  defaults: { enter: 0.25, exit: 0.15 },
  Preview: ModalPreview,
  toCode: (v) => {
    const enter = fmtNum(num(v, "enter", 0.25));
    const exit = fmtNum(num(v, "exit", 0.15));
    return `import { AnimatePresence, motion } from "motion/react";

const ease = [0.23, 1, 0.32, 1];
const enter = { duration: ${enter}, ease };
const exit = { duration: ${exit}, ease };

export function Dialog({ open }: { open: boolean }) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: exit }}
            transition={enter}
          />
          <motion.div
            role="dialog"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97, transition: exit }}
            transition={enter}
          />
        </>
      )}
    </AnimatePresence>
  );
}`;
  },
};

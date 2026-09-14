"use client";

import { motion, useReducedMotion } from "motion/react";
import { EASE_OUT } from "@/lib/ease";
import { fmtNum, num, type PlaygroundItem, type Values } from "../core";

function PressPreview({ values }: { values: Values; replayKey: number }) {
  const reduce = useReducedMotion();
  const scale = num(values, "scale", 0.97);
  const duration = num(values, "duration", 0.15);

  return (
    <div className="flex justify-center">
      <motion.button
        type="button"
        whileTap={reduce ? undefined : { scale }}
        transition={{ duration, ease: EASE_OUT }}
        className="h-12 touch-manipulation rounded-full bg-primary px-8 text-sm font-medium text-primary-foreground"
      >
        Press me
      </motion.button>
    </div>
  );
}

export const pressItem: PlaygroundItem = {
  slug: "press",
  label: "Press",
  blurb:
    "Buttons should react the moment they are touched. A small scale on press makes the interface feel physical and responsive.",
  controls: [
    {
      kind: "slider",
      key: "scale",
      label: "Pressed scale",
      hint: "Around 0.97 feels responsive without looking squishy.",
      min: 0.8,
      max: 1,
      step: 0.01,
    },
    {
      kind: "slider",
      key: "duration",
      label: "Duration",
      hint: "Keep it near 150ms so the button tracks your finger.",
      min: 0.05,
      max: 0.5,
      step: 0.01,
      unit: "s",
    },
  ],
  defaults: { scale: 0.97, duration: 0.15 },
  Preview: PressPreview,
  toCode: (v) => `import { motion } from "motion/react";

export function PressButton() {
  return (
    <motion.button
      whileTap={{ scale: ${fmtNum(num(v, "scale", 0.97))} }}
      transition={{ duration: ${fmtNum(num(v, "duration", 0.15))}, ease: [0.23, 1, 0.32, 1] }}
    >
      Press me
    </motion.button>
  );
}`,
};

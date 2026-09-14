"use client";

import { useReducedMotion } from "motion/react";
import { fmtNum, num, type PlaygroundItem, str, type Values } from "../core";
import { TravelPreview } from "./travel-preview";

/** Named curves from the easing guidance, in order of how often to reach for them. */
const CURVES: Record<string, { label: string; value: number[] }> = {
  "ease-out": { label: "Ease out", value: [0.23, 1, 0.32, 1] },
  "ease-in-out": { label: "Ease in out", value: [0.645, 0.045, 0.355, 1] },
  ease: { label: "Ease", value: [0.25, 0.1, 0.25, 1] },
  linear: { label: "Linear", value: [0, 0, 1, 1] },
};

const curveOf = (values: Values) =>
  (CURVES[str(values, "curve", "ease-out")] ?? CURVES["ease-out"]).value;

function TweenPreview({
  values,
  replayKey,
}: {
  values: Values;
  replayKey: number;
}) {
  const reduce = useReducedMotion();
  return (
    <TravelPreview
      replayKey={replayKey}
      transition={
        reduce
          ? { duration: 0 }
          : { duration: num(values, "duration", 0.25), ease: curveOf(values) }
      }
    />
  );
}

export const tweenItem: PlaygroundItem = {
  slug: "easing",
  label: "Easing",
  blurb:
    "Use ease-out for things entering or leaving, ease-in-out for things moving on screen, and ease for hover and color changes.",
  controls: [
    {
      kind: "select",
      key: "curve",
      label: "Curve",
      hint: "Ease out is the right default for most interface motion.",
      options: Object.entries(CURVES).map(([value, c]) => ({ label: c.label, value })),
    },
    {
      kind: "slider",
      key: "duration",
      label: "Duration",
      hint: "Most interface motion lands between 150 and 300ms.",
      min: 0.05,
      max: 1,
      step: 0.05,
      unit: "s",
    },
  ],
  defaults: { curve: "ease-out", duration: 0.25 },
  Preview: TweenPreview,
  toCode: (v) => `import { motion } from "motion/react";

export function Demo() {
  return (
    <motion.div
      animate={{ x: 120 }}
      transition={{
        duration: ${fmtNum(num(v, "duration", 0.25))},
        ease: [${curveOf(v).map(fmtNum).join(", ")}],
      }}
    />
  );
}`,
};

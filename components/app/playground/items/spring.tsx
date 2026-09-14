"use client";

import { useReducedMotion } from "motion/react";
import { fmtNum, num, type PlaygroundItem, type Values } from "../core";
import { TravelPreview } from "./travel-preview";

function SpringPreview({
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
          : {
              type: "spring",
              duration: num(values, "duration", 0.4),
              bounce: num(values, "bounce", 0),
            }
      }
    />
  );
}

export const springItem: PlaygroundItem = {
  slug: "spring",
  label: "Spring",
  blurb:
    "Springs keep their velocity when interrupted, which suits drags and gestures. Leave bounce at zero for most product UI.",
  controls: [
    {
      kind: "slider",
      key: "duration",
      label: "Duration",
      hint: "Roughly how long the spring takes to settle.",
      min: 0.1,
      max: 1.5,
      step: 0.05,
      unit: "s",
    },
    {
      kind: "slider",
      key: "bounce",
      label: "Bounce",
      hint: "Keep it between 0.1 and 0.3 when you want a playful touch.",
      min: 0,
      max: 0.8,
      step: 0.05,
    },
  ],
  defaults: { duration: 0.4, bounce: 0 },
  Preview: SpringPreview,
  toCode: (v) => `import { motion } from "motion/react";

export function Demo() {
  return (
    <motion.div
      animate={{ x: 120 }}
      transition={{
        type: "spring",
        duration: ${fmtNum(num(v, "duration", 0.4))},
        bounce: ${fmtNum(num(v, "bounce", 0))},
      }}
    />
  );
}`,
};

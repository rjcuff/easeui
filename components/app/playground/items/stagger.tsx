"use client";

import { motion, useReducedMotion } from "motion/react";
import { EASE_OUT } from "@/lib/ease";
import { fmtNum, num, type PlaygroundItem, type Values } from "../core";

function StaggerPreview({
  values,
  replayKey,
}: {
  values: Values;
  replayKey: number;
}) {
  const reduce = useReducedMotion();
  const count = Math.round(num(values, "count", 5));
  const stagger = num(values, "stagger", 0.04);
  const duration = num(values, "duration", 0.25);

  return (
    <motion.ul
      key={replayKey}
      initial="hidden"
      animate="show"
      variants={{
        show: { transition: reduce ? { duration: 0 } : { staggerChildren: stagger } },
      }}
      className="mx-auto flex w-full max-w-xs flex-col gap-2"
    >
      {Array.from({ length: count }, (_, i) => (
        <motion.li
          // biome-ignore lint/suspicious/noArrayIndexKey: fixed-order placeholder rows
          key={i}
          variants={{
            hidden: reduce ? { opacity: 0 } : { opacity: 0, y: 8, scale: 0.95 },
            show: { opacity: 1, y: 0, scale: 1 },
          }}
          transition={reduce ? { duration: 0 } : { duration, ease: EASE_OUT }}
          className="flex h-11 items-center gap-3 rounded-xl bg-background px-3"
        >
          <span className="h-6 w-6 shrink-0 rounded-full bg-muted" />
          <span className="h-2.5 flex-1 rounded-full bg-muted" />
        </motion.li>
      ))}
    </motion.ul>
  );
}

export const staggerItem: PlaygroundItem = {
  slug: "stagger",
  label: "Stagger",
  blurb:
    "When a list appears, offset each row by about 40ms so items arrive in sequence instead of flashing in together. Keep the whole sequence short.",
  controls: [
    {
      kind: "slider",
      key: "count",
      label: "Rows",
      hint: "How many items animate in.",
      min: 3,
      max: 8,
      step: 1,
    },
    {
      kind: "slider",
      key: "stagger",
      label: "Offset",
      hint: "Gap between each row starting. Around 40ms reads as arrival.",
      min: 0,
      max: 0.2,
      step: 0.01,
      unit: "s",
    },
    {
      kind: "slider",
      key: "duration",
      label: "Duration",
      hint: "How long each row takes to settle in.",
      min: 0.1,
      max: 0.6,
      step: 0.01,
      unit: "s",
    },
  ],
  defaults: { count: 5, stagger: 0.04, duration: 0.25 },
  Preview: StaggerPreview,
  toCode: (v) => `import { motion } from "motion/react";

const list = {
  show: { transition: { staggerChildren: ${fmtNum(num(v, "stagger", 0.04))} } },
};

const row = {
  hidden: { opacity: 0, y: 8, scale: 0.95 },
  show: { opacity: 1, y: 0, scale: 1 },
};

export function List({ items }: { items: string[] }) {
  return (
    <motion.ul initial="hidden" animate="show" variants={list}>
      {items.map((item) => (
        <motion.li
          key={item}
          variants={row}
          transition={{ duration: ${fmtNum(num(v, "duration", 0.25))}, ease: [0.23, 1, 0.32, 1] }}
        >
          {item}
        </motion.li>
      ))}
    </motion.ul>
  );
}`,
};

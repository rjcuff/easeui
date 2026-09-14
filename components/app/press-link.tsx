"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import type { ComponentProps } from "react";
import { SPRING_PRESS } from "@/lib/ease";

const MotionLink = motion.create(Link);

export interface PressLinkProps extends ComponentProps<typeof MotionLink> {
  pressScale?: number;
}

/** Link that presses in slightly when tapped. No hover scale. */
export function PressLink({ pressScale = 0.97, ...props }: PressLinkProps) {
  const reduce = useReducedMotion();
  return (
    <MotionLink
      whileTap={reduce ? undefined : { scale: pressScale }}
      transition={SPRING_PRESS}
      {...props}
    />
  );
}

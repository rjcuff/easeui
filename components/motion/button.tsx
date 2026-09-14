"use client";

import { type HTMLMotionProps, motion, useReducedMotion } from "motion/react";
import { forwardRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export type ButtonVariant = "primary" | "secondary" | "outline" | "ghost";
export type ButtonSize = "sm" | "md" | "lg" | "icon";

export interface ButtonProps extends Omit<HTMLMotionProps<"button">, "children"> {
  /** Visual style. Default "primary". */
  variant?: ButtonVariant;
  /** Height and padding. "icon" is a square button for a single icon. Default "md". */
  size?: ButtonSize;
  children?: ReactNode;
}

// A quick press confirms the tap before the action finishes.
const PRESS = { scale: 0.97 };
const PRESS_TRANSITION = { duration: 0.15, ease: [0.23, 1, 0.32, 1] } as const;

// Hairline rings are drawn with box-shadow so they blend with any background.
const VARIANT_CLASS: Record<ButtonVariant, string> = {
  primary: "bg-foreground text-background hover:bg-foreground/90",
  secondary:
    "bg-card text-foreground shadow-[0_0_0_1px_var(--border)] hover:bg-muted",
  outline:
    "text-foreground shadow-[0_0_0_1px_var(--border-strong)] hover:bg-foreground/5",
  ghost: "text-muted-foreground hover:bg-foreground/5 hover:text-foreground",
};

// Small sizes grow an invisible hit area so the tap target stays around 44px.
const SIZE_CLASS: Record<ButtonSize, string> = {
  sm: "h-8 gap-1.5 px-3 text-xs after:absolute after:-inset-1.5",
  md: "h-10 gap-2 px-4 text-sm",
  lg: "h-12 gap-2 px-5 text-base",
  icon: "h-9 w-9 after:absolute after:-inset-1",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = "primary", size = "md", type = "button", className, children, ...props },
  ref,
) {
  const reduce = useReducedMotion();

  return (
    <motion.button
      ref={ref}
      type={type}
      whileTap={reduce ? undefined : PRESS}
      transition={PRESS_TRANSITION}
      className={cn(
        "relative inline-flex shrink-0 touch-manipulation select-none items-center justify-center rounded-full font-medium outline-none",
        "transition-[background-color,color,box-shadow] duration-150 ease-out",
        "focus-visible:ring-2 focus-visible:ring-foreground/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        "disabled:pointer-events-none disabled:opacity-50",
        VARIANT_CLASS[variant],
        SIZE_CLASS[size],
        className,
      )}
      {...props}
    >
      {children}
    </motion.button>
  );
});

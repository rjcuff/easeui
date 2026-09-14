"use client";

import { ThemeToggle, type ThemeToggleVariant } from "@/components/motion/theme-toggle";

const VARIANTS: { variant: ThemeToggleVariant; label: string }[] = [
  { variant: "circle", label: "Circle" },
  { variant: "ripple", label: "Ripple" },
];

export function ThemeTogglePreview() {
  return (
    <div className="flex w-full items-center justify-center gap-8">
      {VARIANTS.map(({ variant, label }) => (
        <div key={variant} className="flex flex-col items-center gap-2">
          <ThemeToggle
            variant={variant}
            className="h-11 w-11 rounded-xl bg-background shadow-[0_0_0_1px_var(--border-strong)]"
            iconClassName="h-5 w-5"
          />
          <span className="text-[11px] text-muted-foreground">{label}</span>
        </div>
      ))}
    </div>
  );
}

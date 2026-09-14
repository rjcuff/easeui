"use client";

import { ThemeToggle } from "@/components/motion/theme-toggle";

export function ThemeTogglePreview() {
  return (
    <div className="flex items-center gap-3 rounded-full bg-background py-1.5 pl-4 pr-1.5 shadow-[0_0_0_1px_var(--border)]">
      <span className="text-sm text-muted-foreground">Appearance</span>
      <ThemeToggle
        variant="circle"
        className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-muted text-foreground"
        iconClassName="h-4 w-4"
      />
      <ThemeToggle
        variant="ripple"
        className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-foreground text-background"
        iconClassName="h-4 w-4"
      />
    </div>
  );
}

"use client";

import { Moon, Sun } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useTheme } from "next-themes";
import {
  type ComponentPropsWithoutRef,
  useCallback,
  useEffect,
  useState,
} from "react";
import { cn } from "@/lib/utils";

/** "circle" grows from the center of the screen, "ripple" grows from the button. */
export type ThemeToggleVariant = "circle" | "ripple";

export interface ThemeToggleProps
  extends Omit<ComponentPropsWithoutRef<"button">, "children" | "onClick"> {
  /** Where the new theme spreads from. Default "circle". */
  variant?: ThemeToggleVariant;
  iconClassName?: string;
}

const EASE = [0.23, 1, 0.32, 1] as const;
const STYLE_ID = "easeui-theme-reveal";

// The new theme is revealed as a growing circle. The old page stays still
// underneath, so nothing on screen appears to move.
const REVEAL_CSS = `
html[data-theme-reveal]::view-transition-old(root),
html[data-theme-reveal]::view-transition-new(root) {
  animation: none;
  mix-blend-mode: normal;
}
html[data-theme-reveal]::view-transition-new(root) {
  animation: easeui-theme-reveal 400ms cubic-bezier(0.23, 1, 0.32, 1);
}
@keyframes easeui-theme-reveal {
  from { clip-path: circle(0px at var(--reveal-x) var(--reveal-y)); }
  to { clip-path: circle(var(--reveal-r) at var(--reveal-x) var(--reveal-y)); }
}
`;

type Point = { x: number; y: number };

/** Distance from a point to the farthest corner of the viewport. */
function coverRadius({ x, y }: Point) {
  return Math.ceil(
    Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y)),
  );
}

export function useThemeToggle({ variant = "circle" }: { variant?: ThemeToggleVariant } = {}) {
  const { resolvedTheme, setTheme } = useTheme();
  const reduce = useReducedMotion();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const existing = document.getElementById(STYLE_ID);
    if (existing) {
      existing.textContent = REVEAL_CSS;
      return;
    }
    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = REVEAL_CSS;
    document.head.appendChild(style);
  }, []);

  const toggle = useCallback(
    (origin?: Point) => {
      const next = resolvedTheme === "dark" ? "light" : "dark";
      const doc = document as Document & {
        startViewTransition?: (update: () => void) => { finished: Promise<void> };
      };
      if (reduce || !doc.startViewTransition) {
        setTheme(next);
        return;
      }

      const point =
        variant === "ripple" && origin
          ? origin
          : { x: window.innerWidth / 2, y: window.innerHeight / 2 };
      const root = document.documentElement;
      root.style.setProperty("--reveal-x", `${point.x}px`);
      root.style.setProperty("--reveal-y", `${point.y}px`);
      root.style.setProperty("--reveal-r", `${coverRadius(point)}px`);
      root.dataset.themeReveal = "";

      doc
        .startViewTransition(() => setTheme(next))
        .finished.finally(() => {
          delete root.dataset.themeReveal;
        });
    },
    [reduce, resolvedTheme, setTheme, variant],
  );

  return { isDark: mounted && resolvedTheme === "dark", mounted, toggle };
}

export function ThemeToggle({
  variant = "circle",
  className,
  iconClassName,
  ...props
}: ThemeToggleProps) {
  const { isDark, mounted, toggle } = useThemeToggle({ variant });
  const reduce = useReducedMotion();
  const Icon = isDark ? Sun : Moon;

  return (
    <button
      type="button"
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      onClick={(event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        toggle({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });
      }}
      className={cn(
        "relative inline-flex touch-manipulation items-center justify-center overflow-hidden",
        className,
      )}
      {...props}
    >
      {mounted ? (
        // The icon swaps by fading and scaling in place.
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={isDark ? "sun" : "moon"}
            initial={reduce ? false : { opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.6, transition: { duration: reduce ? 0 : 0.1, ease: EASE } }}
            transition={{ duration: reduce ? 0 : 0.15, ease: EASE }}
            className="inline-flex"
          >
            <Icon aria-hidden="true" className={cn("h-4 w-4", iconClassName)} />
          </motion.span>
        </AnimatePresence>
      ) : (
        <span aria-hidden="true" className={cn("h-4 w-4", iconClassName)} />
      )}
    </button>
  );
}

"use client";

import { motion, useReducedMotion } from "motion/react";
import { usePathname } from "next/navigation";
import { type ReactNode, useEffect, useRef, useState } from "react";
import { EASE_OUT } from "@/lib/ease";

// Page transitions stay in the 300ms range and travel a few pixels at most, so
// navigation feels immediate. Reduced motion skips the animation entirely.
export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  // Skip enter animation on first load so LCP element is visible immediately.
  // After mount, navigations animate normally.
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <motion.div
      ref={ref}
      key={pathname}
      initial={mounted && !reduce ? { opacity: 0, y: 4 } : false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: EASE_OUT }}
      onAnimationComplete={() => {
        // A lingering transform would re-anchor any fixed descendants to this box.
        const el = ref.current;
        if (!el) return;
        el.style.transform = "none";
        el.style.willChange = "auto";
      }}
    >
      {children}
    </motion.div>
  );
}

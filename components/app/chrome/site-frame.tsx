"use client";

import { motion, useReducedMotion } from "motion/react";
import { usePathname } from "next/navigation";
import { type ReactNode, useEffect, useRef } from "react";

/**
 * Wraps each page. Navigating fades the new page in quickly. The first load
 * shows the page at once, and only opacity animates so fixed elements inside
 * stay anchored to the viewport.
 */
export function SiteFrame({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const reduce = useReducedMotion();
  const firstRender = useRef(true);

  useEffect(() => {
    firstRender.current = false;
  }, []);

  const padded = pathname.startsWith("/components") || pathname.startsWith("/docs");

  return (
    <motion.div
      key={pathname}
      initial={firstRender.current || reduce ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.15, ease: "easeOut" }}
      className={padded ? "py-8" : undefined}
    >
      {children}
    </motion.div>
  );
}

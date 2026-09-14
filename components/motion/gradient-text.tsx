"use client";

import { type ComponentProps, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

/** A full color wheel. Painted three times larger than the text so only part of it shows at once. */
const SPECTRUM =
  "conic-gradient(from 0deg, hsl(0 90% 60%), hsl(60 90% 55%), hsl(120 85% 50%), hsl(180 85% 50%), hsl(240 90% 65%), hsl(300 85% 60%), hsl(360 90% 60%))";

/** The visible window circles around the oversized gradient, so the colors drift through the text. */
const DRIFT: Keyframe[] = [
  { backgroundPosition: "0% 50%" },
  { backgroundPosition: "50% 100%" },
  { backgroundPosition: "100% 50%" },
  { backgroundPosition: "50% 0%" },
  { backgroundPosition: "0% 50%" },
];

export interface GradientTextProps extends Omit<ComponentProps<"span">, "ref"> {
  /** Fills the text with the drifting spectrum. When false the text is muted. Default true. */
  active?: boolean;
  /** Seconds for one full loop. Default 5.5. */
  duration?: number;
}

/**
 * Text filled with a slowly drifting rainbow. The drift runs through the Web
 * Animations API, so there is no global CSS to install. It pauses while off
 * screen, and with reduced motion the gradient stays still.
 */
export function GradientText({
  active = true,
  duration = 5.5,
  className,
  style,
  children,
  ...props
}: GradientTextProps) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!active || !element || typeof element.animate !== "function") return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const animation = element.animate(DRIFT, {
      duration: duration * 1000,
      iterations: Number.POSITIVE_INFINITY,
      easing: "linear",
    });
    let onScreen = true;

    const sync = () => {
      if (reducedMotion.matches || !onScreen) animation.pause();
      else animation.play();
    };

    // Nothing to animate while the text is scrolled out of view.
    const observer = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting;
      sync();
    });
    observer.observe(element);
    reducedMotion.addEventListener("change", sync);
    sync();

    return () => {
      observer.disconnect();
      reducedMotion.removeEventListener("change", sync);
      animation.cancel();
    };
  }, [active, duration]);

  return (
    <span
      ref={ref}
      data-active={active || undefined}
      className={cn(
        // Keeps descenders like "y" inside the clip; the negative margin cancels the padding.
        "inline-block pb-[0.15em] -mb-[0.15em]",
        active
          ? "bg-clip-text font-semibold text-transparent [-webkit-background-clip:text]"
          : "text-muted-foreground",
        className,
      )}
      style={active ? { backgroundImage: SPECTRUM, backgroundSize: "300% 300%", ...style } : style}
      {...props}
    >
      {children}
    </span>
  );
}

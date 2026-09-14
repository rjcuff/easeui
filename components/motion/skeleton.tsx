"use client";

import { type ComponentProps, type ReactNode, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

/** A soft light band. Fixed to the viewport, so every skeleton on the page shimmers as one. */
const BAND =
  "linear-gradient(90deg, transparent, color-mix(in oklch, var(--foreground) 7%, transparent), transparent)";

const SWEEP: Keyframe[] = [{ backgroundPosition: "-50vw 0" }, { backgroundPosition: "150vw 0" }];
const SWEEP_MS = 1800;

export interface SkeletonProps extends Omit<ComponentProps<"div">, "ref" | "children"> {
  /** Shows the placeholder. With children, false crossfades to the real content. Default true. */
  loading?: boolean;
  /** Real content. It keeps its space while loading, so nothing shifts when it appears. */
  children?: ReactNode;
}

function useShimmer(active: boolean) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!active || !element || typeof element.animate !== "function") return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const animation = element.animate(SWEEP, {
      duration: SWEEP_MS,
      iterations: Number.POSITIVE_INFINITY,
      easing: "ease-in-out",
    });
    // Starting every skeleton at the same moment keeps their bands lined up.
    animation.startTime = 0;
    const sync = () => (reducedMotion.matches ? animation.pause() : animation.play());
    sync();
    reducedMotion.addEventListener("change", sync);
    return () => {
      reducedMotion.removeEventListener("change", sync);
      animation.cancel();
    };
  }, [active]);

  return ref;
}

/**
 * A loading placeholder with a quiet shimmer. Size it with classes, or wrap
 * the real content so the placeholder takes its exact shape and fades away
 * when loading ends.
 */
export function Skeleton({ loading = true, children, className, ...props }: SkeletonProps) {
  const shimmer = useShimmer(loading);

  const placeholder = (
    <span
      ref={shimmer}
      aria-hidden="true"
      className={cn(
        "block rounded-lg bg-muted transition-opacity duration-200 ease-out motion-reduce:transition-none",
        children ? "absolute inset-0" : "h-4 w-full",
        !loading && "opacity-0",
        !children && className,
      )}
      style={{
        backgroundImage: BAND,
        backgroundSize: "50vw 100%",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
    />
  );

  if (!children) return placeholder;

  return (
    <div
      aria-busy={loading}
      className={cn("relative", className)}
      {...props}
    >
      <div
        aria-hidden={loading}
        inert={loading}
        className={cn(
          "transition-opacity duration-200 ease-out motion-reduce:transition-none",
          loading ? "opacity-0" : "opacity-100",
        )}
      >
        {children}
      </div>
      {placeholder}
    </div>
  );
}

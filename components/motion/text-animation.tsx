"use client";

import { motion, useReducedMotion } from "motion/react";
import { type ElementType, type ReactNode, useEffect, useRef, useState } from "react";
import { EASE_OUT } from "@/lib/ease";
import { cn } from "@/lib/utils";

const SCRAMBLE_GLYPHS = "ABCDEFGHJKLMNPQRSTUVWXYZ0123456789#%&@$?/";
/** Scramble tick rate. Fast enough to read as noise, cheap enough for a plain interval. */
const SCRAMBLE_FRAME_MS = 40;
/**
 * The shimmer highlight sweeps across an oversized gradient, on loop. With a
 * 200% background-size, a background-position swing of exactly 200 points
 * moves the paint by exactly one tile width (the pixel shift is (container -
 * image) * ΔP/100 = -container * 2, i.e. one image-width, since image =
 * 2×container) — so the pattern lines back up perfectly and the loop
 * restart is invisible instead of jumping.
 */
const SHIMMER_SWEEP: Keyframe[] = [{ backgroundPosition: "200% 0" }, { backgroundPosition: "0% 0" }];

function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export interface TextAnimationProps {
  /** Which animation runs. */
  variant: "scramble" | "reveal" | "shimmer";
  /** Text to animate. Reveal accepts an array to render each entry as its own line. Required for scramble and reveal. */
  text?: string | string[];
  /** Content to animate. Shimmer takes children instead of `text`, so it can wrap rich markup. */
  children?: ReactNode;
  className?: string;
  /** Scramble: max duration in milliseconds, default 900. Shimmer: seconds per sweep, default 2.5. */
  duration?: number;
  /** Scramble only. Characters sampled while unresolved positions are scrambling. */
  glyphs?: string;
  /** Reveal only. Element the lines render inside. Default span. */
  as?: ElementType;
  /** Reveal only. Splits each line into words or characters. Default word. */
  split?: "word" | "char";
  /** Reveal only. Delay between each word or character, in seconds. Default 0.09. */
  stagger?: number;
  /** Reveal only. Delay before the first element, in seconds. Default 0. */
  delay?: number;
  /** Reveal only. Starting blur, in pixels. Default 12. */
  blur?: number;
  /** Reveal only. Starting vertical offset. Default "40%". */
  yOffset?: string | number;
  /** Reveal only. Switches from the default tween to a spring with these physical params. */
  spring?: { stiffness?: number; damping?: number; mass?: number };
  /** Reveal only. With whileInView, only plays the first time it enters view. Default true. */
  once?: boolean;
  /** Reveal only. Reveals when scrolled into view instead of on mount. Default false. */
  whileInView?: boolean;
}

function ScrambleText({ text, duration = 900, glyphs = SCRAMBLE_GLYPHS, className }: TextAnimationProps) {
  const [display, setDisplay] = useState(text as string);
  const frame = useRef(0);

  useEffect(() => {
    const value = text as string;
    if (prefersReducedMotion()) {
      setDisplay(value);
      return;
    }

    const totalFrames = Math.max(1, Math.round(duration / SCRAMBLE_FRAME_MS));
    frame.current = 0;

    const id = window.setInterval(() => {
      frame.current += 1;
      const progress = frame.current / totalFrames;

      setDisplay(
        value
          .split("")
          .map((char, index) => {
            if (char === " ") return char;
            // Resolves left to right, each position settling a bit before the next.
            const resolvesAt = (index + 1) / value.length;
            return progress >= resolvesAt ? char : glyphs[Math.floor(Math.random() * glyphs.length)];
          })
          .join(""),
      );

      if (frame.current >= totalFrames) window.clearInterval(id);
    }, SCRAMBLE_FRAME_MS);

    return () => window.clearInterval(id);
  }, [text, duration, glyphs]);

  return (
    <span className={cn("inline-block", className)}>
      <span aria-hidden="true">{display}</span>
      <span className="sr-only">{text}</span>
    </span>
  );
}

function ShimmerText({ duration = 2.5, className, children }: TextAnimationProps) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element || typeof element.animate !== "function") return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const animation = element.animate(SHIMMER_SWEEP, {
      duration: duration * 1000,
      iterations: Number.POSITIVE_INFINITY,
      easing: "linear",
    });
    let onScreen = true;

    const sync = () => {
      if (reducedMotion.matches || !onScreen) animation.pause();
      else animation.play();
    };

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
  }, [duration]);

  return (
    <span
      ref={ref}
      className={cn("inline-block bg-clip-text text-transparent [-webkit-background-clip:text]", className)}
      style={{
        backgroundImage:
          "linear-gradient(90deg, var(--muted-foreground) 40%, var(--foreground) 50%, var(--muted-foreground) 60%)",
        backgroundSize: "200% 100%",
      }}
    >
      {children}
    </span>
  );
}

function splitLine(line: string, split: "word" | "char") {
  return split === "char" ? Array.from(line) : line.split(" ");
}

function RevealText({
  text,
  as: As = "span",
  className,
  split = "word",
  stagger = 0.09,
  delay = 0,
  blur = 12,
  yOffset = "40%",
  spring,
  once = true,
  whileInView = false,
}: TextAnimationProps) {
  const reduce = useReducedMotion();
  const lines = Array.isArray(text) ? text : [text as string];
  // A tween reads as a clear per-word cascade at this stagger interval; a spring long
  // enough to feel springy overlaps neighboring words too much and reads as one fade.
  const transition = spring ? { type: "spring" as const, ...spring } : { duration: 0.4, ease: EASE_OUT };

  let index = -1;

  return (
    <As className={cn("block", className)}>
      {lines.map((line, lineIndex) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: lines are a static prop, never reordered.
        <span key={lineIndex} className={cn("block", split === "word" && "flex flex-wrap gap-x-[0.25em]")}>
          {splitLine(line, split).map((token) => {
            index += 1;
            const tokenDelay = delay + index * stagger;
            return (
              // A wrapping overflow-hidden wound clip the blur halo into a hard-edged
              // rectangle per word, which is what made this read as one blurred block
              // instead of each word — so the blur is left free to bleed past the glyph.
              <motion.span
                key={index}
                className="inline-block"
                initial={reduce ? false : { opacity: 0, y: yOffset, filter: `blur(${blur}px)` }}
                animate={whileInView ? undefined : { opacity: 1, y: 0, filter: "blur(0px)" }}
                whileInView={whileInView ? { opacity: 1, y: 0, filter: "blur(0px)" } : undefined}
                viewport={whileInView ? { once } : undefined}
                transition={{ ...transition, delay: tokenDelay }}
              >
                {token === "" ? " " : token}
              </motion.span>
            );
          })}
        </span>
      ))}
    </As>
  );
}

/**
 * One component for animated text, switched with `variant`: `scramble`
 * resolves random glyphs into the final characters, `reveal` slides words or
 * characters up out of a blur, and `shimmer` sweeps a highlight band across a
 * loop for a loading or emphasis state. Reduced motion shows the final text
 * still, with no animation.
 */
export function TextAnimation(props: TextAnimationProps) {
  if (props.variant === "scramble") return <ScrambleText {...props} />;
  if (props.variant === "shimmer") return <ShimmerText {...props} />;
  return <RevealText {...props} />;
}

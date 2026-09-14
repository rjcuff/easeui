"use client";

import { type ReactNode, useLayoutEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

// Cap so a preview never renders larger than intended; only previews bigger
// than the card shrink further to actually fit, so nothing clips. `maxScale`
// per card lets feature tiles show their preview larger than grid tiles.
const MIN_SCALE = 0.22;

// A real desktop width for the preview to render at before it gets scaled
// down, like screenshotting the full-size preview and shrinking the image.
// Without it, a preview whose root is `w-full` has no definite width inside a
// shrink-wrapped box and collapses to its narrowest fixed-size child.
const STAGE_WIDTH = 460;

/**
 * Shrinks a preview to fit the card frame instead of clipping or collapsing.
 * Renders the preview at a fixed stage width, measures its natural height at
 * that width, and scales the whole stage down to fit the card.
 */
export function PreviewFit({
  children,
  overlay,
  maxScale = 0.82,
}: {
  children: ReactNode;
  overlay?: ReactNode;
  maxScale?: number;
}) {
  const outerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const [fitScale, setFitScale] = useState(MIN_SCALE);
  const [measured, setMeasured] = useState(false);

  useLayoutEffect(() => {
    const outer = outerRef.current;
    const stage = stageRef.current;
    if (!outer || !stage) return;

    const measure = () => {
      // clientWidth/offsetHeight are the pre-transform layout size, unlike
      // getBoundingClientRect, which would read an already-scaled box and
      // compound into the wrong scale every render.
      const outerW = outer.clientWidth;
      const outerH = outer.clientHeight;
      const childSizes = Array.from(stage.children, (child) => {
        const element = child as HTMLElement;
        return {
          width: Math.max(element.offsetWidth, element.scrollWidth),
          height: Math.max(element.offsetHeight, element.scrollHeight),
        };
      });
      const contentW = Math.max(
        stage.offsetWidth,
        stage.scrollWidth,
        ...childSizes.map(({ width }) => width),
      );
      const contentH = Math.max(
        stage.offsetHeight,
        stage.scrollHeight,
        ...childSizes.map(({ height }) => height),
      );
      if (!outerW || !outerH || !contentW || !contentH) return;
      const fit = Math.min(
        (outerW * 0.94) / contentW,
        (outerH * 0.94) / contentH,
      );
      setFitScale(Math.max(MIN_SCALE, fit));
      setMeasured(true);
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(outer);
    ro.observe(stage);
    Array.from(stage.children).forEach((child) => {
      ro.observe(child);
    });
    return () => ro.disconnect();
  }, []);

  const scale = Math.min(maxScale, fitScale);

  return (
    <div
      ref={outerRef}
      className="absolute inset-0 flex items-center justify-center overflow-hidden p-4 contain-[paint]"
    >
      <div
        ref={stageRef}
        style={{ width: STAGE_WIDTH, transform: `scale(${scale})` }}
        className={cn(
          "pointer-events-none flex origin-center shrink-0 items-center justify-center [&_*]:!cursor-default",
          !measured && "invisible",
        )}
      >
        {children}
      </div>
      {overlay}
    </div>
  );
}

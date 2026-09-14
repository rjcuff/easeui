"use client";

import { type ReactNode, useLayoutEffect, useRef, useState } from "react";

/** Width the preview lays out at before it is scaled into the card. */
const LAYOUT_WIDTH = 460;
/** Space kept free around the scaled preview, as a share of the frame. */
const FILL = 0.9;

/**
 * Lays a preview out at a desktop width, then scales it down so the whole
 * thing fits its card. Nothing clips and nothing collapses to a narrow column.
 */
export function PreviewFit({ children, maxScale = 0.8 }: { children: ReactNode; maxScale?: number }) {
  const frameRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState<number | null>(null);

  useLayoutEffect(() => {
    const frame = frameRef.current;
    const content = contentRef.current;
    if (!frame || !content) return;

    const fit = () => {
      // offset and client sizes ignore transforms, so the current scale never feeds back in.
      const width = Math.max(content.offsetWidth, content.scrollWidth);
      const height = Math.max(content.offsetHeight, content.scrollHeight);
      if (!width || !height || !frame.clientWidth || !frame.clientHeight) return;
      const next = Math.min(
        maxScale,
        (frame.clientWidth * FILL) / width,
        (frame.clientHeight * FILL) / height,
      );
      setScale(next);
    };

    fit();
    const observer = new ResizeObserver(fit);
    observer.observe(frame);
    observer.observe(content);
    return () => observer.disconnect();
  }, [maxScale]);

  return (
    <div ref={frameRef} className="absolute inset-0 flex items-center justify-center overflow-hidden">
      <div
        ref={contentRef}
        style={{ width: LAYOUT_WIDTH, transform: `scale(${scale ?? 1})`, visibility: scale ? "visible" : "hidden" }}
        // The card link sits above, so the preview is for looking only.
        className="pointer-events-none flex shrink-0 items-center justify-center"
      >
        {children}
      </div>
    </div>
  );
}

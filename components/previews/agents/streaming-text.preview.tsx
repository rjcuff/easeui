"use client";

import { useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";
import { StreamingResponse } from "@/components/motion/streaming-response";
import { StreamingText } from "@/components/motion/streaming-text";

const RESPONSE =
  "Sure, here's a quick summary: the build passed on the first try, two dependencies were flagged as outdated, and the deploy finished in just under three minutes.";
/** Characters per second. A continuous rate reads far smoother than stepping word by word. */
const SPEED = 60;

export function StreamingTextPreview() {
  const reduce = useReducedMotion();
  const [run, setRun] = useState(0);
  const [count, setCount] = useState(reduce ? RESPONSE.length : 0);
  const streaming = count < RESPONSE.length;

  // run is never read in the body; bumping it on Replay is what restarts this effect.
  // biome-ignore lint/correctness/useExhaustiveDependencies: run is intentional, see comment above.
  useEffect(() => {
    if (reduce) return;
    setCount(0);
    const startedAt = performance.now();
    let frame: number;
    const tick = (now: number) => {
      const next = Math.min(RESPONSE.length, Math.floor(((now - startedAt) / 1000) * SPEED));
      setCount(next);
      if (next < RESPONSE.length) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [run, reduce]);

  return (
    <div className="w-full max-w-sm">
      <StreamingResponse
        status={streaming ? "streaming" : "complete"}
        copyText={RESPONSE}
        onRetry={() => setRun((r) => r + 1)}
        showFeedback
      >
        <StreamingText text={RESPONSE.slice(0, count)} streaming={streaming} />
      </StreamingResponse>
    </div>
  );
}

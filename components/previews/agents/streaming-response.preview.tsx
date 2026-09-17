"use client";

import { useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";
import { StreamingResponse } from "@/components/motion/streaming-response";
import { StreamingText } from "@/components/motion/streaming-text";

const RESPONSE =
  "The migration ran clean end to end: three tables backfilled, no locks held longer than a second, and the old columns are now safe to drop.";
const FOLLOW_UPS = ["Which tables were backfilled?", "Show me the rollback plan"];
/** The first run cuts off partway through, so Replay has something to fix. */
const FAILS_ON_ATTEMPT = 0;
/** Characters per second. A continuous rate reads far smoother than stepping word by word. */
const SPEED = 60;

export function StreamingResponsePreview() {
  const reduce = useReducedMotion();
  const [attempt, setAttempt] = useState(0);
  const [count, setCount] = useState(reduce ? RESPONSE.length : 0);
  const [shared, setShared] = useState(false);
  const failed = attempt === FAILS_ON_ATTEMPT;
  const target = failed ? Math.ceil(RESPONSE.length / 2) : RESPONSE.length;
  const streaming = count < target;
  const status = streaming ? "streaming" : failed ? "error" : "complete";

  // attempt is never read in the body; bumping it on Replay is what restarts this effect.
  // biome-ignore lint/correctness/useExhaustiveDependencies: attempt is intentional, see comment above.
  useEffect(() => {
    if (reduce) return;
    setCount(0);
    const startedAt = performance.now();
    let frame: number;
    const tick = (now: number) => {
      const next = Math.min(target, Math.floor(((now - startedAt) / 1000) * SPEED));
      setCount(next);
      if (next < target) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [attempt, target, reduce]);

  return (
    <div className="flex w-full max-w-sm flex-col gap-2">
      <StreamingResponse
        status={status}
        copyText={RESPONSE}
        onRetry={() => setAttempt((a) => a + 1)}
        onShare={() => {
          setShared(true);
          window.setTimeout(() => setShared(false), 1500);
        }}
        showFeedback
        followUps={status === "complete" ? FOLLOW_UPS : undefined}
      >
        <StreamingText text={RESPONSE.slice(0, count)} streaming={streaming} />
        {status === "error" ? (
          <p className="mt-2 text-xs text-destructive">The connection dropped partway through.</p>
        ) : null}
      </StreamingResponse>
      {shared ? <p className="text-xs text-muted-foreground">Link copied.</p> : null}
    </div>
  );
}

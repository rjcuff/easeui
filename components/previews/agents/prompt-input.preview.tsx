"use client";

import { useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";
import { MessageBubble } from "@/components/motion/message-bubble";
import { PromptInput } from "@/components/motion/prompt-input";
import { StreamingResponse } from "@/components/motion/streaming-response";
import { StreamingText } from "@/components/motion/streaming-text";

const REPLY = "Got it, I'll take a look and follow up here shortly.";
/** Characters per second for the simulated reply. */
const SPEED = 60;

type Phase = "idle" | "streaming" | "done";

export function PromptInputPreview() {
  const reduce = useReducedMotion();
  const [prompt, setPrompt] = useState<string | null>(null);
  const [phase, setPhase] = useState<Phase>("idle");
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (phase !== "streaming") return;
    if (reduce) {
      setCount(REPLY.length);
      setPhase("done");
      return;
    }
    setCount(0);
    const startedAt = performance.now();
    let frame: number;
    const tick = (now: number) => {
      const next = Math.min(REPLY.length, Math.floor(((now - startedAt) / 1000) * SPEED));
      setCount(next);
      if (next < REPLY.length) frame = requestAnimationFrame(tick);
      else setPhase("done");
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [phase, reduce]);

  return (
    <div className="flex w-full max-w-sm flex-col gap-3">
      {prompt ? (
        <MessageBubble align="end" tone="accent">
          {prompt}
        </MessageBubble>
      ) : null}
      {phase !== "idle" ? (
        <StreamingResponse
          status={phase === "streaming" ? "streaming" : "complete"}
          copyText={REPLY}
          onRetry={() => setPhase("streaming")}
          showFeedback
        >
          <StreamingText text={REPLY.slice(0, count)} streaming={phase === "streaming"} />
        </StreamingResponse>
      ) : null}
      <PromptInput
        placeholder="Ask anything..."
        loading={phase === "streaming"}
        onStop={() => setPhase("done")}
        onSubmit={(value) => {
          setPrompt(value);
          setPhase("streaming");
        }}
      />
    </div>
  );
}

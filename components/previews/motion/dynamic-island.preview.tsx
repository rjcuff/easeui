"use client";

import { Music2, Phone, PhoneOff, Timer } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";
import { Button } from "@/components/motion/button";
import { DynamicIsland, DynamicIslandView } from "@/components/motion/dynamic-island";
import { NumberTicker } from "@/components/motion/number-ticker";

type View = "call" | "timer" | "music" | null;

const BAR_DELAYS = [0, 0.18, 0.09, 0.27];

function EqBars() {
  const reduce = useReducedMotion();
  return (
    <span aria-hidden="true" className="flex h-4 items-end gap-0.5">
      {BAR_DELAYS.map((delay) => (
        <motion.span
          key={delay}
          animate={reduce ? undefined : { scaleY: [0.4, 1, 0.55, 0.9, 0.4] }}
          transition={{ duration: 1.1, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut", delay }}
          style={{ scaleY: 0.6 }}
          className="h-full w-0.5 origin-bottom rounded-full bg-background"
        />
      ))}
    </span>
  );
}

function formatClock(totalSeconds: number) {
  const m = Math.floor(totalSeconds / 60);
  const s = Math.round(totalSeconds) % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

export function DynamicIslandPreview() {
  const [view, setView] = useState<View>(null);
  const [seconds, setSeconds] = useState(154);

  useEffect(() => {
    if (view !== "timer") return;
    const id = window.setInterval(() => setSeconds((current) => (current > 0 ? current - 1 : 0)), 1000);
    return () => window.clearInterval(id);
  }, [view]);

  return (
    <div className="flex w-full flex-col items-center gap-5">
      <DynamicIsland
        view={view}
        compact={
          <>
            <span className="h-1.5 w-1.5 rounded-full bg-success" />
            <span>9:41</span>
          </>
        }
      >
        <DynamicIslandView id="call">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-wider text-background/60">Incoming call</span>
            <span className="text-sm font-semibold">Priya</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label="Decline"
              onClick={() => setView(null)}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-destructive text-white outline-none transition-colors duration-150 hover:bg-destructive/90"
            >
              <PhoneOff className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              aria-label="Accept"
              onClick={() => setView(null)}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-success text-white outline-none transition-colors duration-150 hover:bg-success/90"
            >
              <Phone className="h-3.5 w-3.5" />
            </button>
          </div>
        </DynamicIslandView>

        <DynamicIslandView id="timer">
          <Timer className="h-4 w-4 text-warning" aria-hidden="true" />
          <span className="text-[10px] uppercase tracking-wider text-background/60">Focus timer</span>
          <span className="text-sm font-semibold">
            <NumberTicker value={seconds} format={formatClock} />
          </span>
        </DynamicIslandView>

        <DynamicIslandView id="music">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-background/15">
            <Music2 className="h-3.5 w-3.5" aria-hidden="true" />
          </span>
          <div className="flex flex-col text-left">
            <span className="text-xs font-semibold leading-tight">Little Dark Age</span>
            <span className="text-[10px] text-background/60">MGMT</span>
          </div>
          <EqBars />
        </DynamicIslandView>
      </DynamicIsland>

      <div className="flex flex-wrap items-center justify-center gap-2">
        <Button size="sm" variant="secondary" onClick={() => setView("call")}>
          Call
        </Button>
        <Button
          size="sm"
          variant="secondary"
          onClick={() => {
            setSeconds(154);
            setView("timer");
          }}
        >
          Timer
        </Button>
        <Button size="sm" variant="secondary" onClick={() => setView("music")}>
          Music
        </Button>
        <Button size="sm" variant="ghost" onClick={() => setView(null)}>
          Dismiss
        </Button>
      </div>
    </div>
  );
}

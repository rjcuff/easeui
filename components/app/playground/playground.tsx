"use client";

import { RotateCw } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/motion/tabs";
import { CodePanel } from "./code-panel";
import { Controls } from "./controls";
import type { ControlValue, Values } from "./core";
import { PLAYGROUND_ITEMS } from "./items";

/** Wait this long after the last change before replaying the preview. */
const REPLAY_DELAY_MS = 250;

export function Playground() {
  const [activeSlug, setActiveSlug] = useState(PLAYGROUND_ITEMS[0].slug);
  const [replayKey, setReplayKey] = useState(0);
  const replayTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  // per-type values so switching types preserves each one's tweaks
  const [valuesByType, setValuesByType] = useState<Record<string, Values>>(() =>
    Object.fromEntries(
      PLAYGROUND_ITEMS.map((it) => [it.slug, { ...it.defaults }]),
    ),
  );

  useEffect(
    () => () => {
      if (replayTimer.current) clearTimeout(replayTimer.current);
    },
    [],
  );

  const active = useMemo(
    () =>
      PLAYGROUND_ITEMS.find((it) => it.slug === activeSlug) ??
      PLAYGROUND_ITEMS[0],
    [activeSlug],
  );
  const values = valuesByType[active.slug];

  const replay = () => setReplayKey((k) => k + 1);

  const select = (slug: string) => {
    setActiveSlug(slug);
    replay();
  };

  const setValue = (key: string, value: ControlValue) => {
    // strip float artifacts from step snapping (0.30000000000000004 -> 0.3)
    const clean =
      typeof value === "number" ? Math.round(value * 1e6) / 1e6 : value;
    setValuesByType((prev) => {
      const merged = { ...prev[active.slug], [key]: clean };
      const nextValues = active.coerce ? active.coerce(key, merged) : merged;
      return { ...prev, [active.slug]: nextValues };
    });
    // Replay once the value settles. Restarting on every slider tick made the
    // preview stutter while dragging.
    if (replayTimer.current) clearTimeout(replayTimer.current);
    replayTimer.current = setTimeout(replay, REPLAY_DELAY_MS);
  };

  const Preview = active.Preview;

  return (
    <div className="flex w-full flex-col gap-10 pb-24 pt-10 md:pt-14">
      <header className="flex flex-col items-center gap-3 text-center">
        <h1 className="text-balance font-display text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
          Playground
        </h1>
        <p className="max-w-xl text-pretty text-sm leading-6 text-muted-foreground">
          Tune the motion behind everyday interface moments and copy the code.
        </p>
      </header>

      <div className="flex flex-col gap-6">
        <Tabs value={active.slug} onValueChange={select} variant="underline">
          {/* Scrolls sideways on narrow screens instead of wrapping. */}
          <div className="-mx-4 overflow-x-auto px-4 scrollbar-hide sm:mx-0 sm:px-0">
            <TabsList className="flex w-full min-w-max sm:justify-center">
              {PLAYGROUND_ITEMS.map((it) => (
                <TabsTrigger
                  key={it.slug}
                  value={it.slug}
                  className="touch-manipulation"
                >
                  {it.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
        </Tabs>

        <p className="mx-auto max-w-2xl text-pretty text-center text-sm leading-6 text-muted-foreground">
          {active.blurb}
        </p>
      </div>

      {/* One full-width card per section, stacked. min-w-0 lets code scroll instead of widening the page. */}
      <div className="flex w-full min-w-0 flex-col gap-6">
        {/* Tall enough for scaled previews. Clips only sideways so vertical
            overshoot is never cut off. */}
        <section className="relative flex min-h-[26rem] w-full items-center justify-center overflow-x-clip rounded-2xl bg-card px-6 py-16 [&>div:first-child]:w-full">
          <div>
            <Preview values={values} replayKey={replayKey} />
          </div>
          <button
            type="button"
            onClick={replay}
            aria-label="Replay animation"
            className="absolute right-3 top-3 inline-flex h-9 w-9 touch-manipulation items-center justify-center rounded-full text-muted-foreground transition-[color,transform] duration-150 ease-out hover:text-foreground active:scale-[0.97]"
          >
            <RotateCw className="h-4 w-4" />
          </button>
        </section>

        <section className="flex w-full flex-col rounded-2xl border border-border bg-card p-5">
          <Controls
            controls={active.controls}
            values={values}
            onChange={setValue}
          />
        </section>

        <section className="flex w-full min-w-0 flex-col">
          <CodePanel code={active.toCode(values)} />
        </section>
      </div>
    </div>
  );
}

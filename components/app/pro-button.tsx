"use client";

import { ArrowUpRight } from "lucide-react";
import type { CSSProperties } from "react";
import { PressLink } from "@/components/app/press-link";
import { PRO_URL } from "@/lib/site";
import { cn } from "@/lib/utils";

/** The same full color wheel the hero's gradient text drifts through. */
const SPECTRUM =
  "conic-gradient(from 0deg, hsl(0 90% 60%), hsl(60 90% 55%), hsl(120 85% 50%), hsl(180 85% 50%), hsl(240 90% 65%), hsl(300 85% 60%), hsl(360 90% 60%))";

/** Seconds for one turn of the ring. Slow enough to read as a drift, not a spinner. */
const TURN = 6;

/**
 * The oversized wheel that turns behind a clipped layer. The turn lives on the
 * inner element because a rotate animation would otherwise overwrite the
 * centering translate.
 */
function Wheel() {
  return (
    <span className="absolute left-1/2 top-1/2 aspect-square w-[200%] -translate-x-1/2 -translate-y-1/2">
      <span
        className="block h-full w-full animate-spin [animation-duration:var(--turn)] motion-reduce:animate-none"
        style={{ backgroundImage: SPECTRUM, "--turn": `${TURN}s` } as CSSProperties}
      />
    </span>
  );
}

/**
 * The turning border, plus the same wheel blurred underneath for a glow that
 * warms on hover. Both layers are clipped to the pill they sit in; the caller
 * paints the interior over all but a hairline of the border.
 */
function Ring({ glow }: { glow: string }) {
  return (
    <>
      {/* The glow reaches past the pill, so it gets its own clipping layer. */}
      <span
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute overflow-hidden rounded-full transition-opacity duration-300 ease-out motion-reduce:transition-none",
          glow,
        )}
      >
        <Wheel />
      </span>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden rounded-full"
      >
        <Wheel />
      </span>
    </>
  );
}

const LABEL = "Explore Pro";

/**
 * The hero's Pro call to action: a pill wearing the turning border, sized to
 * the filled button beside it. The interior stays on the page background, so it
 * reads as an outlined button rather than a second filled one.
 */
export function ProButton({ className }: { className?: string }) {
  return (
    <PressLink
      href={PRO_URL}
      target="_blank"
      rel="noreferrer noopener"
      className={cn(
        "group relative inline-flex min-h-11 touch-manipulation items-stretch justify-center rounded-full p-[1.5px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        className,
      )}
    >
      <Ring glow="-inset-1 opacity-40 blur-md group-hover:opacity-80" />
      <span className="relative inline-flex w-full items-center justify-center gap-2 rounded-full bg-background px-5 text-sm font-medium text-foreground">
        {LABEL}
        <ArrowUpRight
          aria-hidden="true"
          className="h-4 w-4 text-muted-foreground transition-transform duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 motion-reduce:transition-none"
        />
      </span>
    </PressLink>
  );
}

/**
 * The header's Pro link, shaped like the icon badges beside it and wearing the
 * same turning border. The interior tracks those badges: page background until
 * hover, muted after.
 */
export function ProBadge({ className }: { className?: string }) {
  return (
    <PressLink
      href={PRO_URL}
      target="_blank"
      rel="noreferrer noopener"
      className={cn(
        "group relative inline-flex h-9 items-stretch justify-center rounded-full p-[1.5px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        className,
      )}
    >
      <Ring glow="-inset-0.5 opacity-30 blur-[6px] group-hover:opacity-70" />
      <span className="relative inline-flex items-center justify-center whitespace-nowrap rounded-full bg-background px-3 text-xs font-medium text-muted-foreground transition-colors duration-150 group-hover:bg-muted group-hover:text-foreground">
        {LABEL}
      </span>
    </PressLink>
  );
}

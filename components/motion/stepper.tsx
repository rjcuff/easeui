"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface StepperStep {
  label: string;
  /** A short line under the label. */
  description?: string;
}

export interface StepperProps {
  steps: StepperStep[];
  /** The step in progress, counting from 0. Steps before it show as done. */
  current: number;
  /** Lets people jump back to a finished step. Leave unset to make the steps display only. */
  onStepClick?: (index: number) => void;
  className?: string;
}

/**
 * Numbered steps joined by a line that fills as you move forward. Finished steps trade their
 * number for a check, and the line between two steps fills from the left.
 */
export function Stepper({ steps, current, onStepClick, className }: StepperProps) {
  return (
    <ol className={cn("flex w-full items-start", className)}>
      {steps.map((step, index) => {
        const done = index < current;
        const active = index === current;
        const clickable = Boolean(onStepClick) && done;
        const Tag = clickable ? "button" : "div";

        return (
          <li key={step.label} className={cn("relative flex min-w-0 flex-col items-center", index < steps.length - 1 ? "flex-1" : "")}>
            {index < steps.length - 1 ? (
              // The line to the next step. It sits behind the circles and fills from the left.
              <span aria-hidden="true" className="absolute left-[calc(50%+18px)] right-[calc(-50%+18px)] top-4 h-0.5 overflow-hidden rounded-full bg-foreground/10">
                <span
                  className="block h-full origin-left rounded-full bg-accent transition-transform duration-300 ease-out motion-reduce:transition-none"
                  style={{ transform: `scaleX(${done ? 1 : 0})` }}
                />
              </span>
            ) : null}

            <Tag
              {...(clickable ? { type: "button" as const, onClick: () => onStepClick?.(index) } : {})}
              aria-current={active ? "step" : undefined}
              className={cn(
                "relative flex flex-col items-center gap-2 rounded-lg px-1 text-center outline-none",
                clickable && "cursor-pointer focus-visible:ring-2 focus-visible:ring-foreground/40",
              )}
            >
              {/* Number and check share one spot and crossfade, so the circle never changes size. */}
              <span
                className={cn(
                  "relative grid h-8 w-8 place-items-center rounded-full text-sm font-medium tabular-nums transition-[background-color,color,box-shadow] duration-200 ease-out",
                  done && "bg-accent text-accent-foreground",
                  active && "bg-background text-foreground shadow-[0_0_0_2px_var(--accent)]",
                  !done && !active && "bg-background text-muted-foreground shadow-[0_0_0_1px_var(--border-strong)]",
                )}
              >
                <span className={cn("col-start-1 row-start-1 transition-[opacity,scale] duration-200 ease-out", done ? "scale-50 opacity-0" : "scale-100 opacity-100")}>
                  {index + 1}
                </span>
                <Check
                  aria-hidden="true"
                  strokeWidth={3}
                  className={cn("col-start-1 row-start-1 h-4 w-4 transition-[opacity,scale] duration-200 ease-out", done ? "scale-100 opacity-100" : "scale-50 opacity-0")}
                />
              </span>
              <span className="flex max-w-32 flex-col gap-0.5">
                <span className={cn("truncate text-sm font-medium transition-colors duration-200", active || done ? "text-foreground" : "text-muted-foreground")}>
                  {step.label}
                </span>
                {step.description ? <span className="hidden truncate text-xs text-muted-foreground sm:block">{step.description}</span> : null}
              </span>
              <span className="sr-only">{done ? ", done" : active ? ", current step" : ""}</span>
            </Tag>
          </li>
        );
      })}
    </ol>
  );
}

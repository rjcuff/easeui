"use client";

import { Check, Loader2, X } from "lucide-react";
import { type ReactNode, useId } from "react";
import { cn } from "@/lib/utils";

export type ToolChipStatus = "running" | "done" | "error";

export interface ToolChipProps {
  /** Icon for the tool, such as a globe for web search. */
  icon?: ReactNode;
  label: string;
  /** Default "done". */
  status?: ToolChipStatus;
  className?: string;
}

const STATUS_CLASS: Record<ToolChipStatus, string> = {
  running: "text-muted-foreground",
  done: "text-success",
  error: "text-destructive",
};

/** A small pill naming a tool an agent used, with a status mark that crossfades in place. */
export function ToolChip({ icon, label, status = "done", className }: ToolChipProps) {
  const id = useId();
  return (
    <span
      role="status"
      aria-label={`${label}, ${status}`}
      className={cn(
        "inline-flex h-7 items-center gap-1.5 rounded-full bg-muted px-2.5 text-xs font-medium text-foreground",
        className,
      )}
    >
      {icon ? (
        <span aria-hidden="true" className="flex h-3.5 w-3.5 shrink-0 items-center justify-center text-muted-foreground">
          {icon}
        </span>
      ) : null}
      {label}
      <span aria-hidden="true" className="grid h-3.5 w-3.5 shrink-0 place-items-center">
        <Loader2
          key={`${id}-running`}
          className={cn(
            "col-start-1 row-start-1 h-3 w-3 animate-spin transition-opacity duration-150 motion-reduce:transition-none",
            STATUS_CLASS.running,
            status === "running" ? "opacity-100" : "opacity-0",
          )}
        />
        <Check
          key={`${id}-done`}
          strokeWidth={3}
          className={cn(
            "col-start-1 row-start-1 h-3 w-3 transition-opacity duration-150 motion-reduce:transition-none",
            STATUS_CLASS.done,
            status === "done" ? "opacity-100" : "opacity-0",
          )}
        />
        <X
          key={`${id}-error`}
          strokeWidth={3}
          className={cn(
            "col-start-1 row-start-1 h-3 w-3 transition-opacity duration-150 motion-reduce:transition-none",
            STATUS_CLASS.error,
            status === "error" ? "opacity-100" : "opacity-0",
          )}
        />
      </span>
    </span>
  );
}

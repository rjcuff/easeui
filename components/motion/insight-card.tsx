import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface InsightCardTrend {
  /** A percentage or plain number; the sign is implied by direction, not this value. */
  value: number;
  direction: "up" | "down";
}

export interface InsightCardProps {
  label: string;
  /** The headline number. Pass a NumberTicker for it to roll in on change. */
  value: ReactNode;
  trend?: InsightCardTrend;
  icon?: ReactNode;
  className?: string;
}

/** A stat tile: a label, a headline value, and an optional trend pill. */
export function InsightCard({ label, value, trend, icon, className }: InsightCardProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 rounded-2xl bg-card p-4 shadow-[0_0_0_1px_var(--border)]",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-medium text-muted-foreground">{label}</span>
        {icon ? (
          <span aria-hidden="true" className="flex h-6 w-6 shrink-0 items-center justify-center text-muted-foreground">
            {icon}
          </span>
        ) : null}
      </div>
      <div className="flex items-end justify-between gap-2">
        <span className="font-display text-2xl font-semibold tabular-nums text-foreground">{value}</span>
        {trend ? (
          <span
            className={cn(
              "mb-0.5 inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-xs font-medium",
              trend.direction === "up" ? "bg-success/15 text-success" : "bg-destructive/15 text-destructive",
            )}
          >
            {trend.direction === "up" ? (
              <ArrowUpRight aria-hidden="true" className="h-3 w-3" />
            ) : (
              <ArrowDownRight aria-hidden="true" className="h-3 w-3" />
            )}
            {trend.value}%
          </span>
        ) : null}
      </div>
    </div>
  );
}

import { cn } from "@/lib/utils";

export interface ProgressProps {
  /** 0 to 100. Omitted, the bar runs indeterminate. */
  value?: number;
  className?: string;
}

/** A progress bar that fills with scale, not width, so it stays cheap to animate. */
export function Progress({ value, className }: ProgressProps) {
  const clamped = value === undefined ? undefined : Math.min(100, Math.max(0, value));

  return (
    <div
      role="progressbar"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
      className={cn("h-1.5 w-full overflow-hidden rounded-full bg-muted", className)}
    >
      <div
        className={cn(
          "h-full w-full origin-left rounded-full bg-foreground",
          clamped === undefined
            ? "scale-x-[0.4] animate-progress-indeterminate motion-reduce:animate-none"
            : "transition-transform duration-300 ease-out motion-reduce:transition-none",
        )}
        style={clamped === undefined ? undefined : { transform: `scaleX(${clamped / 100})` }}
      />
    </div>
  );
}

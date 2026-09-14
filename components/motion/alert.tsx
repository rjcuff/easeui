import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export type AlertVariant = "neutral" | "success" | "warning" | "destructive";

export interface AlertProps extends HTMLAttributes<HTMLDivElement> {
  /** Color of the accent stripe and icon. Default "neutral". */
  variant?: AlertVariant;
}

const ACCENT_CLASS: Record<AlertVariant, string> = {
  neutral: "border-l-border-strong [&_svg]:text-muted-foreground",
  success: "border-l-success [&_svg]:text-success",
  warning: "border-l-warning [&_svg]:text-warning",
  destructive: "border-l-destructive [&_svg]:text-destructive",
};

/** A banner with a colored accent stripe. Body text stays neutral so contrast never depends on the variant. */
export function Alert({ variant = "neutral", className, ...props }: AlertProps) {
  return (
    <div
      role="alert"
      className={cn(
        "flex items-start gap-3 rounded-xl border-l-4 bg-card p-4 text-sm shadow-[0_0_0_1px_var(--border)]",
        ACCENT_CLASS[variant],
        className,
      )}
      {...props}
    />
  );
}

export function AlertTitle({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h5 className={cn("font-medium leading-tight text-foreground", className)} {...props} />
  );
}

export function AlertDescription({ className, ...props }: HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn("mt-1 text-pretty text-muted-foreground", className)} {...props} />
  );
}

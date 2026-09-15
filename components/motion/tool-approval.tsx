"use client";

import { Check, Terminal, X } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";
import { EASE_OUT } from "@/lib/ease";
import { cn } from "@/lib/utils";

export type ToolApprovalStatus = "pending" | "approved" | "denied";

export interface ToolApprovalProps {
  /** What the agent wants to do. */
  title: ReactNode;
  /** The exact command, file path, or other detail worth reading before approving. */
  description?: ReactNode;
  /** Default "pending". Acting on the request is up to the caller: set this once onApprove or onDeny fires. */
  status?: ToolApprovalStatus;
  onApprove?: () => void;
  onDeny?: () => void;
  approveLabel?: string;
  denyLabel?: string;
  className?: string;
}

const RESOLVED_ICON: Record<"approved" | "denied", ReactNode> = {
  approved: <Check aria-hidden="true" className="h-3 w-3" strokeWidth={3} />,
  denied: <X aria-hidden="true" className="h-3 w-3" strokeWidth={3} />,
};

const RESOLVED_LABEL: Record<"approved" | "denied", string> = {
  approved: "Approved",
  denied: "Denied",
};

const RESOLVED_CLASS: Record<"approved" | "denied", string> = {
  approved: "bg-success/15 text-success",
  denied: "bg-destructive/15 text-destructive",
};

/**
 * A card for an agent action waiting on approval, with Approve and Deny.
 * Resolving it collapses the buttons into a single status pill.
 */
export function ToolApproval({
  title,
  description,
  status = "pending",
  onApprove,
  onDeny,
  approveLabel = "Approve",
  denyLabel = "Deny",
  className,
}: ToolApprovalProps) {
  const reduce = useReducedMotion();
  const pending = status === "pending";

  return (
    <motion.div
      layout={!reduce}
      transition={{ duration: 0.2, ease: EASE_OUT }}
      className={cn("flex flex-col gap-3 rounded-2xl bg-card p-4 shadow-[0_0_0_1px_var(--border)]", className)}
    >
      <div className="flex items-start gap-3">
        <span className="mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
          <Terminal aria-hidden="true" className="h-3.5 w-3.5" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-foreground">{title}</p>
          {description ? (
            <p className="mt-1 truncate font-mono text-xs text-muted-foreground">{description}</p>
          ) : null}
        </div>
      </div>

      <AnimatePresence mode="popLayout" initial={false}>
        {pending ? (
          <motion.div
            key="actions"
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduce ? undefined : { opacity: 0 }}
            transition={{ duration: 0.15, ease: EASE_OUT }}
            className="flex justify-end gap-2"
          >
            <button
              type="button"
              onClick={onDeny}
              className="inline-flex h-8 touch-manipulation items-center rounded-full px-3.5 text-sm font-medium text-muted-foreground outline-none transition-colors duration-150 hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-foreground/40"
            >
              {denyLabel}
            </button>
            <button
              type="button"
              onClick={onApprove}
              className="inline-flex h-8 touch-manipulation items-center rounded-full bg-foreground px-3.5 text-sm font-medium text-background outline-none transition-colors duration-150 hover:bg-foreground/90 focus-visible:ring-2 focus-visible:ring-foreground/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              {approveLabel}
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="resolved"
            initial={reduce ? false : { opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, ease: EASE_OUT }}
            className={cn(
              "inline-flex w-fit items-center gap-1.5 self-end rounded-full px-2.5 py-1 text-xs font-medium",
              RESOLVED_CLASS[status],
            )}
          >
            {RESOLVED_ICON[status]}
            {RESOLVED_LABEL[status]}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

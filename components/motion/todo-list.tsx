"use client";

import { Check, ChevronDown, Loader2 } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useId, useState } from "react";
import { cn } from "@/lib/utils";

export type TodoStatus = "pending" | "active" | "done";

export interface TodoItem {
  id: string;
  label: string;
  status: TodoStatus;
  /** Short detail under the label, such as a file name. */
  meta?: string;
}

export interface TodoListProps {
  /** Heading shown next to the completion count. Default "Tasks". */
  title?: string;
  items: TodoItem[];
  /** Starting expanded state. Default true. */
  defaultOpen?: boolean;
  className?: string;
}

const EASE = [0.23, 1, 0.32, 1] as const;

function StatusMark({ status }: { status: TodoStatus }) {
  const reduce = useReducedMotion();
  const transition = { duration: reduce ? 0 : 0.15, ease: EASE };

  return (
    <span className="relative flex h-4 w-4 shrink-0 items-center justify-center">
      <AnimatePresence mode="wait" initial={false}>
        {status === "done" ? (
          <motion.span
            key="done"
            initial={reduce ? false : { opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.6 }}
            transition={transition}
            className="flex h-4 w-4 items-center justify-center rounded-full bg-accent text-accent-foreground"
          >
            <Check aria-hidden="true" strokeWidth={3} className="h-2.5 w-2.5" />
          </motion.span>
        ) : status === "active" ? (
          <motion.span
            key="active"
            initial={reduce ? false : { opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.6 }}
            transition={transition}
          >
            <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin text-muted-foreground" />
          </motion.span>
        ) : (
          <motion.span
            key="pending"
            initial={reduce ? false : { opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.6 }}
            transition={transition}
            className="h-3 w-3 rounded-full shadow-[0_0_0_1.5px_var(--border-strong)]"
          />
        )}
      </AnimatePresence>
    </span>
  );
}

/**
 * A collapsible task plan. The header shows how many items are done, and
 * each status mark morphs as a task moves from pending to active to done.
 */
export function TodoList({ title = "Tasks", items, defaultOpen = true, className }: TodoListProps) {
  const [open, setOpen] = useState(defaultOpen);
  const panelId = useId();
  const done = items.filter((item) => item.status === "done").length;

  return (
    <div className={cn("rounded-2xl bg-card shadow-[0_0_0_1px_var(--border)]", className)}>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((value) => !value)}
        className="flex min-h-11 w-full items-center justify-between gap-3 px-4 py-2.5 text-left text-sm font-medium text-foreground outline-none focus-visible:ring-2 focus-visible:ring-foreground/40"
      >
        <span className="flex items-center gap-2">
          {title}
          <span className="text-xs font-normal tabular-nums text-muted-foreground">
            {done}/{items.length}
          </span>
        </span>
        <ChevronDown
          aria-hidden="true"
          className={cn(
            "h-4 w-4 text-muted-foreground transition-transform duration-200 ease-out motion-reduce:transition-none",
            open && "rotate-180",
          )}
        />
      </button>
      <div
        id={panelId}
        inert={!open}
        className={cn(
          "grid transition-[grid-template-rows] duration-200 ease-out motion-reduce:transition-none",
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
        )}
      >
        <div className="overflow-hidden">
          <ul className="flex flex-col gap-2.5 px-4 pb-4">
            {items.map((item) => (
              <li key={item.id} className="flex items-start gap-2.5">
                <span className="mt-0.5">
                  <StatusMark status={item.status} />
                </span>
                <span className="min-w-0 flex-1">
                  <p
                    className={cn(
                      "text-sm leading-5",
                      item.status === "done"
                        ? "text-muted-foreground line-through"
                        : "text-foreground",
                    )}
                  >
                    {item.label}
                  </p>
                  {item.meta ? (
                    <p className="mt-0.5 text-xs text-muted-foreground">{item.meta}</p>
                  ) : null}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

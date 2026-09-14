"use client";

import { Checkbox } from "@/components/motion/checkbox";

const TASKS = [
  { id: "wireframes", title: "Review wireframes", done: true },
  { id: "handoff", title: "Send design handoff", done: true },
  { id: "qa", title: "QA the checkout flow", done: false },
];

export function CheckboxPreview() {
  return (
    <div className="flex w-full max-w-xs flex-col rounded-2xl bg-background p-1.5 shadow-[0_0_0_1px_var(--border)]">
      {TASKS.map((task) => (
        <label
          key={task.id}
          htmlFor={`task-${task.id}`}
          className="flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 transition-colors duration-150 hover:bg-muted"
        >
          <Checkbox id={`task-${task.id}`} defaultChecked={task.done} />
          <span className="text-sm font-medium text-foreground">{task.title}</span>
        </label>
      ))}
    </div>
  );
}

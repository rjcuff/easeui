"use client";

import { useState } from "react";
import { PullToRefresh } from "@/components/motion/pull-to-refresh";

const INITIAL = ["Standup moved to 10am", "New comment on your PR", "Weekly report is ready"];

export function PullToRefreshPreview() {
  const [items, setItems] = useState(INITIAL);
  const [count, setCount] = useState(0);

  const handleRefresh = async () => {
    await new Promise((resolve) => setTimeout(resolve, 900));
    setCount((current) => current + 1);
    setItems((current) => [`New notification #${count + 1}`, ...current]);
  };

  return (
    <div className="w-full max-w-sm">
      <PullToRefresh onRefresh={handleRefresh} className="h-72 bg-card shadow-[0_0_0_1px_var(--border)]">
        <ul className="flex flex-col divide-y divide-border p-2">
          {items.map((item) => (
            <li key={item} className="px-3 py-3 text-sm text-foreground">
              {item}
            </li>
          ))}
        </ul>
      </PullToRefresh>
    </div>
  );
}

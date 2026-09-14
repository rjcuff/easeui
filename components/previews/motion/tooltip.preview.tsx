"use client";

import { Heart, Settings, Share, Trash2 } from "lucide-react";
import type { ReactNode } from "react";
import { Tooltip } from "@/components/motion/tooltip";

const ACTIONS: { label: string; side: "top" | "bottom" | "left" | "right"; icon: ReactNode }[] = [
  { label: "Like this post", side: "top", icon: <Heart className="h-4 w-4" /> },
  { label: "Share", side: "bottom", icon: <Share className="h-4 w-4" /> },
  { label: "Open settings", side: "left", icon: <Settings className="h-4 w-4" /> },
  { label: "Move to trash", side: "right", icon: <Trash2 className="h-4 w-4" /> },
];

export function TooltipPreview() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-4">
      {ACTIONS.map((action) => (
        <Tooltip key={action.label} content={action.label} side={action.side}>
          <button
            type="button"
            aria-label={action.label}
            className="inline-flex h-11 w-11 touch-manipulation items-center justify-center rounded-full border border-border bg-card text-foreground transition-transform duration-150 ease-out active:scale-[0.97]"
          >
            {action.icon}
          </button>
        </Tooltip>
      ))}
    </div>
  );
}

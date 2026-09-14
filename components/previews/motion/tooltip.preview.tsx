"use client";

import { Bold, Italic, Link2, Undo2 } from "lucide-react";
import { Tooltip, TooltipGroup } from "@/components/motion/tooltip";

const TOOLS = [
  { label: "Bold", shortcut: ["mod", "B"], icon: Bold },
  { label: "Italic", shortcut: ["mod", "I"], icon: Italic },
  { label: "Add link", shortcut: ["mod", "K"], icon: Link2 },
  { label: "Undo", shortcut: ["mod", "Z"], icon: Undo2 },
];

export function TooltipPreview() {
  return (
    <TooltipGroup>
      <div
        role="toolbar"
        aria-label="Text formatting"
        className="flex items-center gap-1 rounded-full bg-card p-1 shadow-[0_0_0_1px_var(--border)]"
      >
        {TOOLS.map(({ label, shortcut, icon: Icon }) => (
          <Tooltip key={label} label={label} shortcut={shortcut}>
            <button
              type="button"
              aria-label={label}
              className="inline-flex h-10 w-10 touch-manipulation items-center justify-center rounded-full text-muted-foreground transition-[color,background-color,transform] duration-150 ease-out hover:bg-muted hover:text-foreground active:scale-[0.97]"
            >
              <Icon className="h-4 w-4" />
            </button>
          </Tooltip>
        ))}
      </div>
    </TooltipGroup>
  );
}

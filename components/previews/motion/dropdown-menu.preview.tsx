"use client";

import { Copy, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/motion/dropdown-menu";

export function DropdownMenuPreview() {
  return (
    <div className="flex w-full max-w-xs items-center justify-between gap-4 rounded-2xl bg-background p-4 shadow-[0_0_0_1px_var(--border)]">
      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-foreground">Q3 roadmap.fig</p>
        <p className="text-xs text-muted-foreground">Edited 2 hours ago</p>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger aria-label="More actions">
          <MoreHorizontal aria-hidden="true" className="h-4 w-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>
            <Pencil aria-hidden="true" className="h-4 w-4" />
            Rename
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Copy aria-hidden="true" className="h-4 w-4" />
            Duplicate
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem destructive>
            <Trash2 aria-hidden="true" className="h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

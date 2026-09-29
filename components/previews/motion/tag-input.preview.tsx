"use client";

import { TagInput } from "@/components/motion/tag-input";

export function TagInputPreview() {
  return (
    <div className="flex w-full max-w-md flex-col gap-2">
      <TagInput defaultValue={["react", "motion", "tailwind"]} max={8} label="Topics" placeholder="Add a topic" />
      <p className="text-xs text-muted-foreground">Enter or a comma adds a tag. Backspace twice removes the last one. Try adding react again.</p>
    </div>
  );
}

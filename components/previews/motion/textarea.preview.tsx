"use client";

import { useId } from "react";
import { Textarea } from "@/components/motion/textarea";

export function TextareaPreview() {
  const id = useId();

  return (
    <label htmlFor={id} className="flex w-full max-w-xs flex-col gap-2 text-sm">
      <span className="font-medium text-foreground">Message</span>
      <Textarea id={id} placeholder="Type a message. It grows as you type." />
    </label>
  );
}

"use client";

import { useEffect } from "react";
import { useThemeToggle } from "@/components/motion/theme-toggle";

/** Shortcuts should never fire while someone is typing. */
function isTypingTarget(target: EventTarget | null) {
  return (
    target instanceof HTMLElement &&
    (target.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName))
  );
}

/** Site-wide shortcuts. Shift+D switches between light and dark mode. */
export function KeyboardShortcuts() {
  const { toggle } = useThemeToggle({ variant: "circle" });

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (isTypingTarget(event.target) || event.metaKey || event.ctrlKey || event.altKey) return;
      if (event.shiftKey && event.key.toLowerCase() === "d") {
        event.preventDefault();
        toggle();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [toggle]);

  return null;
}

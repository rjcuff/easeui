"use client";

import { Search, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { SPRING_PANEL } from "@/lib/ease";
import { cn } from "@/lib/utils";

export interface MorphingSearchProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
  className?: string;
}

/**
 * A circular search button that morphs into a text field: the same element
 * grows and reshapes via a layout animation, rather than a new one popping
 * in beside it. Closes on Escape, on submit, or on an outside click.
 */
export function MorphingSearch({ placeholder = "Search...", onSearch, className }: MorphingSearchProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const close = () => {
    setOpen(false);
    setQuery("");
  };

  return (
    <div ref={rootRef} className={cn("inline-flex", className)}>
      <motion.div
        layout
        transition={SPRING_PANEL}
        style={{ borderRadius: 9999 }}
        className="flex h-11 items-center overflow-hidden bg-card shadow-[0_0_0_1px_var(--border)]"
      >
        <AnimatePresence mode="popLayout" initial={false}>
          {open ? (
            <motion.form
              key="form"
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { delay: 0.1, duration: 0.15 } }}
              exit={{ opacity: 0, transition: { duration: 0.1 } }}
              onSubmit={(event) => {
                event.preventDefault();
                onSearch?.(query);
              }}
              className="flex items-center gap-1 pl-4 pr-1.5"
            >
              <Search aria-hidden="true" className="h-4 w-4 shrink-0 text-muted-foreground" />
              <input
                ref={inputRef}
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={placeholder}
                className="h-11 w-56 min-w-0 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
              />
              <button
                type="button"
                aria-label="Close search"
                onClick={close}
                className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-muted-foreground outline-none after:absolute after:-inset-1 transition-colors duration-150 hover:bg-muted hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </motion.form>
          ) : (
            <motion.button
              key="trigger"
              layout
              type="button"
              aria-label="Search"
              onClick={() => setOpen(true)}
              // `layout` keeps the icon from stretching as the shell resizes
              // around it; the delay also hides it until the shell has
              // mostly finished shrinking, so it never appears mid-squash.
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { delay: 0.18, duration: 0.1 } }}
              exit={{ opacity: 0, transition: { duration: 0 } }}
              className="flex h-11 w-11 shrink-0 items-center justify-center text-muted-foreground transition-colors duration-150 hover:text-foreground"
            >
              <Search className="h-[18px] w-[18px]" />
            </motion.button>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

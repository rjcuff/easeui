"use client";

import { X } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { type KeyboardEvent, useId, useRef, useState } from "react";
import { EASE_OUT } from "@/lib/ease";
import { cn } from "@/lib/utils";

export interface TagInputProps {
  /** Controlled list of tags. */
  value?: string[];
  /** Starting tags when uncontrolled. */
  defaultValue?: string[];
  onValueChange?: (tags: string[]) => void;
  placeholder?: string;
  /** Stops adding once this many tags exist. */
  max?: number;
  /** Names the field for screen readers. Default "Tags". */
  label?: string;
  className?: string;
}

/**
 * A field that turns what you type into tags. Enter or a comma adds one, Backspace on an empty
 * field marks the last tag then removes it, and a duplicate shakes the tag that already exists.
 */
export function TagInput({ value, defaultValue = [], onValueChange, placeholder = "Add a tag", max, label = "Tags", className }: TagInputProps) {
  const reduce = useReducedMotion();
  const id = useId();
  const input = useRef<HTMLInputElement>(null);
  const [inner, setInner] = useState(defaultValue);
  const tags = value ?? inner;
  const [draft, setDraft] = useState("");
  const [marked, setMarked] = useState(false);
  const [shake, setShake] = useState<{ tag: string; n: number } | null>(null);
  const full = max !== undefined && tags.length >= max;

  const commit = (next: string[]) => {
    setInner(next);
    onValueChange?.(next);
  };

  const add = () => {
    const tag = draft.trim().replace(/,$/, "").trim();
    if (!tag || full) return;
    const existing = tags.find((t) => t.toLowerCase() === tag.toLowerCase());
    if (existing) {
      setShake((s) => ({ tag: existing, n: (s?.n ?? 0) + 1 }));
      return;
    }
    commit([...tags, tag]);
    setDraft("");
  };

  const remove = (tag: string) => {
    commit(tags.filter((t) => t !== tag));
    setMarked(false);
    input.current?.focus();
  };

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" || event.key === ",") {
      event.preventDefault();
      add();
    } else if (event.key === "Backspace" && draft === "" && tags.length) {
      // The first press marks the last tag, the second removes it, so one slip doesn't lose it.
      if (marked) remove(tags[tags.length - 1]);
      else setMarked(true);
    } else if (marked) {
      setMarked(false);
    }
  };

  return (
    // biome-ignore lint/a11y/useKeyWithClickEvents: clicking the padding focuses the input, which has its own keyboard handling.
    // biome-ignore lint/a11y/noStaticElementInteractions: the input inside is the real control.
    <div
      onClick={() => input.current?.focus()}
      className={cn(
        "flex min-h-11 w-full cursor-text flex-wrap items-center gap-1.5 rounded-xl bg-background px-2 py-1.5 shadow-[0_0_0_1px_var(--border-strong)]",
        "transition-shadow duration-150 focus-within:shadow-[0_0_0_2px_var(--accent)]",
        className,
      )}
    >
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <ul className="contents">
        <AnimatePresence initial={false} mode="popLayout">
          {tags.map((tag, index) => {
            const isMarked = marked && index === tags.length - 1;
            const shaking = shake?.tag === tag;
            return (
              <motion.li
                key={tag}
                layout={!reduce}
                initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.9 }}
                animate={
                  shaking && !reduce
                    ? { opacity: 1, scale: 1, x: [0, -4, 4, -3, 3, 0] }
                    : { opacity: 1, scale: 1, x: 0 }
                }
                exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2, ease: EASE_OUT, x: { duration: 0.32 } }}
                onAnimationComplete={() => shaking && setShake(null)}
                className={cn(
                  "flex h-7 items-center gap-1 rounded-lg pl-2.5 pr-1 text-sm transition-colors duration-150",
                  isMarked ? "bg-accent text-accent-foreground" : "bg-muted text-foreground shadow-[inset_0_0_0_1px_var(--border)]",
                )}
              >
                {tag}
                <button
                  type="button"
                  aria-label={`Remove ${tag}`}
                  onClick={(event) => {
                    event.stopPropagation();
                    remove(tag);
                  }}
                  className="relative grid h-5 w-5 place-items-center rounded-md opacity-60 outline-none transition-opacity duration-150 after:absolute after:-inset-1.5 hover:opacity-100 focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-foreground/40"
                >
                  <X aria-hidden="true" className="h-3 w-3" />
                </button>
              </motion.li>
            );
          })}
        </AnimatePresence>
      </ul>
      <input
        ref={input}
        id={id}
        value={draft}
        onChange={(event) => {
          setDraft(event.target.value);
          setMarked(false);
        }}
        onKeyDown={onKeyDown}
        onBlur={() => setMarked(false)}
        disabled={full}
        placeholder={full ? `Up to ${max} tags` : tags.length ? "" : placeholder}
        className="h-7 min-w-24 flex-1 bg-transparent px-1 text-base text-foreground outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed md:text-sm"
      />
    </div>
  );
}

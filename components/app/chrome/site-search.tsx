"use client";

import { CornerDownLeft, Search } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useRouter } from "next/navigation";
import {
  Fragment,
  type KeyboardEvent,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { registry } from "@/lib/registry";
import { cn } from "@/lib/utils";

const EASE = [0.23, 1, 0.32, 1] as const;

type Entry = { id: string; label: string; group: string; href: string; terms: string };

const ENTRIES: Entry[] = [
  ...registry.flatMap((category) =>
    category.components.map((component) => ({
      id: `${category.slug}/${component.slug}`,
      label: component.name,
      group: "Components",
      href: `/components/${category.slug}/${component.slug}`,
      terms: `${component.name} ${component.slug} ${component.description}`.toLowerCase(),
    })),
  ),
  { id: "page/playground", label: "Playground", group: "Pages", href: "/playground", terms: "playground motion easing spring press popover modal stagger" },
  { id: "page/theme", label: "Theme setup", group: "Pages", href: "/docs/theme", terms: "theme setup tokens css install colors" },
  { id: "page/ai-agents", label: "Agent guide", group: "Pages", href: "/docs/ai-agents", terms: "agent guide mcp server skill llms.txt registry ai" },
];

function search(query: string) {
  const words = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
  if (words.length === 0) return ENTRIES;
  return ENTRIES.filter((entry) => words.every((word) => entry.terms.includes(word)));
}

/** Search button in the header. Opens a dialog that filters components and pages as you type. */
export function SiteSearch({ className }: { className?: string }) {
  const router = useRouter();
  const reduce = useReducedMotion();
  const listId = useId();
  const [mounted, setMounted] = useState(false);
  const [isMac, setIsMac] = useState(false);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const results = useMemo(() => search(query), [query]);

  useEffect(() => {
    setMounted(true);
    setIsMac(/Mac|iPhone|iPad/.test(navigator.userAgent));
  }, []);

  // Command K on Mac, Ctrl K elsewhere, toggles search from anywhere on the page.
  useEffect(() => {
    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen((value) => !value);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  // Each time it opens, start with an empty search and focus the field.
  useEffect(() => {
    if (!open) return;
    setQuery("");
    setActive(0);
    const frame = requestAnimationFrame(() => inputRef.current?.focus());
    return () => cancelAnimationFrame(frame);
  }, [open]);

  // Keep the highlighted result visible while moving with the arrow keys.
  useEffect(() => {
    if (!open) return;
    document.getElementById(`${listId}-${active}`)?.scrollIntoView({ block: "nearest" });
  }, [active, open, listId]);

  const close = () => {
    setOpen(false);
    triggerRef.current?.focus();
  };

  const go = (entry: Entry | undefined) => {
    if (!entry) return;
    setOpen(false);
    router.push(entry.href);
  };

  const onInputKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActive((index) => Math.min(index + 1, results.length - 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActive((index) => Math.max(index - 1, 0));
    } else if (event.key === "Enter") {
      event.preventDefault();
      go(results[active]);
    } else if (event.key === "Escape") {
      event.preventDefault();
      close();
    }
  };

  const enter = { duration: reduce ? 0 : 0.15, ease: EASE };
  const exit = { duration: reduce ? 0 : 0.1, ease: EASE };

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        aria-label="Search"
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => setOpen(true)}
        className={cn(
          "flex h-9 w-full items-center gap-2 rounded-full bg-card px-3 text-sm text-muted-foreground shadow-[0_0_0_1px_var(--border)] transition-colors duration-150 hover:text-foreground",
          className,
        )}
      >
        <Search aria-hidden="true" className="h-3.5 w-3.5 shrink-0" />
        <span className="hidden flex-1 text-left sm:block">Search</span>
        <kbd className="hidden rounded-md bg-background px-1.5 py-0.5 font-sans text-[10px] text-muted-foreground shadow-[0_0_0_1px_var(--border)] md:inline-block">
          {isMac ? "⌘K" : "Ctrl K"}
        </kbd>
      </button>

      {mounted
        ? createPortal(
            <AnimatePresence>
              {open ? (
                <div key="search" className="fixed inset-0 z-[60] flex items-start justify-center px-4 pt-[15vh]">
                  <motion.button
                    type="button"
                    aria-label="Close search"
                    onClick={close}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, transition: exit }}
                    transition={enter}
                    className="absolute inset-0 bg-background/70"
                  />
                  <motion.div
                    role="dialog"
                    aria-modal="true"
                    aria-label="Search"
                    initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.97 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, transition: exit }}
                    transition={enter}
                    className="relative w-full max-w-lg overflow-hidden rounded-2xl bg-background shadow-[0_0_0_1px_var(--border-strong),0_24px_60px_-20px_rgb(0_0_0/0.45)]"
                  >
                    <div className="flex items-center gap-3 border-b border-border px-4">
                      <Search aria-hidden="true" className="h-4 w-4 shrink-0 text-muted-foreground" />
                      <input
                        ref={inputRef}
                        type="text"
                        role="combobox"
                        aria-expanded="true"
                        aria-controls={listId}
                        aria-activedescendant={results[active] ? `${listId}-${active}` : undefined}
                        autoComplete="off"
                        spellCheck={false}
                        value={query}
                        onChange={(event) => {
                          setQuery(event.target.value);
                          setActive(0);
                        }}
                        onKeyDown={onInputKeyDown}
                        placeholder="Search components and pages"
                        // 16px on phones so iOS does not zoom into the field.
                        className="h-12 w-full bg-transparent text-base text-foreground outline-none placeholder:text-muted-foreground sm:text-sm"
                      />
                    </div>

                    <div id={listId} role="listbox" aria-label="Results" className="max-h-80 overflow-y-auto p-2">
                      {results.length === 0 ? (
                        <p className="px-3 py-10 text-center text-sm text-muted-foreground">
                          Nothing matches "{query}"
                        </p>
                      ) : (
                        results.map((entry, index) => {
                          const selected = index === active;
                          const startsGroup = index === 0 || results[index - 1].group !== entry.group;
                          return (
                            <Fragment key={entry.id}>
                              {startsGroup ? (
                                <div role="presentation" className="px-3 pb-1 pt-2 text-xs font-medium text-muted-foreground">
                                  {entry.group}
                                </div>
                              ) : null}
                              {/* biome-ignore lint/a11y/useKeyWithClickEvents: keyboard selection is handled by the combobox input. */}
                              <div
                                id={`${listId}-${index}`}
                                role="option"
                                tabIndex={-1}
                                aria-selected={selected}
                                onPointerMove={() => setActive(index)}
                                onClick={() => go(entry)}
                                className={cn(
                                  "flex min-h-10 cursor-pointer items-center justify-between gap-3 rounded-lg px-3 text-sm",
                                  selected ? "bg-muted text-foreground" : "text-muted-foreground",
                                )}
                              >
                                {entry.label}
                                {selected ? (
                                  <CornerDownLeft aria-hidden="true" className="h-3.5 w-3.5 shrink-0" />
                                ) : null}
                              </div>
                            </Fragment>
                          );
                        })
                      )}
                    </div>
                  </motion.div>
                </div>
              ) : null}
            </AnimatePresence>,
            document.body,
          )
        : null}
    </>
  );
}

"use client";

import { Menu, X } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Button } from "@/components/motion/button";
import { registry } from "@/lib/registry";
import { cn } from "@/lib/utils";

const EASE = [0.23, 1, 0.32, 1] as const;

const PAGES = [
  { href: "/components/motion", label: "Components" },
  { href: "/playground", label: "Playground" },
];

const COMPONENTS = registry.flatMap((category) =>
  category.components.map((component) => ({
    href: `/components/${category.slug}/${component.slug}`,
    label: component.name,
  })),
);

function MenuLink({ href, label, active }: { href: string; label: string; active: boolean }) {
  return (
    <li>
      <Link
        href={href}
        aria-current={active ? "page" : undefined}
        className={cn(
          "flex min-h-11 items-center rounded-lg px-3 text-sm transition-colors duration-150",
          active
            ? "bg-muted text-foreground"
            : "text-muted-foreground hover:bg-muted hover:text-foreground",
        )}
      >
        {label}
      </Link>
    </li>
  );
}

/** Menu button for small screens. The panel drops in under the header. */
export function MobileNav() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const reduce = useReducedMotion();

  useEffect(() => setMounted(true), []);

  // biome-ignore lint/correctness/useExhaustiveDependencies: close the menu whenever the route changes.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  const enter = { duration: reduce ? 0 : 0.15, ease: EASE };
  const exit = { duration: reduce ? 0 : 0.1, ease: EASE };

  return (
    <div className="md:hidden">
      <Button
        variant="ghost"
        size="icon"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        aria-controls="mobile-menu"
        onClick={() => setOpen((value) => !value)}
      >
        {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Rendered into the body so the header's backdrop blur cannot trap the fixed panel. */}
      {mounted
        ? createPortal(
            <AnimatePresence>
              {open ? (
                <motion.button
                  key="scrim"
                  type="button"
                  aria-label="Close menu"
                  onClick={() => setOpen(false)}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, transition: exit }}
                  transition={enter}
                  className="fixed inset-0 top-14 z-40 bg-background/60"
                />
              ) : null}
              {open ? (
                <motion.nav
                  key="panel"
                  id="mobile-menu"
                  aria-label="Mobile"
                  initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, transition: exit }}
                  transition={enter}
                  style={{ transformOrigin: "top" }}
                  className="fixed inset-x-3 top-16 z-50 flex max-h-[calc(100dvh-5rem)] flex-col gap-4 overflow-y-auto rounded-2xl bg-background p-2 shadow-[0_0_0_1px_var(--border-strong),0_16px_40px_-16px_rgb(0_0_0/0.35)]"
                >
                  <ul className="flex flex-col">
                    {PAGES.map((page) => (
                      <MenuLink
                        key={page.href}
                        href={page.href}
                        label={page.label}
                        active={pathname === page.href}
                      />
                    ))}
                  </ul>
                  {COMPONENTS.length ? (
                    <div className="flex flex-col gap-1 border-t border-border pt-3">
                      <p className="px-3 text-xs font-medium text-muted-foreground">
                        All components
                      </p>
                      <ul className="flex flex-col">
                        {COMPONENTS.map((component) => (
                          <MenuLink
                            key={component.href}
                            href={component.href}
                            label={component.label}
                            active={pathname === component.href}
                          />
                        ))}
                      </ul>
                    </div>
                  ) : null}
                </motion.nav>
              ) : null}
            </AnimatePresence>,
            document.body,
          )
        : null}
    </div>
  );
}

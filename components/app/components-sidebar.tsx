"use client";

import { LayoutGrid } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/motion/button";
import { Drawer } from "@/components/motion/drawer";
import { registry } from "@/lib/registry";
import { cn } from "@/lib/utils";

const TOP_LINKS = [
  { href: "/docs/introduction", label: "Introduction" },
  { href: "/playground", label: "Playground" },
];

function NavLink({
  href,
  label,
  active,
  onNavigate,
  className,
}: {
  href: string;
  label: string;
  active: boolean;
  onNavigate?: () => void;
  className?: string;
}) {
  return (
    <Link
      href={href}
      onClick={onNavigate}
      aria-current={active ? "page" : undefined}
      className={cn(
        "flex min-h-9 items-center rounded-lg px-3 text-sm transition-colors duration-150",
        active
          ? "bg-muted text-foreground"
          : "text-muted-foreground hover:bg-muted hover:text-foreground",
        className,
      )}
    >
      {label}
    </Link>
  );
}

function NavLinks({ pathname, onNavigate }: { pathname: string; onNavigate?: () => void }) {
  return (
    <nav aria-label="Site" className="flex flex-col gap-0.5">
      {TOP_LINKS.map((link) => (
        <NavLink
          key={link.href}
          href={link.href}
          label={link.label}
          active={pathname === link.href}
          onNavigate={onNavigate}
        />
      ))}
      <div className="my-2 h-px bg-border" />
      {registry.map((category) => (
        <div key={category.slug} className="mt-3 flex flex-col gap-0.5 first:mt-0">
          <Link
            href={`/components/${category.slug}`}
            onClick={onNavigate}
            className="px-3 py-1 text-xs font-medium uppercase tracking-wide text-muted-foreground/70 transition-colors duration-150 hover:text-foreground"
          >
            {category.name}
          </Link>
          {category.components.map((component) => {
            const href = `/components/${category.slug}/${component.slug}`;
            return (
              <NavLink
                key={component.slug}
                href={href}
                label={component.name}
                active={pathname === href}
                onNavigate={onNavigate}
              />
            );
          })}
        </div>
      ))}
    </nav>
  );
}

/**
 * Site navigation shown across components, docs, and the playground. Pinned
 * to the viewport edge on desktop; a button that opens the same list in a
 * Drawer on mobile.
 */
export function ComponentsSidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <>
      <aside className="scrollbar-hide fixed left-4 top-20 hidden max-h-[calc(100dvh-6rem)] w-44 overflow-y-auto md:block lg:left-6">
        <NavLinks pathname={pathname} />
      </aside>

      <div className="md:hidden">
        <Button variant="secondary" size="sm" onClick={() => setOpen(true)}>
          <LayoutGrid aria-hidden="true" className="h-3.5 w-3.5" />
          Browse components
        </Button>
        <Drawer open={open} onOpenChange={setOpen} title="Components">
          <div className="pb-6">
            <NavLinks pathname={pathname} onNavigate={() => setOpen(false)} />
          </div>
        </Drawer>
      </div>
    </>
  );
}

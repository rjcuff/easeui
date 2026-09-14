"use client";

import { LayoutGrid } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/motion/button";
import { Drawer } from "@/components/motion/drawer";
import { cn } from "@/lib/utils";

export interface ComponentLink {
  slug: string;
  name: string;
}

function NavLinks({
  categorySlug,
  components,
  pathname,
  onNavigate,
}: {
  categorySlug: string;
  components: ComponentLink[];
  pathname: string;
  onNavigate?: () => void;
}) {
  const indexHref = `/components/${categorySlug}`;

  return (
    <nav aria-label="Components" className="flex flex-col gap-0.5">
      <Link
        href={indexHref}
        onClick={onNavigate}
        aria-current={pathname === indexHref ? "page" : undefined}
        className={cn(
          "flex min-h-9 items-center rounded-lg px-3 text-sm font-medium transition-colors duration-150",
          pathname === indexHref
            ? "bg-muted text-foreground"
            : "text-muted-foreground hover:bg-muted hover:text-foreground",
        )}
      >
        All components
      </Link>
      <div className="my-2 h-px bg-border" />
      {components.map((component) => {
        const href = `${indexHref}/${component.slug}`;
        const active = pathname === href;
        return (
          <Link
            key={component.slug}
            href={href}
            onClick={onNavigate}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex min-h-9 items-center rounded-lg px-3 text-sm transition-colors duration-150",
              active
                ? "bg-muted text-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            {component.name}
          </Link>
        );
      })}
    </nav>
  );
}

/**
 * Component list for the components section. Pinned to the viewport edge on
 * desktop; a button that opens the same list in a Drawer on mobile.
 */
export function ComponentsSidebar({
  categorySlug,
  components,
}: {
  categorySlug: string;
  components: ComponentLink[];
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <>
      <aside className="scrollbar-hide fixed left-4 top-20 hidden max-h-[calc(100dvh-6rem)] w-44 overflow-y-auto md:block lg:left-6">
        <NavLinks categorySlug={categorySlug} components={components} pathname={pathname} />
      </aside>

      <div className="md:hidden">
        <Button variant="secondary" size="sm" onClick={() => setOpen(true)}>
          <LayoutGrid aria-hidden="true" className="h-3.5 w-3.5" />
          Browse components
        </Button>
        <Drawer open={open} onOpenChange={setOpen} title="Components">
          <div className="pb-6">
            <NavLinks
              categorySlug={categorySlug}
              components={components}
              pathname={pathname}
              onNavigate={() => setOpen(false)}
            />
          </div>
        </Drawer>
      </div>
    </>
  );
}

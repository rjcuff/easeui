"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { PageTransition } from "@/components/app/chrome/page-transition";

const DOCS_PATHS = ["/components", "/docs"];

export function SiteFrame({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isDocs = DOCS_PATHS.some((p) => pathname.startsWith(p));

  return (
    <div className={isDocs ? "py-8" : undefined}>
      <PageTransition>{children}</PageTransition>
    </div>
  );
}

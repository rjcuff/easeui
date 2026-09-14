import type { ReactNode } from "react";
import type { PageNavItem } from "@/components/app/docs/page-nav";

/** Single centered reading column for long-form guides. */
export function GuideShell({
  children,
}: {
  children: ReactNode;
  /** Section anchors for the page. Kept for callers; the column layout has no side rail. */
  navItems?: PageNavItem[];
}) {
  return <article className="mx-auto w-full max-w-3xl">{children}</article>;
}

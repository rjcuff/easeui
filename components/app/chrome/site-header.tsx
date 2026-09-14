"use client";

import { useMotionValueEvent, useScroll } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { GithubIcon } from "@/components/app/icons";
import { EaseMark } from "@/components/app/logo";
import { MobileNav } from "@/components/app/chrome/mobile-nav";
import { PressLink } from "@/components/app/press-link";
import { SiteSearch } from "@/components/app/chrome/site-search";
import { ThemeToggle } from "@/components/motion/theme-toggle";
import { GITHUB_URL } from "@/lib/site";
import { cn } from "@/lib/utils";

function formatStarCount(count: number) {
  if (count >= 1000) {
    const val = Math.round(count / 100) / 10;
    return `${val}k`;
  }
  return String(count);
}

export function SiteHeader({
  githubStarCount,
}: {
  githubStarCount: number | null;
}) {
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const isComponents = pathname.startsWith("/components");
  const isPlayground = pathname.startsWith("/playground");
  const isHome = pathname === "/";
  const formattedStarCount =
    typeof githubStarCount === "number"
      ? formatStarCount(githubStarCount)
      : null;

  useMotionValueEvent(scrollY, "change", (v) => {
    setScrolled(v > 8);
  });

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-40 transition-[background,border-color,backdrop-filter] duration-200",
        scrolled
          ? "border-b border-border bg-background/70 backdrop-blur-xl backdrop-saturate-150"
          : "border-b border-transparent bg-transparent",
      )}
    >
      <div className="relative mx-auto flex h-14 w-full max-w-6xl items-center justify-between gap-4 px-4 md:px-6">
        <div className="flex items-center gap-4">
          <MobileNav />
          <Link
            href="/"
            className="group flex items-center gap-2.5 text-sm font-semibold tracking-tight text-foreground"
          >
            <EaseMark className="h-5 w-5" />
            <span>easeUI</span>
          </Link>
          <nav className="hidden items-center gap-0.5 md:flex">
            <Link
              href="/components/motion"
              className={cn(
                "rounded-md px-1.5 py-1.5 text-sm transition-colors lg:px-3",
                isComponents
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              Components
            </Link>
            <Link
              href="/playground"
              className={cn(
                "rounded-md px-1.5 py-1.5 text-sm transition-colors lg:px-3",
                isPlayground
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              Playground
            </Link>
          </nav>
        </div>

        <nav className="flex items-center gap-2">
          {isHome ? null : (
            // Between md and lg the field is back to its icon, so its label and
            // shortcut hint have to go with it. Left in, they overflow the
            // 36px button and paint over the controls beside it.
            <SiteSearch className="w-9 justify-center px-0 sm:w-44 sm:justify-start sm:px-3 md:w-9 md:justify-center md:px-0 md:max-lg:[&>kbd]:hidden md:max-lg:[&>span]:hidden lg:w-56 lg:justify-start lg:px-3" />
          )}
          <PressLink
            href={GITHUB_URL}
            target="_blank"
            rel="noreferrer noopener"
            className="group inline-flex h-9 items-center gap-1.5 rounded-2xl border border-border bg-card/20 px-3 text-xs font-medium text-foreground hover:border-(--color-border-strong)"
            aria-label={
              formattedStarCount
                ? `Star on GitHub, ${formattedStarCount} stars`
                : "Star on GitHub"
            }
          >
            <GithubIcon className="h-3.5 w-3.5" />
            {formattedStarCount ? (
              <span className="text-muted-foreground">{formattedStarCount}</span>
            ) : null}
          </PressLink>
          <ThemeToggle
            variant="circle"
            className="flex h-9 w-9 items-center justify-center rounded-2xl border border-border bg-card/20 text-muted-foreground transition-colors hover:border-(--color-border-strong) hover:text-foreground"
            iconClassName="h-4 w-4"
          />
        </nav>
      </div>
    </header>
  );
}

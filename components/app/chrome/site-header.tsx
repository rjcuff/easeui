"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { GithubIcon } from "@/components/app/brand-icons";
import { MobileNav } from "@/components/app/chrome/mobile-nav";
import { SiteSearch } from "@/components/app/chrome/site-search";
import { EaseMark } from "@/components/app/logo";
import { PressLink } from "@/components/app/press-link";
import { ProBadge } from "@/components/app/pro-button";
import { ThemeToggle } from "@/components/motion/theme-toggle";
import { GITHUB_URL } from "@/lib/site";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/components/motion", match: "/components/motion", label: "Components" },
  { href: "/components/agents", match: "/components/agents", label: "Agents" },
  { href: "/playground", match: "/playground", label: "Playground" },
];

/** 1234 becomes 1.2k. */
function compactCount(count: number) {
  return new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 })
    .format(count)
    .toLowerCase();
}

/** The header gains a hairline and a solid ground once the page scrolls under it. */
function useScrolled(threshold = 4) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const update = () => setScrolled(window.scrollY > threshold);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, [threshold]);
  return scrolled;
}

const iconButton =
  "inline-flex h-9 items-center justify-center rounded-full text-muted-foreground transition-colors duration-150 hover:bg-muted hover:text-foreground";

export function SiteHeader({ githubStarCount }: { githubStarCount: number | null }) {
  const pathname = usePathname();
  const scrolled = useScrolled();
  const stars = typeof githubStarCount === "number" ? compactCount(githubStarCount) : null;

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-40 border-b transition-colors duration-150",
        scrolled ? "border-border bg-background" : "border-transparent bg-background/0",
      )}
    >
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center gap-3 px-4 md:px-6">
        <MobileNav />
        <Link href="/" className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <EaseMark className="h-5 w-5" />
          easeUI
        </Link>

        <nav aria-label="Main" className="ml-4 hidden items-center gap-1 md:flex">
          {LINKS.map(({ href, match, label }) => {
            const active = pathname.startsWith(match);
            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "rounded-full px-3 py-1.5 text-sm transition-colors duration-150",
                  active
                    ? "bg-muted text-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-1.5">
          {pathname === "/" ? null : <SiteSearch className="w-9 justify-center px-0 sm:w-48 sm:justify-start sm:px-3" />}
          <ProBadge className="hidden sm:inline-flex" />
          <PressLink
            href={GITHUB_URL}
            target="_blank"
            rel="noreferrer noopener"
            aria-label={stars ? `easeUI on GitHub, ${stars} stars` : "easeUI on GitHub"}
            className={cn(iconButton, "gap-1.5 px-2.5 text-xs font-medium")}
          >
            <GithubIcon className="h-4 w-4" />
            {stars ? <span className="tabular-nums">{stars}</span> : null}
          </PressLink>
          <ThemeToggle variant="circle" className={cn(iconButton, "w-9")} iconClassName="h-4 w-4" />
        </div>
      </div>
    </header>
  );
}

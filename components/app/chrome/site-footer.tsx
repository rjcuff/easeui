import Link from "next/link";
import { GithubIcon } from "@/components/app/icons";
import { EaseMark } from "@/components/app/logo";
import { AUTHOR_X_URL, GITHUB_URL, SITE_AUTHOR } from "@/lib/site";

const LINKS = [
  { href: "/components/motion", label: "Components" },
  { href: "/playground", label: "Playground" },
  { href: "/llms.txt", label: "llms.txt" },
];

const iconLinkClass =
  "inline-flex h-11 w-11 items-center justify-center rounded-full text-muted-foreground transition-colors hover:text-foreground";

export function SiteFooter() {
  return (
    <footer className="mt-16 flex w-full flex-col items-center gap-8 border-t border-border py-14 text-center">
      <div className="flex flex-col items-center gap-3">
        <Link
          href="/"
          className="flex items-center gap-2 text-sm font-semibold tracking-tight text-foreground"
        >
          <EaseMark className="h-5 w-5" />
          easeUI
        </Link>
        <p className="max-w-sm text-pretty text-sm leading-6 text-muted-foreground">
          Open-source React components with smooth animations, added to your
          project as source files.
        </p>
      </div>

      <nav aria-label="Footer">
        <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          {LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="flex items-center gap-1">
        <Link
          href={GITHUB_URL}
          target="_blank"
          rel="noreferrer noopener"
          aria-label="GitHub"
          className={iconLinkClass}
        >
          <GithubIcon className="h-4 w-4" />
        </Link>
        <Link
          href={AUTHOR_X_URL}
          target="_blank"
          rel="noreferrer noopener"
          aria-label="X / Twitter"
          className={iconLinkClass}
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
        </Link>
      </div>

      <p className="text-xs text-muted-foreground">
        Created by{" "}
        <Link
          href={AUTHOR_X_URL}
          target="_blank"
          rel="noreferrer noopener"
          className="font-medium text-foreground underline-offset-2 hover:underline"
        >
          {SITE_AUTHOR}
        </Link>
        <span aria-hidden="true" className="mx-2">
          ·
        </span>
        © 2026 easeUI, MIT License
      </p>
    </footer>
  );
}

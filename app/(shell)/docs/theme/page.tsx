import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { ReactNode } from "react";
import { CodeBlock } from "@/components/app/docs/code-block";
import { THEME_CSS } from "@/lib/theme-css";

export const metadata: Metadata = {
  title: "Theme setup",
  description:
    "Prepare your project for easeUI in one step. Add the color tokens and easing curves the components use, with or without shadcn.",
  alternates: { canonical: "/docs/theme" },
  openGraph: {
    title: "Theme setup · easeUI",
    description:
      "Add the color tokens and easing curves easeUI components use, in one step.",
    url: "/docs/theme",
    type: "article",
    siteName: "easeUI",
    images: ["/api/og"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Theme setup · easeUI",
    images: ["/api/og"],
  },
};

const SHADCN_INIT = "npx shadcn@latest init";

const TOKENS = [
  {
    title: "Color",
    text: "Background, foreground, card, border, and accent values that flip between light and dark mode.",
  },
  {
    title: "Motion",
    text: "The ease-out and ease-in-out curves every easeUI animation is tuned against.",
  },
  {
    title: "Utilities",
    text: "Small helpers like hidden scrollbars and fade masks that a few components rely on.",
  },
];

function Code({ children }: { children: ReactNode }) {
  return (
    <code className="rounded bg-foreground/5 px-1.5 py-0.5 font-mono text-xs text-foreground">
      {children}
    </code>
  );
}

function Step({
  number,
  title,
  children,
}: {
  number: number;
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="flex w-full flex-col gap-4 rounded-2xl border border-border bg-card p-6">
      <div className="flex items-center gap-3">
        <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-foreground text-xs font-semibold tabular-nums text-background">
          {number}
        </span>
        <h2 className="text-lg font-semibold tracking-tight text-foreground">{title}</h2>
      </div>
      {children}
    </section>
  );
}

export default function ThemePage() {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-10">
      <header className="flex flex-col items-center gap-3 text-center">
        <h1 className="text-balance font-display text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
          Theme setup
        </h1>
        <p className="max-w-xl text-pretty text-sm leading-6 text-muted-foreground">
          Every easeUI component reads from the same small set of design
          tokens. Add them once and each component you install looks and moves
          the way it should.
        </p>
      </header>

      <div className="flex flex-col gap-6">
        <Step number={1} title="Already using shadcn">
          <p className="text-sm leading-6 text-muted-foreground">
            Your project already has the tokens. If you have not run init yet,
            do it once and it adds them to your CSS.
          </p>
          <CodeBlock code={SHADCN_INIT} lang="bash" filename="terminal" />
        </Step>

        <Step number={2} title="Starting without shadcn">
          <p className="text-sm leading-6 text-muted-foreground">
            Paste the stylesheet below into <Code>globals.css</Code>, right
            after <Code>@import "tailwindcss";</Code>. It needs Tailwind CSS v4.
            You can also{" "}
            <Link
              href="/theme.css"
              target="_blank"
              rel="noreferrer noopener"
              className="group inline-flex items-center gap-1 text-foreground underline underline-offset-4"
            >
              open the raw file
              <ArrowUpRight className="h-3 w-3 transition-transform duration-150 ease-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5 motion-reduce:transition-none" />
            </Link>
            .
          </p>
          <CodeBlock code={THEME_CSS} lang="css" filename="globals.css" />
        </Step>
      </div>

      <section className="flex flex-col gap-4">
        <h2 className="text-center text-sm font-medium text-muted-foreground">
          What the tokens cover
        </h2>
        <ul className="grid gap-4 sm:grid-cols-3">
          {TOKENS.map((token) => (
            <li
              key={token.title}
              className="flex flex-col gap-1.5 rounded-2xl bg-card p-5"
            >
              <span className="text-sm font-semibold text-foreground">{token.title}</span>
              <span className="text-sm leading-6 text-muted-foreground">{token.text}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

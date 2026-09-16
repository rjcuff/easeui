import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { InstallCommand } from "@/components/app/docs/install-command";

export const metadata: Metadata = {
  title: "Introduction",
  description:
    "What easeUI is, the stack it's built on, and why it ships as source files instead of a package.",
  alternates: { canonical: "/docs/introduction" },
  openGraph: {
    title: "Introduction · easeUI",
    description:
      "What easeUI is, the stack it's built on, and why it ships as source files instead of a package.",
    url: "/docs/introduction",
    type: "article",
    siteName: "easeUI",
    images: ["/api/og"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Introduction · easeUI",
    images: ["/api/og"],
  },
};

const STACK = [
  { name: "Next.js 16 and React 19", detail: "The site and every component." },
  {
    name: "Tailwind CSS v4",
    detail: "Utility classes plus the color and easing tokens components read from.",
  },
  {
    name: "Motion",
    detail: "For gestures, layout animation, and shared transitions where CSS alone isn't enough.",
  },
  { name: "TypeScript", detail: "Every component ships a documented props interface." },
  { name: "Bun", detail: "Package management, the dev server, and the test runner." },
];

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-5 border-t border-border pt-8">
      <h2 className="text-lg font-semibold tracking-tight text-foreground">{title}</h2>
      {children}
    </section>
  );
}

export default function IntroductionPage() {
  return (
    <article className="mx-auto flex w-full max-w-4xl flex-col gap-12 pb-8">
      <header className="flex flex-col gap-4">
        <h1 className="font-display text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
          Introduction
        </h1>
        <p className="max-w-2xl text-pretty text-muted-foreground">
          easeUI is a set of React components with smooth easing and spring
          animations. You add them to your project as source files, so you
          own the code and can change anything.
        </p>
      </header>

      <Section title="How components work">
        <p className="text-sm leading-6 text-muted-foreground">
          Each component lives on its own page with a live preview, its
          props, and its full source. There is no package to install and no
          version to track: the CLI copies the file into your project, so
          from that point on it is your code to read, change, or delete.
        </p>
        <p className="text-sm leading-6 text-muted-foreground">
          Components read their colors and easing curves from a small set of
          tokens, so they need a one-time{" "}
          <Link href="/docs/theme" className="text-foreground underline underline-offset-4">
            theme setup
          </Link>{" "}
          in your project before the first one is added.
        </p>
      </Section>

      <Section title="Installation">
        <p className="text-sm leading-6 text-muted-foreground">
          Once the theme is set up, add any component with its shadcn
          command, swapping in that component's name:
        </p>
        <InstallCommand className="max-w-lg" />
        <p className="text-sm leading-6 text-muted-foreground">
          Working with a coding agent? See the{" "}
          <Link href="/docs/ai-agents" className="text-foreground underline underline-offset-4">
            agent guide
          </Link>{" "}
          for the MCP server, an installable skill, and the machine-readable endpoints.
        </p>
      </Section>

      <Section title="The stack">
        <ul className="flex flex-col gap-3">
          {STACK.map((item) => (
            <li key={item.name} className="text-sm leading-6">
              <span className="font-medium text-foreground">{item.name}</span>{" "}
              <span className="text-muted-foreground">{item.detail}</span>
            </li>
          ))}
        </ul>
      </Section>

      <Section title="Why it exists">
        <p className="text-sm leading-6 text-muted-foreground">
          Most component libraries ship as a package you import and can't
          easily change. easeUI ships through the shadcn CLI instead, so
          every component lands in your own repo, in your own style, ready
          to edit.
        </p>
        <p className="text-sm leading-6 text-muted-foreground">
          The animations follow one small set of rules everywhere: animate
          transform and opacity, ease out fast, and turn everything off under
          reduced motion. See{" "}
          <a
            href="https://github.com/rjcuff/easeui/blob/main/CONTRIBUTING.md"
            target="_blank"
            rel="noreferrer noopener"
            className="text-foreground underline underline-offset-4"
          >
            CONTRIBUTING.md
          </a>{" "}
          for the full list.
        </p>
      </Section>

      <p className="border-t border-border pt-8 text-sm leading-6 text-muted-foreground">
        We hope you enjoy building with it. If something feels off or
        missing, open an issue or a pull request.
      </p>
    </article>
  );
}

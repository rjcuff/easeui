import type { Metadata } from "next";
import Link from "next/link";
import { EaseMark } from "@/components/app/logo";

export const metadata: Metadata = {
  title: "Page not found",
  description: "This page does not exist on easeUI.",
};

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center gap-6 py-16 text-center">
      <EaseMark className="h-10 w-10 text-muted-foreground" />
      <div className="flex flex-col gap-2">
        <h1 className="text-balance font-display text-3xl font-semibold tracking-tight text-foreground">
          This page does not exist
        </h1>
        <p className="max-w-sm text-pretty text-sm leading-6 text-muted-foreground">
          The link may be broken or the page may have moved. You can head home or
          browse the components instead.
        </p>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/"
          className="inline-flex min-h-11 items-center rounded-full bg-foreground px-5 text-sm font-medium text-background transition-colors duration-150 hover:bg-foreground/90"
        >
          Go home
        </Link>
        <Link
          href="/components/motion"
          className="inline-flex min-h-11 items-center rounded-full px-5 text-sm font-medium text-foreground shadow-[0_0_0_1px_var(--border-strong)] transition-colors duration-150 hover:bg-foreground/5"
        >
          Browse components
        </Link>
      </div>
    </div>
  );
}

import { ArrowUpRight, Sparkles } from "lucide-react";
import type { ProMatch } from "@/lib/pro-matches";
import { proUrl } from "@/lib/site";

/** A quiet pointer from a free component to its fuller take in easeUI Pro. */
export function ProMatchCard({ match, from }: { match: ProMatch; from: string }) {
  return (
    <a
      href={proUrl(match.path, `component-${from}`)}
      target="_blank"
      rel="noreferrer noopener"
      className="group flex flex-col gap-3 rounded-2xl bg-card p-5 shadow-[inset_0_0_0_1px_var(--border)] outline-none transition-[box-shadow,background-color] duration-200 hover:bg-[color-mix(in_oklch,var(--foreground)_4%,var(--card))] hover:shadow-[inset_0_0_0_1px_var(--border-strong)] focus-visible:ring-2 focus-visible:ring-foreground/40 sm:flex-row sm:items-center sm:gap-5"
    >
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-background text-foreground shadow-[inset_0_0_0_1px_var(--border)]">
        <Sparkles aria-hidden="true" className="h-4 w-4" />
      </span>
      <span className="flex min-w-0 flex-1 flex-col gap-1">
        <span className="text-xs font-medium text-muted-foreground">In easeUI Pro</span>
        <span className="text-sm font-medium text-foreground">{match.name}</span>
        <span className="text-pretty text-sm leading-6 text-muted-foreground">{match.pitch}</span>
      </span>
      <span className="inline-flex shrink-0 items-center gap-1 text-sm font-medium text-foreground">
        See it
        <ArrowUpRight
          aria-hidden="true"
          className="h-4 w-4 text-muted-foreground transition-transform duration-150 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 motion-reduce:transition-none"
        />
      </span>
    </a>
  );
}

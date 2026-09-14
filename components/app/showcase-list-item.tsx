import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { NewDot } from "@/components/app/new-indicator";

export interface ShowcaseListItemProps {
  category: string;
  slug: string;
  name: string;
  description: string;
  badge?: "new";
  launchedAt?: string;
}

/** A compact, preview-free row for a component index with many entries. */
export function ShowcaseListItem({
  category,
  slug,
  name,
  description,
  badge,
  launchedAt,
}: ShowcaseListItemProps) {
  return (
    <article className="group/card relative flex items-start justify-between gap-4 rounded-2xl border border-border bg-card px-4 py-3.5">
      <Link
        href={`/components/${category}/${slug}`}
        prefetch={false}
        aria-label={`View ${name}`}
        className="absolute inset-0 z-20 rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      />
      <div className="min-w-0">
        <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <span className="truncate">{name}</span>
          {badge === "new" ? <NewDot launchedAt={launchedAt} /> : null}
        </h3>
        <p className="mt-1 line-clamp-2 text-xs leading-5 text-muted-foreground">
          {description}
        </p>
      </div>
      <ChevronRight
        aria-hidden="true"
        className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground opacity-0 transition-[opacity,transform] duration-150 ease-out group-hover/card:translate-x-0.5 group-hover/card:opacity-100 group-focus-within/card:translate-x-0.5 group-focus-within/card:opacity-100 motion-reduce:transition-opacity"
      />
    </article>
  );
}

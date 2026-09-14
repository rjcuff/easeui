"use client";

import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { useInView } from "motion/react";
import { useRef } from "react";
import { PreviewFit } from "@/components/app/landing/preview-fit";
import { NewDot } from "@/components/app/new-indicator";
import { getPreview } from "@/components/previews";

export interface ShowcaseCardProps {
  category: string;
  slug: string;
  name: string;
  description: string;
  badge?: "new";
  launchedAt?: string;
}

/**
 * easeUI component card. A live preview sits above the name and a short
 * description. Hover fades in a chevron.
 */
export function ShowcaseCard({
  category,
  slug,
  name,
  description,
  badge,
  launchedAt,
}: ShowcaseCardProps) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true });
  const Preview = getPreview(category, slug);

  return (
    <article
      ref={ref}
      className="group/card relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card"
    >
      <Link
        href={`/components/${category}/${slug}`}
        prefetch={false}
        aria-label={`View ${name}`}
        className="absolute inset-0 z-20 rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      />

      <div className="relative h-52 border-b border-border bg-background">
        {inView && Preview ? (
          <PreviewFit maxScale={0.8}>
            <Preview />
          </PreviewFit>
        ) : null}
      </div>

      <div className="flex items-start justify-between gap-4 px-4 py-3.5">
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
          className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground opacity-0 transition-opacity duration-150 ease-out group-hover/card:opacity-100 group-focus-within/card:opacity-100"
        />
      </div>
    </article>
  );
}

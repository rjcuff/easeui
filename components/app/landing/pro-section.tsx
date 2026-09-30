"use client";

import { ArrowUpRight, Check } from "lucide-react";
import { useEffect, useRef } from "react";
import { ProButton } from "@/components/app/pro-button";
import { proUrl } from "@/lib/site";

const POINTS = [
  "A model picker with real provider logos, streaming replies, tool calls, approvals and diffs",
  "Page blocks for heroes, pricing, dashboards, settings and agent consoles",
  "Whole templates to download, like an AI chat app and a personal site",
];

/**
 * The home page's pitch for Pro, shown after the free catalog so it reads as the next step rather
 * than a detour. The loop plays only while it's on screen, and not at all for reduced motion.
 */
export function ProSection() {
  const video = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const node = video.current;
    if (!node) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) node.play().catch(() => {});
      else node.pause();
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <section aria-labelledby="pro-heading" className="pb-24">
      <div className="grid grid-cols-1 items-center gap-10 rounded-3xl bg-card p-6 shadow-[inset_0_0_0_1px_var(--border)] md:grid-cols-2 md:p-10">
        <div className="flex flex-col gap-5">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">easeUI Pro</p>
          <h2 id="pro-heading" className="text-balance font-display text-3xl font-semibold tracking-tight text-foreground">
            Building an AI product?
          </h2>
          <p className="text-pretty text-muted-foreground">
            easeUI stays free. Pro is the paid set for AI products, with the same motion rules and the same install
            command.
          </p>
          <ul className="flex flex-col gap-3">
            {POINTS.map((point) => (
              <li key={point} className="flex items-start gap-3 text-sm leading-6 text-muted-foreground">
                <Check aria-hidden="true" className="mt-1 h-4 w-4 shrink-0 text-foreground" strokeWidth={2.5} />
                {point}
              </li>
            ))}
          </ul>
          <div className="flex flex-wrap items-center gap-3 pt-1">
            <ProButton placement="home-section" />
            <a
              href={proUrl("/templates", "home-section")}
              target="_blank"
              rel="noreferrer noopener"
              className="group inline-flex min-h-11 items-center gap-1.5 rounded-full px-4 text-sm font-medium text-muted-foreground transition-colors duration-150 hover:text-foreground"
            >
              See the templates
              <ArrowUpRight
                aria-hidden="true"
                className="h-4 w-4 transition-transform duration-150 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 motion-reduce:transition-none"
              />
            </a>
          </div>
        </div>

        <a
          href={proUrl("", "home-video")}
          target="_blank"
          rel="noreferrer noopener"
          aria-label="Open easeUI Pro"
          className="block overflow-hidden rounded-2xl shadow-[0_0_0_1px_var(--border-strong)] outline-none focus-visible:ring-2 focus-visible:ring-foreground/40"
        >
          <video
            ref={video}
            src="/pro-loop.mp4"
            poster="/pro-loop-poster.jpg"
            muted
            loop
            playsInline
            preload="metadata"
            aria-label="easeUI Pro components morphing from a prompt bar through a streaming reply, tool call, approval, diff, model picker and voice input"
            className="aspect-square w-full bg-muted object-cover"
          />
        </a>
      </div>
    </section>
  );
}

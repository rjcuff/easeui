import { Star } from "lucide-react";
import { GITHUB_URL } from "@/lib/site";

/** One line at the foot of a page asking for a star. Stars are how other people find the repo. */
export function StarNudge() {
  return (
    <a
      href={GITHUB_URL}
      target="_blank"
      rel="noreferrer noopener"
      className="group inline-flex items-center gap-1.5 rounded-sm text-xs text-muted-foreground outline-none transition-colors duration-150 hover:text-foreground focus-visible:ring-2 focus-visible:ring-foreground/40"
    >
      <Star aria-hidden="true" className="h-3.5 w-3.5 transition-colors duration-150 group-hover:fill-warning group-hover:text-warning" />
      Free and open source. Star easeUI on GitHub if it helped.
    </a>
  );
}

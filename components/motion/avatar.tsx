"use client";

import { Children, type ReactNode, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export type AvatarSize = "sm" | "md" | "lg";
export type AvatarStatus = "online" | "away" | "busy";

export interface AvatarProps {
  src?: string;
  alt?: string;
  /** Shown while there is no image, or once it fails to load. */
  fallback: string;
  /** Default "md". */
  size?: AvatarSize;
  /** A small dot in the corner for presence. Leave unset for none. */
  status?: AvatarStatus;
  className?: string;
}

const SIZES: Record<AvatarSize, { box: string; text: string; dot: string }> = {
  sm: { box: "h-8 w-8", text: "text-xs", dot: "h-2.5 w-2.5" },
  md: { box: "h-10 w-10", text: "text-sm", dot: "h-3 w-3" },
  lg: { box: "h-14 w-14", text: "text-base", dot: "h-3.5 w-3.5" },
};

const STATUS: Record<AvatarStatus, { color: string; label: string }> = {
  online: { color: "bg-success", label: "Online" },
  away: { color: "bg-warning", label: "Away" },
  busy: { color: "bg-destructive", label: "Busy" },
};

/** A round avatar. The image fades in on load and crossfades to the fallback if it fails. */
export function Avatar({ src, alt = "", fallback, size = "md", status, className }: AvatarProps) {
  const [loaded, setLoaded] = useState(false);
  const [errored, setErrored] = useState(false);
  const img = useRef<HTMLImageElement>(null);
  const showImage = Boolean(src) && !errored;

  // A cached image can finish before React attaches onLoad, so check once it mounts.
  useEffect(() => {
    const node = img.current;
    if (!node?.complete) return;
    if (node.naturalWidth > 0) setLoaded(true);
    else setErrored(true);
  }, []);

  return (
    <span className={cn("relative inline-flex shrink-0", SIZES[size].box, className)}>
      <span
        className={cn(
          "relative inline-flex h-full w-full items-center justify-center overflow-hidden rounded-full bg-muted font-medium text-muted-foreground shadow-[0_0_0_1px_var(--border)]",
          SIZES[size].text,
        )}
      >
        <span
          aria-hidden={showImage && loaded}
          className={cn("transition-opacity duration-150 ease-out", showImage && loaded ? "opacity-0" : "opacity-100")}
        >
          {fallback}
        </span>
        {showImage ? (
          // A plain img, not next/image: this ships as source a consumer copies
          // into their own app, which may not have next/image configured.
          // biome-ignore lint/performance/noImgElement: portable across non-Next apps.
          <img
            ref={img}
            src={src}
            alt={alt}
            onLoad={() => setLoaded(true)}
            onError={() => setErrored(true)}
            className={cn(
              "absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-150 ease-out",
              loaded && "opacity-100",
            )}
          />
        ) : null}
        {/* A faint inner edge, so a pale photo still has a shape against the page. */}
        <span aria-hidden="true" className="pointer-events-none absolute inset-0 rounded-full shadow-[inset_0_0_0_1px_var(--border-strong)]" />
      </span>
      {status ? (
        <span
          role="img"
          aria-label={STATUS[status].label}
          className={cn(
            "absolute bottom-0 right-0 rounded-full shadow-[0_0_0_2px_var(--background)]",
            SIZES[size].dot,
            STATUS[status].color,
          )}
        />
      ) : null}
    </span>
  );
}

export interface AvatarGroupProps {
  /** Avatars to stack. */
  children: ReactNode;
  /** How many to show before the rest fold into a "+N" chip. Default 4. */
  max?: number;
  /** Matches the avatars inside. Default "md". */
  size?: AvatarSize;
  className?: string;
}

const OVERLAP: Record<AvatarSize, string> = { sm: "-ml-2.5", md: "-ml-3", lg: "-ml-4" };
// How far each avatar slides right when the group fans out, per position.
const SPREAD: Record<AvatarSize, number> = { sm: 6, md: 8, lg: 10 };

/** Overlapping avatars that fan apart on hover so every face shows. Anything past `max` becomes a "+N" chip. */
export function AvatarGroup({ children, max = 4, size = "md", className }: AvatarGroupProps) {
  const items = Children.toArray(children);
  const shown = items.slice(0, max);
  const rest = items.length - shown.length;
  const all = rest > 0 ? [...shown, <OverflowChip key="rest" count={rest} size={size} />] : shown;

  return (
    <div className={cn("group/avatars flex items-center", className)}>
      {all.map((child, index) => (
        <span
          // biome-ignore lint/suspicious/noArrayIndexKey: a fixed stack, ordered by the caller.
          key={index}
          className={cn("relative rounded-full shadow-[0_0_0_2px_var(--background)]", index > 0 && OVERLAP[size])}
          style={{ zIndex: all.length - index, ["--spread" as string]: `${index * SPREAD[size]}px` }}
        >
          <span className="block transition-transform duration-200 ease-out group-hover/avatars:translate-x-[var(--spread)] motion-reduce:transition-none">
            {child}
          </span>
        </span>
      ))}
    </div>
  );
}

function OverflowChip({ count, size }: { count: number; size: AvatarSize }) {
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-full bg-muted font-medium tabular-nums text-muted-foreground shadow-[0_0_0_1px_var(--border)]",
        SIZES[size].box,
        SIZES[size].text,
      )}
    >
      +{count}
    </span>
  );
}

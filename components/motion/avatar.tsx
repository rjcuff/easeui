"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

export interface AvatarProps {
  src?: string;
  alt?: string;
  /** Shown while there is no image, or once it fails to load. */
  fallback: string;
  className?: string;
}

/** A round avatar. The image fades in on load and crossfades to the fallback if it fails. */
export function Avatar({ src, alt = "", fallback, className }: AvatarProps) {
  const [loaded, setLoaded] = useState(false);
  const [errored, setErrored] = useState(false);
  const showImage = Boolean(src) && !errored;

  return (
    <span
      className={cn(
        "relative inline-flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-muted text-sm font-medium text-muted-foreground shadow-[0_0_0_1px_var(--border)]",
        className,
      )}
    >
      <span
        aria-hidden={showImage && loaded}
        className={cn(
          "transition-opacity duration-150 ease-out",
          showImage && loaded ? "opacity-0" : "opacity-100",
        )}
      >
        {fallback}
      </span>
      {showImage ? (
        // A plain img, not next/image: this ships as source a consumer copies
        // into their own app, which may not have next/image configured.
        // biome-ignore lint/performance/noImgElement: portable across non-Next apps.
        <img
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
    </span>
  );
}

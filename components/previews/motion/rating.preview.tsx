"use client";

import { useState } from "react";
import { Rating } from "@/components/motion/rating";

const WORDS = ["Tap a star", "Not for me", "Could be better", "Pretty good", "Really good", "Love it"];

export function RatingPreview() {
  const [value, setValue] = useState(0);

  return (
    <div className="flex flex-col items-center gap-3">
      <Rating value={value} onValueChange={setValue} size="lg" label="Rate this component" />
      <p className="h-5 text-sm text-muted-foreground" aria-live="polite">
        {WORDS[value]}
      </p>
    </div>
  );
}

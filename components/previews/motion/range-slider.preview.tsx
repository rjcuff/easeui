"use client";

import { useState } from "react";
import { RangeSlider } from "@/components/motion/range-slider";

export function RangeSliderPreview() {
  const [radius, setRadius] = useState(12);

  return (
    <div className="flex w-full max-w-xs flex-col items-center gap-6">
      <div
        aria-hidden="true"
        className="h-24 w-24 bg-accent"
        style={{ borderRadius: radius }}
      />
      <label className="flex w-full flex-col gap-3 text-sm">
        <span className="flex items-center justify-between text-muted-foreground">
          Corner radius
          <output className="tabular-nums text-foreground">{radius}px</output>
        </span>
        <RangeSlider value={radius} onValueChange={setRadius} min={0} max={48} step={4} aria-label="Corner radius" />
      </label>
    </div>
  );
}

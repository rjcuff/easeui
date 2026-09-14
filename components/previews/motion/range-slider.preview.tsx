"use client";

import { useState } from "react";
import { RangeSlider } from "@/components/motion/range-slider";

export function RangeSliderPreview() {
  const [value, setValue] = useState(40);

  return (
    <div className="flex w-full max-w-sm flex-col gap-3">
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>Volume</span>
        <span className="tabular-nums text-foreground">{value}</span>
      </div>
      <RangeSlider value={value} onValueChange={setValue} step={5} aria-label="Volume" />
    </div>
  );
}

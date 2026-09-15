"use client";

import { useState } from "react";
import { Button } from "@/components/motion/button";
import { NumberTicker } from "@/components/motion/number-ticker";

export function NumberTickerPreview() {
  const [value, setValue] = useState(1284);

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="font-display text-5xl font-semibold text-foreground">
        <NumberTicker value={value} />
      </div>
      <div className="flex gap-2">
        <Button variant="secondary" size="sm" onClick={() => setValue((v) => Math.max(0, v - 137))}>
          Sell
        </Button>
        <Button variant="secondary" size="sm" onClick={() => setValue((v) => v + 349)}>
          Buy
        </Button>
      </div>
    </div>
  );
}

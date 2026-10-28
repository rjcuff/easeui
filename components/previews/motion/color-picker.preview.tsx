"use client";

import { useState } from "react";
import { ColorPicker } from "@/components/motion/color-picker";

export function ColorPickerPreview() {
  const [color, setColor] = useState("#6366f1");

  return (
    <div className="flex w-full flex-wrap items-center justify-center gap-10">
      <div className="flex flex-col items-center gap-3">
        <div aria-hidden="true" className="flex size-28 items-center justify-center rounded-3xl" style={{ backgroundColor: color }} />
        <output className="font-mono text-xs text-muted-foreground">{color}</output>
      </div>
      <ColorPicker label="Accent color" value={color} onValueChange={setColor} />
    </div>
  );
}

"use client";

import { useState } from "react";
import { GradientText } from "@/components/motion/gradient-text";
import { Switch } from "@/components/motion/switch";

export function GradientTextPreview() {
  const [active, setActive] = useState(true);

  return (
    <div className="flex flex-col items-center gap-8 text-center">
      <p className="text-4xl font-semibold tracking-tight text-foreground">
        Upgrade to{" "}
        <GradientText active={active} className="-mb-[0.15em] inline-block pb-[0.15em]">
          Pro
        </GradientText>
      </p>
      <label
        htmlFor="gradient-text-active"
        className="flex cursor-pointer items-center gap-3 text-sm text-muted-foreground"
      >
        Highlight
        <Switch id="gradient-text-active" size="sm" checked={active} onCheckedChange={setActive} />
      </label>
    </div>
  );
}

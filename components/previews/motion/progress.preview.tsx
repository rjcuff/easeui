"use client";

import { useEffect, useState } from "react";
import { Progress } from "@/components/motion/progress";

export function ProgressPreview() {
  const [value, setValue] = useState(20);

  useEffect(() => {
    const interval = setInterval(() => {
      setValue((v) => (v >= 100 ? 20 : v + 20));
    }, 1200);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex w-full max-w-xs flex-col gap-6">
      <Progress value={value} />
      <Progress />
    </div>
  );
}

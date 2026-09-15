"use client";

import { Globe, Terminal } from "lucide-react";
import { useEffect, useState } from "react";
import { ToolChip, type ToolChipStatus } from "@/components/motion/tool-chip";

export function ToolChipPreview() {
  const [status, setStatus] = useState<ToolChipStatus>("running");

  useEffect(() => {
    const timeout = setTimeout(() => setStatus("done"), 1800);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      <ToolChip icon={<Globe className="h-full w-full" />} label="Web search" status={status} />
      <ToolChip icon={<Terminal className="h-full w-full" />} label="Run tests" status="error" />
    </div>
  );
}

"use client";

import { useState } from "react";
import { HoldToConfirm } from "@/components/motion/hold-to-confirm";

export function HoldToConfirmPreview() {
  const [deleted, setDeleted] = useState(0);

  return (
    <div className="flex flex-col items-center gap-4 text-center">
      <HoldToConfirm onConfirm={() => setDeleted((count) => count + 1)} confirmedLabel="Project deleted">
        Hold to delete project
      </HoldToConfirm>
      <p className="text-xs text-muted-foreground">
        {deleted ? `Deleted ${deleted} ${deleted === 1 ? "time" : "times"}` : "Let go early to cancel"}
      </p>
    </div>
  );
}

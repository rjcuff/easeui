"use client";

import { useState } from "react";
import { MorphingSearch } from "@/components/motion/morphing-search";

export function MorphingSearchPreview() {
  const [lastQuery, setLastQuery] = useState<string | null>(null);

  return (
    <div className="flex flex-col items-center gap-3">
      <MorphingSearch placeholder="Search components..." onSearch={setLastQuery} />
      <p className="h-5 text-sm text-muted-foreground">
        {lastQuery ? `Searched for "${lastQuery}"` : "Try searching for something"}
      </p>
    </div>
  );
}

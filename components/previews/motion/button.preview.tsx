"use client";

import { ArrowRight, Download, Trash2 } from "lucide-react";
import { Button } from "@/components/motion/button";

export function ButtonPreview() {
  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button variant="primary">
          Continue
          <ArrowRight className="h-4 w-4 transition-transform duration-150 ease-out group-hover:translate-x-0.5 motion-reduce:transition-none" />
        </Button>
        <Button variant="secondary">
          <Download className="h-4 w-4 group-hover:animate-action-download motion-reduce:group-hover:animate-none" />
          Download
        </Button>
        <Button variant="outline">Outline</Button>
        <Button variant="ghost">Ghost</Button>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button size="sm">Small</Button>
        <Button size="md">Medium</Button>
        <Button size="lg">Large</Button>
        <Button variant="secondary" size="icon" aria-label="Delete">
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/motion/select";

export function SelectPreview() {
  const [order, setOrder] = useState("updated");

  return (
    <div className="flex w-60 flex-col gap-2">
      <span className="text-xs font-medium text-muted-foreground">Sort projects</span>
      <Select value={order} onValueChange={setOrder}>
        <SelectTrigger>
          <SelectValue placeholder="Choose an order" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="updated">Recently updated</SelectItem>
          <SelectItem value="newest">Newest first</SelectItem>
          <SelectItem value="oldest">Oldest first</SelectItem>
          <SelectItem value="name">Name</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}

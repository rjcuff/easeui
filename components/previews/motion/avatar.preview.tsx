"use client";

import { Avatar } from "@/components/motion/avatar";

export function AvatarPreview() {
  return (
    <div className="flex items-center gap-3">
      <Avatar fallback="MR" />
      <Avatar fallback="SL" />
      <Avatar src="/does-not-exist.png" alt="" fallback="AK" />
    </div>
  );
}

"use client";

import { CopyButton } from "@/components/motion/copy-button";

const INVITE = "https://easeui.dev/invite/7f3k9q";

export function CopyButtonPreview() {
  return (
    <div className="flex w-full max-w-sm flex-col items-center gap-5">
      <div className="flex w-full items-center gap-2 rounded-full bg-background py-1 pl-4 pr-1 shadow-[0_0_0_1px_var(--border)]">
        <span className="min-w-0 flex-1 truncate font-mono text-xs text-muted-foreground">{INVITE}</span>
        <CopyButton value={INVITE} />
      </div>
      <CopyButton value={INVITE} label="Copy invite link" copiedLabel="Link copied" />
    </div>
  );
}

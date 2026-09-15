"use client";

import { useState } from "react";
import { ToolApproval, type ToolApprovalStatus } from "@/components/motion/tool-approval";

export function ToolApprovalPreview() {
  const [status, setStatus] = useState<ToolApprovalStatus>("pending");

  return (
    <div className="w-full max-w-sm">
      <ToolApproval
        title="Run a shell command"
        description="rm -rf dist/ && npm run build"
        status={status}
        onApprove={() => setStatus("approved")}
        onDeny={() => setStatus("denied")}
      />
    </div>
  );
}

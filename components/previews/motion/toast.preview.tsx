"use client";

import { Button } from "@/components/motion/button";
import { Toaster, toast } from "@/components/motion/toast";

export function ToastPreview() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      <Button variant="secondary" onClick={() => toast.success("Changes saved")}>
        Save
      </Button>
      <Button
        variant="secondary"
        onClick={() =>
          toast("Conversation archived", {
            action: { label: "Undo", onClick: () => toast("Conversation restored") },
          })
        }
      >
        Archive
      </Button>
      <Button
        variant="secondary"
        onClick={() =>
          toast("Export started", {
            description:
              "We are putting your files together. Large projects can take a few minutes, and you can keep working meanwhile.",
          })
        }
      >
        Export
      </Button>
      <Button
        variant="secondary"
        onClick={() => toast.error("Upload failed", { description: "Check your connection and try again." })}
      >
        Upload
      </Button>
      <Toaster />
    </div>
  );
}

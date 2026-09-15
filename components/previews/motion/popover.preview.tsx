"use client";

import { Settings2 } from "lucide-react";
import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/motion/popover";
import { Switch } from "@/components/motion/switch";

export function PopoverPreview() {
  const [emailUpdates, setEmailUpdates] = useState(true);
  const [pushAlerts, setPushAlerts] = useState(false);

  return (
    <Popover>
      <PopoverTrigger className="inline-flex h-9 items-center gap-2 rounded-full bg-card px-3.5 text-sm font-medium text-foreground shadow-[0_0_0_1px_var(--border)] outline-none transition-colors duration-150 hover:bg-muted focus-visible:ring-2 focus-visible:ring-foreground/40">
        <Settings2 aria-hidden="true" className="h-4 w-4" />
        Notifications
      </PopoverTrigger>
      <PopoverContent>
        <div className="flex flex-col gap-4">
          <label htmlFor="email-updates" className="flex items-center justify-between gap-4 text-sm">
            <span className="text-foreground">Email updates</span>
            <Switch id="email-updates" checked={emailUpdates} onCheckedChange={setEmailUpdates} />
          </label>
          <label htmlFor="push-alerts" className="flex items-center justify-between gap-4 text-sm">
            <span className="text-foreground">Push alerts</span>
            <Switch id="push-alerts" checked={pushAlerts} onCheckedChange={setPushAlerts} />
          </label>
        </div>
      </PopoverContent>
    </Popover>
  );
}

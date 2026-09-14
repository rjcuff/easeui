"use client";

import { Switch } from "@/components/motion/switch";

const SETTINGS = [
  { id: "digest", title: "Weekly digest", detail: "A summary every Monday", on: true },
  { id: "mentions", title: "Mentions", detail: "When someone tags you", on: true },
  { id: "sounds", title: "Sounds", detail: "Play a chime for new messages", on: false },
];

export function SwitchPreview() {
  return (
    <div className="flex w-full max-w-xs flex-col rounded-2xl bg-background p-1.5 shadow-[0_0_0_1px_var(--border)]">
      {SETTINGS.map((setting) => (
        <label
          key={setting.id}
          htmlFor={`setting-${setting.id}`}
          className="flex cursor-pointer items-center justify-between gap-4 rounded-xl px-3 py-2.5 transition-colors duration-150 hover:bg-muted"
        >
          <span className="flex flex-col text-sm">
            <span className="font-medium text-foreground">{setting.title}</span>
            <span className="text-xs text-muted-foreground">{setting.detail}</span>
          </span>
          <Switch id={`setting-${setting.id}`} defaultChecked={setting.on} />
        </label>
      ))}
    </div>
  );
}

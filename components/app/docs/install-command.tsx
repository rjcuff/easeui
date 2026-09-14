"use client";

import { useState } from "react";
import { CopyButton } from "@/components/app/docs/copy-button";
import { Tabs, TabsList, TabsTrigger } from "@/components/motion/tabs";
import { cn } from "@/lib/utils";

const PM_COMMANDS = {
  bun: "bunx --bun",
  npm: "npx",
  pnpm: "pnpm dlx",
  yarn: "yarn dlx",
} as const;

type PM = keyof typeof PM_COMMANDS;
const PMS = Object.keys(PM_COMMANDS) as PM[];

const REGISTRY_NAMESPACE = "@easeui";
/** Shown when no specific component is given, such as on the homepage. */
const PLACEHOLDER = "component-name";

export function InstallCommand({
  className,
  slug,
}: {
  className?: string;
  slug?: string;
}) {
  const [pm, setPm] = useState<PM>("bun");
  const name = slug ?? PLACEHOLDER;
  const command = `${PM_COMMANDS[pm]} shadcn add ${REGISTRY_NAMESPACE}/${name}`;

  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border border-border bg-card text-sm",
        className,
      )}
    >
      <div className="flex items-center gap-2 border-b border-border px-3 py-1.5">
        <Tabs value={pm} onValueChange={(v) => setPm(v as PM)} variant="segment">
          <TabsList className="bg-transparent p-0">
            {PMS.map((p) => (
              <TabsTrigger key={p} value={p} className="min-h-7 px-2.5 text-xs">
                {p}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        <div className="ml-auto shrink-0">
          <CopyButton text={command} eventName="copy_install_command" eventLabel={name} />
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-max whitespace-nowrap px-5 py-4 font-mono text-[13px]">
          <span className="select-none text-muted-foreground">{"$ "}</span>
          <span className="text-foreground">{PM_COMMANDS[pm]} shadcn add </span>
          <span className="text-muted-foreground">{REGISTRY_NAMESPACE}/</span>
          <span className={slug ? "text-accent" : "text-muted-foreground"}>{name}</span>
        </div>
      </div>
    </div>
  );
}

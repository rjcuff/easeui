import Link from "next/link";
import type { ReactNode } from "react";
import { CodeBlock } from "@/components/app/docs/code-block";
import { InstallCommand } from "@/components/app/docs/install-command";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/motion/tabs";
import { buildEntry } from "@/lib/registry-server";

/** Packages every React project already has, so they are left out of the install line. */
const PREINSTALLED = new Set(["react", "react-dom", "next"]);

function Step({ number, title, children }: { number: number; title: string; children: ReactNode }) {
  return (
    <li className="flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-foreground text-xs font-semibold tabular-nums text-background">
          {number}
        </span>
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
      </div>
      {children}
    </li>
  );
}

/** Install instructions, either through the shadcn CLI or by copying files by hand. */
export async function InstallSection({ category, slug }: { category: string; slug: string }) {
  const entry = await buildEntry(category, slug);
  const dependencies = entry?.dependencies.filter((dep) => !PREINSTALLED.has(dep)) ?? [];
  const files = entry?.files.filter((file) => file.type !== "preview") ?? [];
  const filesStep = dependencies.length ? 3 : 2;

  return (
    <Tabs defaultValue="cli" variant="underline">
      <TabsList>
        <TabsTrigger value="cli">shadcn CLI</TabsTrigger>
        <TabsTrigger value="manual">Manual</TabsTrigger>
      </TabsList>

      <TabsContent value="cli" className="mt-5">
        <InstallCommand slug={slug} />
      </TabsContent>

      <TabsContent value="manual" className="mt-5">
        <ol className="flex flex-col gap-8">
          <Step number={1} title="Set up the theme tokens">
            <p className="text-sm leading-6 text-muted-foreground">
              Do this once per project. Follow the{" "}
              <Link href="/docs/theme" className="text-foreground underline underline-offset-4">
                theme setup
              </Link>{" "}
              or skip it if you already ran shadcn init.
            </p>
          </Step>
          {dependencies.length ? (
            <Step number={2} title="Install the dependencies">
              <CodeBlock code={`npm install ${dependencies.join(" ")}`} lang="bash" filename="terminal" />
            </Step>
          ) : null}
          <Step number={filesStep} title="Add the source files">
            <div className="flex flex-col gap-4">
              {files.map((file) => (
                <CodeBlock key={file.path} code={file.content} filename={file.path} />
              ))}
            </div>
          </Step>
        </ol>
      </TabsContent>
    </Tabs>
  );
}

export const REGISTRY_NAMESPACE = "@easeui";

export const PM_COMMANDS = {
  bun: "bunx --bun",
  npm: "npx",
  pnpm: "pnpm dlx",
  yarn: "yarn dlx",
} as const;

export type PackageManager = keyof typeof PM_COMMANDS;
export const PACKAGE_MANAGERS = Object.keys(PM_COMMANDS) as PackageManager[];

export function installCommand(slug: string, pm: PackageManager = "bun") {
  return `${PM_COMMANDS[pm]} shadcn add ${REGISTRY_NAMESPACE}/${slug}`;
}

/** Bypasses shadcn's directory namespace lookup; useful as a fallback if it's ever unreachable. */
export function directInstallCommand(slug: string, pm: PackageManager = "bun") {
  return `${PM_COMMANDS[pm]} shadcn add https://easeui.dev/r/${slug}.json`;
}

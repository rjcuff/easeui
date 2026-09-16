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

/**
 * Works today regardless of whether the @easeui namespace is registered with
 * shadcn's directory yet. Prefer `installCommand` once it resolves.
 */
export function directInstallCommand(slug: string, pm: PackageManager = "bun") {
  return `${PM_COMMANDS[pm]} shadcn add https://easeui.dev/r/${slug}.json`;
}

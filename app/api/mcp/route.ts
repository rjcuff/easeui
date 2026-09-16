import { createMcpHandler } from "mcp-handler";
import { z } from "zod";
import { directInstallCommand, installCommand, PACKAGE_MANAGERS } from "@/lib/install-command";
import { buildEntry, buildIndex, findCategoryBySlug } from "@/lib/registry-server";

/** Lightweight relevance score over a component's name/slug/description/category. */
function score(comp: { slug: string; name: string; description: string; category: string }, query: string) {
  const q = query.toLowerCase();
  const name = comp.name.toLowerCase();
  const slug = comp.slug.toLowerCase();
  if (slug === q || name === q) return 100;
  if (slug.includes(q) || name.includes(q)) return 60;
  if (comp.description.toLowerCase().includes(q)) return 30;
  if (comp.category.toLowerCase().includes(q)) return 10;
  return 0;
}

const handler = createMcpHandler((server) => {
  server.registerTool(
    "list_components",
    {
      title: "List components",
      description:
        "List easeUI components (React components with natural motion). Optionally filter by category slug ('motion' or 'agents').",
      inputSchema: z.object({
        category: z.string().optional().describe("Category slug to filter by, e.g. 'motion' or 'agents'."),
      }),
    },
    async ({ category }) => {
      const index = await buildIndex();
      const components = category ? index.components.filter((c) => c.category === category) : index.components;
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              components.map((c) => ({ slug: c.slug, name: c.name, category: c.category, description: c.description })),
              null,
              2,
            ),
          },
        ],
      };
    },
  );

  server.registerTool(
    "search_components",
    {
      title: "Search components",
      description:
        "Search easeUI components by keyword. Matches name, slug, description and category. Returns the best matches first.",
      inputSchema: z.object({
        query: z.string().describe("Search term, e.g. 'toast', 'command palette', 'bottom sheet'."),
      }),
    },
    async ({ query }) => {
      const index = await buildIndex();
      const ranked = index.components
        .map((c) => ({ c, s: score(c, query) }))
        .filter((r) => r.s > 0)
        .sort((a, b) => b.s - a.s)
        .map((r) => ({ slug: r.c.slug, name: r.c.name, category: r.c.category, description: r.c.description }));
      return { content: [{ type: "text", text: JSON.stringify(ranked, null, 2) }] };
    },
  );

  server.registerTool(
    "get_component",
    {
      title: "Get component",
      description:
        "Get full details for an easeUI component by slug: description, npm dependencies, every source file (path + contents) and the install command. Use this to copy the component into a project.",
      inputSchema: z.object({
        slug: z.string().describe("Component slug, e.g. 'command-palette' (from list_components/search_components)."),
      }),
    },
    async ({ slug }) => {
      const category = findCategoryBySlug(slug);
      const entry = category ? await buildEntry(category.slug, slug) : null;
      if (!entry) {
        return { isError: true, content: [{ type: "text", text: `Could not find a component with slug "${slug}".` }] };
      }
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              {
                slug: entry.slug,
                name: entry.name,
                description: entry.description,
                category: entry.category,
                page_url: entry.page_url,
                dependencies: entry.dependencies,
                install: directInstallCommand(entry.slug),
                install_via_namespace: `${installCommand(entry.slug)} (only once @easeui is registered with shadcn's directory)`,
                files: entry.files,
              },
              null,
              2,
            ),
          },
        ],
      };
    },
  );

  server.registerTool(
    "get_install_command",
    {
      title: "Get install command",
      description: "Get the shadcn CLI install command for an easeUI component, for a given package manager.",
      inputSchema: z.object({
        slug: z.string().describe("Component slug, e.g. 'command-palette'."),
        packageManager: z.enum(["bun", "npm", "pnpm", "yarn"]).default("bun").describe("Package manager. Defaults to bun."),
      }),
    },
    async ({ slug, packageManager }) => {
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              {
                slug,
                packageManager,
                command: directInstallCommand(slug, packageManager),
                command_via_namespace: `${installCommand(slug, packageManager)} (only once @easeui is registered with shadcn's directory)`,
                all: PACKAGE_MANAGERS.map((pm) => ({ packageManager: pm, command: directInstallCommand(slug, pm) })),
              },
              null,
              2,
            ),
          },
        ],
      };
    },
  );
});

export { handler as GET, handler as POST };

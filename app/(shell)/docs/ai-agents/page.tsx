import type { Metadata } from "next";
import type { ReactNode } from "react";
import { CodeBlock } from "@/components/app/docs/code-block";
import { SITE_URL } from "@/lib/site";

const TITLE = "Agent guide";
const DESCRIPTION =
  "Install the easeUI agent skill, connect the MCP server, or consume the agent-friendly registry endpoints directly.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/docs/ai-agents" },
  openGraph: {
    title: `${TITLE} · easeUI`,
    description: DESCRIPTION,
    url: "/docs/ai-agents",
    type: "article",
    siteName: "easeUI",
    images: ["/api/og"],
  },
  twitter: {
    card: "summary_large_image",
    title: `${TITLE} · easeUI`,
    images: ["/api/og"],
  },
};

const MCP_CLIENTS = [
  { name: "Claude Code", code: `claude mcp add --transport http easeui ${SITE_URL}/mcp` },
  { name: "Codex", code: `codex mcp add easeui --url ${SITE_URL}/mcp` },
];

const MCP_MANUAL_CONFIG = `{
  "mcpServers": {
    "easeui": {
      "type": "http",
      "url": "${SITE_URL}/mcp"
    }
  }
}`;

const ENDPOINTS: { path: string; purpose: string }[] = [
  { path: "/llms.txt", purpose: "Markdown discovery index" },
  { path: "/r", purpose: "JSON catalogue of every component" },
  { path: "/r/{slug}", purpose: "Component detail with files, dependencies, and source" },
  { path: "/registry.json", purpose: "shadcn directory-compatible catalogue" },
  { path: "/r/{slug}.json", purpose: "shadcn install item with inline file content" },
  { path: "/r/{slug}/raw", purpose: "Copy-ready plain-text source" },
  { path: "/components/{category}/{slug}.md", purpose: "Component documentation as Markdown" },
];

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-5 border-t border-border pt-8">
      <h2 className="text-lg font-semibold tracking-tight text-foreground">{title}</h2>
      {children}
    </section>
  );
}

export default function AiAgentsPage() {
  return (
    <article className="mx-auto flex w-full max-w-4xl flex-col gap-12 pb-8">
      <header className="flex flex-col gap-4">
        <h1 className="font-display text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
          {TITLE}
        </h1>
        <p className="max-w-2xl text-pretty text-muted-foreground">{DESCRIPTION}</p>
      </header>

      <Section title="Agent skill">
        <p className="text-sm leading-6 text-muted-foreground">
          Install the skill when you want coding agents to choose existing easeUI components before
          inventing custom motion widgets.
        </p>
        <CodeBlock code="npx skills add rjcuff/easeui --skill easeui" lang="bash" filename="terminal" />
      </Section>

      <Section title="MCP server">
        <p className="text-sm leading-6 text-muted-foreground">
          Connect the hosted easeUI MCP server at{" "}
          <code className="rounded bg-foreground/5 px-1.5 py-0.5 font-mono text-xs text-foreground">
            {SITE_URL}/mcp
          </code>
          .
        </p>
        <div className="flex flex-col gap-4">
          {MCP_CLIENTS.map((client) => (
            <CodeBlock key={client.name} code={client.code} lang="bash" filename={client.name} />
          ))}
        </div>
        <p className="text-sm leading-6 text-muted-foreground">Manual configuration:</p>
        <CodeBlock code={MCP_MANUAL_CONFIG} lang="json" filename="mcp.json" />
        <p className="text-sm leading-6 text-muted-foreground">
          Available tools: <code className="text-foreground">list_components</code>,{" "}
          <code className="text-foreground">search_components</code>,{" "}
          <code className="text-foreground">get_component</code>, and{" "}
          <code className="text-foreground">get_install_command</code>.
        </p>
      </Section>

      <Section title="Endpoints">
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full min-w-max text-left text-sm">
            <thead>
              <tr className="border-b border-border text-xs uppercase tracking-wide text-muted-foreground">
                <th className="px-4 py-3 font-medium">Endpoint</th>
                <th className="px-4 py-3 font-medium">Purpose</th>
              </tr>
            </thead>
            <tbody>
              {ENDPOINTS.map((endpoint) => (
                <tr key={endpoint.path} className="border-b border-border last:border-0">
                  <td className="px-4 py-3 font-mono text-xs text-foreground">{endpoint.path}</td>
                  <td className="px-4 py-3 text-muted-foreground">{endpoint.purpose}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section title="Agent flow">
        <ol className="flex flex-col gap-2 text-sm leading-6 text-muted-foreground">
          <li>
            1. Fetch{" "}
            <code className="text-foreground">{SITE_URL}/r</code> to discover components.
          </li>
          <li>2. Select the closest item by its published name and description.</li>
          <li>
            3. Fetch <code className="text-foreground">{SITE_URL}/r/{"{slug}"}</code> for source, files, and
            dependencies.
          </li>
          <li>4. Write every returned file to its declared path.</li>
          <li>5. Install the external dependencies from the response.</li>
        </ol>
      </Section>

      <Section title="shadcn flow">
        <CodeBlock
          code={[
            "# Official registry namespace",
            "npx shadcn@latest add @easeui/command-palette",
            "",
            "# Direct registry URL",
            `npx shadcn@latest add ${SITE_URL}/r/command-palette.json`,
          ].join("\n")}
          lang="bash"
          filename="terminal"
        />
      </Section>
    </article>
  );
}

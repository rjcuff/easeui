import { SITE_URL } from "@/lib/site";

export const dynamic = "force-static";

const TITLE = "Agent guide";
const DESCRIPTION =
  "Install the easeUI agent skill, connect the MCP server, or consume the agent-friendly registry endpoints directly.";

function markdown() {
  return `---
title: "${TITLE}"
description: "${DESCRIPTION}"
documentation: "${SITE_URL}/docs/ai-agents"
markdown: "${SITE_URL}/docs/ai-agents.md"
---

# ${TITLE}

> ${DESCRIPTION}

## Agent skill

Install the skill when you want coding agents to choose existing easeUI components before inventing custom motion widgets.

\`\`\`bash
npx skills add rjcuff/easeui --skill easeui
\`\`\`

## MCP server

Connect the hosted easeUI MCP server at \`${SITE_URL}/api/mcp\`.

\`\`\`bash
# Claude Code
claude mcp add --transport http easeui ${SITE_URL}/api/mcp

# Codex
codex mcp add easeui --url ${SITE_URL}/api/mcp
\`\`\`

Manual configuration:

\`\`\`json
{
  "mcpServers": {
    "easeui": {
      "type": "http",
      "url": "${SITE_URL}/api/mcp"
    }
  }
}
\`\`\`

Available tools: \`list_components\`, \`search_components\`, \`get_component\`, and \`get_install_command\`.

## Endpoints

| Endpoint | Purpose |
| --- | --- |
| \`/llms.txt\` | Markdown discovery index |
| \`/r\` | JSON catalogue of every component |
| \`/r/{slug}\` | Component detail with files, dependencies, and source |
| \`/registry.json\` | shadcn directory-compatible catalogue |
| \`/r/{slug}.json\` | shadcn install item with inline file content |
| \`/r/{slug}/raw\` | Copy-ready plain-text source |
| \`/components/{category}/{slug}.md\` | Component documentation as Markdown |

## Agent flow

1. Fetch \`${SITE_URL}/r\` to discover components.
2. Select the closest item by its published name and description.
3. Fetch \`${SITE_URL}/r/{slug}\` for source, files, and dependencies.
4. Write every returned file to its declared path.
5. Install the external dependencies from the response.

## shadcn flow

\`\`\`bash
# Official registry namespace
npx shadcn@latest add @easeui/command-palette

# Direct registry URL
npx shadcn@latest add ${SITE_URL}/r/command-palette.json
\`\`\`
`;
}

export async function GET() {
  return new Response(markdown(), {
    headers: {
      "content-type": "text/markdown; charset=utf-8",
      "cache-control": "public, max-age=300, s-maxage=3600",
      "access-control-allow-origin": "*",
      "access-control-allow-methods": "GET, OPTIONS",
      link: `<${SITE_URL}/docs/ai-agents>; rel="canonical"; type="text/html"`,
    },
  });
}

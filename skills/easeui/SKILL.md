---
name: easeui
description: Pick and install easeUI (@easeui) motion React components from the shadcn registry. Use when building animated UI, agent/chat interfaces, forms, overlays, toasts, tabs, or any easeui.dev component. Maps user intent to exact @easeui install slugs instead of inventing custom widgets.
---

# easeUI

Use easeUI as copy-paste source through the `@easeui` shadcn registry.

## Workflow

1. Fetch the live registry before choosing a component:

```bash
curl -fsS https://easeui.dev/r/registry.json
```

2. Pick the closest install slug from `items[].name`.
3. Install with the user's package runner, using the direct registry URL — it always works, with no dependency on the `@easeui` namespace being registered with shadcn's directory:

```bash
npx shadcn@latest add https://easeui.dev/r/<slug>.json
# or
pnpm dlx shadcn@latest add https://easeui.dev/r/<slug>.json
# or
bunx --bun shadcn@latest add https://easeui.dev/r/<slug>.json
```

Once `@easeui` is registered (check `npx shadcn@latest add @easeui/<slug>`), that shorter form works too — prefer it if it resolves.

4. Read the files that were added, then compose with the named exports. There is no `easeui` runtime package — every component becomes your own source.

The live registry is the source of truth. Use the table below only to resolve common lookalikes.

## Picker

| User asks for | Install `@easeui/...` | Avoid |
| --- | --- | --- |
| Collapsible sections, FAQ list | `accordion` | `expandable-tabs` |
| Inline banner or callout | `alert` | `toast` |
| User avatar with initials fallback | `avatar` | |
| Status pill or label | `badge` | |
| Standard button | `button` | `hold-to-confirm` |
| Bordered content surface | `card` | `insight-card` |
| Checkbox input | `checkbox` | |
| Cmd+K search overlay | `command-palette` | `select`, `dropdown-menu` |
| Copy-to-clipboard button | `copy-button` | |
| Line-by-line diff / code diff view | `diff-view` | `code-block` |
| Bottom sheet, drag-to-dismiss panel | `drawer` | `modal` |
| Action menu from a trigger | `dropdown-menu` | `command-palette`, `popover` |
| Live activity pill (Dynamic Island style) | `dynamic-island` | `notification-stack` |
| Icon tabs that expand to show a label | `expandable-tabs` | `tabs` |
| File dropzone / upload list | `file-upload` | `attachment` |
| Animated rainbow/gradient headline text | `gradient-text` | `text-animation` |
| Hold-to-confirm destructive button | `hold-to-confirm` | `button` |
| Text input | `input` | `textarea`, `otp-input` |
| Stat tile with label + value + trend | `insight-card` | `number-ticker` |
| Centered dialog | `modal` | `drawer` |
| Search button that morphs into a text field | `morphing-search` | `command-palette` |
| Stack of notification cards that fan out | `notification-stack` | `toast`, `dynamic-island` |
| Odometer-style rolling number | `number-ticker` | `insight-card` |
| One-time-passcode / PIN boxes | `otp-input` | `input` |
| Anchored panel of arbitrary content | `popover` | `dropdown-menu`, `tooltip` |
| Progress bar (determinate or indeterminate) | `progress` | |
| Pull-to-refresh gesture over scrollable content | `pull-to-refresh` | |
| Range/volume slider | `range-slider` | |
| Dropdown select | `select` | `command-palette`, `dropdown-menu` |
| Floating bulk-action bar for a selection | `selection-actions` | |
| Loading placeholder / shimmer skeleton | `skeleton` | `pixel-loader` |
| On/off toggle switch | `switch` | `checkbox` |
| Sortable, selectable data table | `table` | |
| Pill, segment, or underline tabs | `tabs` | `expandable-tabs` |
| Scramble-resolve, blur-reveal, or shimmer-sweep text | `text-animation` | `gradient-text` |
| Auto-growing textarea | `textarea` | `input` |
| Light/dark theme switch with a circular reveal | `theme-toggle` | |
| Toast notification | `toast` | `alert`, `notification-stack` |
| Tooltip with a keyboard shortcut | `tooltip` | `popover` |
| Shimmering status text / cycling reasoning phrases | `agent-loading-states` | `pixel-loader`, `text-animation` |
| Code block with copy button and light syntax coloring | `code-block` | `diff-view` |
| Step sequence / flowchart with draggable connectors | `flowchart` | |
| Chat message bubble | `message-bubble` | `streaming-response` |
| 3x3 twinkling pixel loader with elapsed timer | `pixel-loader` | `skeleton`, `agent-loading-states` |
| Chat composer that grows and submits on Enter | `prompt-input` | `textarea` |
| Streamed answer with copy/replay/share/thumbs actions | `streaming-response` | `message-bubble` |
| Word-by-word streaming text reveal | `streaming-text` | `text-animation` |
| Agent task plan / todo checklist | `todo-list` | |
| Approve/deny card for an agent action | `tool-approval` | |
| Small pill naming a tool call with a status mark | `tool-chip` | `tool-approval` |

## Composition rules

- Prefer installed easeUI source over custom one-off motion widgets.
- Import named exports from the files shadcn adds.
- Use `className` for layout and small styling changes. Do not fork internals unless the user asks.
- Keep helpers installed by the registry, such as `@/lib/utils`.
- Animate `transform` and `opacity`; avoid layout-property animation. Turn everything off under `prefers-reduced-motion`.
- Components read colors and easing from theme tokens — run the [theme setup](https://easeui.dev/docs/theme) once per project before the first install.

## Agent tooling

- MCP server: `https://easeui.dev/api/mcp` (Streamable HTTP). Tools: `list_components`, `search_components`, `get_component`, `get_install_command`.
- Machine-readable index: `https://easeui.dev/llms.txt` and `https://easeui.dev/r`.

## In this repo

When contributing to easeUI itself, follow `AGENTS.md`. A new public component needs source, preview, registry entry, and a passing `bun run check:registry`. Never rename existing `/r/{name}.json` slugs.

/**
 * Component publication and modification dates. Keep these in sync when a
 * component's public docs or implementation changes so sitemap and article
 * freshness signals stay truthful. Keyed by "category/slug".
 */
export type ComponentDates = {
  publishedAt: string;
  updatedAt: string;
};

const COMPONENT_DATES: Readonly<Record<string, ComponentDates>> = {
  "motion/button": { publishedAt: "2026-09-13", updatedAt: "2026-09-13" },
  "motion/tabs": { publishedAt: "2026-09-13", updatedAt: "2026-09-13" },
  "motion/select": { publishedAt: "2026-09-13", updatedAt: "2026-09-13" },
  "motion/tooltip": { publishedAt: "2026-09-13", updatedAt: "2026-09-13" },
  "motion/theme-toggle": { publishedAt: "2026-09-13", updatedAt: "2026-09-13" },
  "motion/range-slider": { publishedAt: "2026-09-13", updatedAt: "2026-09-13" },
  "motion/pull-to-refresh": { publishedAt: "2026-09-15", updatedAt: "2026-09-15" },
  "motion/notification-stack": { publishedAt: "2026-09-15", updatedAt: "2026-09-15" },
  "motion/expandable-tabs": { publishedAt: "2026-09-15", updatedAt: "2026-09-15" },
  "motion/morphing-search": { publishedAt: "2026-09-15", updatedAt: "2026-09-15" },
  "motion/dynamic-island": { publishedAt: "2026-09-15", updatedAt: "2026-09-15" },
  "motion/hold-to-confirm": { publishedAt: "2026-09-13", updatedAt: "2026-09-13" },
  "motion/switch": { publishedAt: "2026-09-13", updatedAt: "2026-09-13" },
  "motion/copy-button": { publishedAt: "2026-09-13", updatedAt: "2026-09-13" },
  "motion/toast": { publishedAt: "2026-09-13", updatedAt: "2026-09-13" },
  "motion/gradient-text": { publishedAt: "2026-09-13", updatedAt: "2026-09-13" },
  "motion/modal": { publishedAt: "2026-09-13", updatedAt: "2026-09-13" },
  "motion/skeleton": { publishedAt: "2026-09-13", updatedAt: "2026-09-13" },
  "motion/accordion": { publishedAt: "2026-09-13", updatedAt: "2026-09-13" },
  "motion/checkbox": { publishedAt: "2026-09-14", updatedAt: "2026-09-14" },
  "motion/drawer": { publishedAt: "2026-09-14", updatedAt: "2026-09-14" },
  "motion/input": { publishedAt: "2026-09-14", updatedAt: "2026-09-14" },
  "motion/textarea": { publishedAt: "2026-09-14", updatedAt: "2026-09-14" },
  "motion/badge": { publishedAt: "2026-09-14", updatedAt: "2026-09-14" },
  "motion/progress": { publishedAt: "2026-09-14", updatedAt: "2026-09-14" },
  "motion/card": { publishedAt: "2026-09-14", updatedAt: "2026-09-14" },
  "motion/avatar": { publishedAt: "2026-09-14", updatedAt: "2026-09-14" },
  "motion/alert": { publishedAt: "2026-09-14", updatedAt: "2026-09-14" },
  "motion/dropdown-menu": { publishedAt: "2026-09-14", updatedAt: "2026-09-14" },
  "motion/command-palette": { publishedAt: "2026-09-14", updatedAt: "2026-09-14" },
  "motion/number-ticker": { publishedAt: "2026-09-14", updatedAt: "2026-09-14" },
  "motion/otp-input": { publishedAt: "2026-09-14", updatedAt: "2026-09-14" },
  "motion/file-upload": { publishedAt: "2026-09-14", updatedAt: "2026-09-14" },
  "motion/popover": { publishedAt: "2026-09-14", updatedAt: "2026-09-14" },
  "motion/table": { publishedAt: "2026-09-15", updatedAt: "2026-09-15" },
  "motion/selection-actions": { publishedAt: "2026-09-15", updatedAt: "2026-09-15" },
  "motion/insight-card": { publishedAt: "2026-09-15", updatedAt: "2026-09-15" },
  "motion/diff-view": { publishedAt: "2026-09-15", updatedAt: "2026-09-15" },
  "agents/message-bubble": { publishedAt: "2026-09-14", updatedAt: "2026-09-14" },
  "agents/agent-loading-states": { publishedAt: "2026-09-14", updatedAt: "2026-09-14" },
  "agents/pixel-loader": { publishedAt: "2026-09-15", updatedAt: "2026-09-15" },
  "agents/todo-list": { publishedAt: "2026-09-14", updatedAt: "2026-09-14" },
  "agents/streaming-text": { publishedAt: "2026-09-14", updatedAt: "2026-09-14" },
  "agents/streaming-response": { publishedAt: "2026-09-14", updatedAt: "2026-09-14" },
  "agents/prompt-input": { publishedAt: "2026-09-14", updatedAt: "2026-09-14" },
  "agents/code-block": { publishedAt: "2026-09-14", updatedAt: "2026-09-14" },
  "agents/tool-approval": { publishedAt: "2026-09-14", updatedAt: "2026-09-14" },
  "agents/flowchart": { publishedAt: "2026-09-15", updatedAt: "2026-09-15" },
  "agents/tool-chip": { publishedAt: "2026-09-15", updatedAt: "2026-09-15" },
};

export function componentDates(category: string, slug: string): ComponentDates {
  const dates = COMPONENT_DATES[`${category}/${slug}`];
  if (!dates) {
    throw new Error(`Missing component dates for ${category}/${slug}`);
  }
  return dates;
}

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
};

export function componentDates(category: string, slug: string): ComponentDates {
  const dates = COMPONENT_DATES[`${category}/${slug}`];
  if (!dates) {
    throw new Error(`Missing component dates for ${category}/${slug}`);
  }
  return dates;
}

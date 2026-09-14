import type { AgentGuide } from "@/lib/agent-guides";

export type ComponentExample = {
  slug: string;
  name: string;
  description?: string;
  badge?: "new";
  /** ISO date this variant shipped. */
  launchedAt?: string;
  /** Optional install slug for variants that have their own registry command. */
  installSlug?: string;
  /** Source file shown under Source tab. */
  file: string;
  /** Key into the previews registry (e.g. "motion/button-base"). */
  previewKey: string;
  /** Path to the preview file used for the Usage tab. */
  previewFile: string;
  /** Optional composition file shown instead of the live preview source. */
  usageFile?: string;
};

export type ComponentEntry = {
  slug: string;
  name: string;
  description: string;
  file: string;
  badge?: "new";
  /** ISO date the component shipped. Set it when adding a "new" component. */
  launchedAt?: string;
  /** Optional hand-tuned SEO keywords, merged on top of generated ones. */
  keywords?: string[];
  /** Extra source files bundled under this slug (e.g. multi-file components). */
  extraFiles?: string[];
  /** Optional composition file shown instead of the live preview source. */
  usageFile?: string;
  /** Per-variant breakdown rendered as separate Preview / Usage / Source on the page. */
  examples?: ComponentExample[];
  /** Optional contributor credit shown on the website only. */
  credit?: {
    name: string;
    url: string;
  };
  /** Optional behavior guide rendered on the component documentation page. */
  guide?: AgentGuide;
};

export type CategoryEntry = {
  slug: string;
  name: string;
  description: string;
  components: ComponentEntry[];
};

/**
 * The easeUI catalog. Add a category here, then its components. Every
 * component also needs an entry in lib/component-dates.ts.
 */
export const registry: CategoryEntry[] = [
  {
    slug: "motion",
    name: "Components",
    description:
      "Animated React components with quick, simple motion. Add any of them to your project with the shadcn CLI.",
    components: [
      {
        slug: "button",
        name: "Button",
        description:
          "Button with a quick press, hairline rings instead of borders, four variants, and a 44px tap area even at small sizes.",
        file: "components/motion/button.tsx",
        badge: "new",
        launchedAt: "2026-09-13",
        keywords: ["react button", "animated button", "press animation"],
      },
      {
        slug: "tabs",
        name: "Tabs",
        description:
          "Pill, segment, or underline tabs with an indicator that slides to the selected tab.",
        file: "components/motion/tabs.tsx",
        badge: "new",
        launchedAt: "2026-09-13",
        keywords: ["react tabs", "animated tabs", "tab indicator"],
      },
      {
        slug: "select",
        name: "Select",
        description:
          "Composable select whose menu fades and scales out of the trigger, and opens upward when there is no room below.",
        file: "components/motion/select.tsx",
        badge: "new",
        launchedAt: "2026-09-13",
        keywords: ["react select", "animated select", "dropdown"],
      },
      {
        slug: "tooltip",
        name: "Tooltip",
        description:
          "Hover or focus tooltip that fades in beside its trigger. After the first one opens, nearby tooltips appear without a delay.",
        file: "components/motion/tooltip.tsx",
        badge: "new",
        launchedAt: "2026-09-13",
        keywords: ["react tooltip", "animated tooltip"],
      },
      {
        slug: "theme-toggle",
        name: "Theme Toggle",
        description:
          "Light and dark switch that reveals the new theme as a circle growing from the center of the screen or from the button itself.",
        file: "components/motion/theme-toggle.tsx",
        badge: "new",
        launchedAt: "2026-09-13",
        keywords: ["theme toggle", "dark mode toggle", "view transition"],
      },
      {
        slug: "range-slider",
        name: "Range Slider",
        description:
          "Native range input with a filled track and tick dots, so keyboard and screen reader support come built in.",
        file: "components/motion/range-slider.tsx",
        badge: "new",
        launchedAt: "2026-09-13",
        keywords: ["react slider", "range slider", "stepped slider"],
      },
    ],
  },
];

export function findCategory(slug: string): CategoryEntry | undefined {
  return registry.find((c) => c.slug === slug);
}

export function findComponent(
  categorySlug: string,
  slug: string,
): ComponentEntry | undefined {
  return findCategory(categorySlug)?.components.find((c) => c.slug === slug);
}

export function allComponents(): (ComponentEntry & { category: CategoryEntry })[] {
  return registry.flatMap((c) =>
    c.components.map((comp) => ({ ...comp, category: c })),
  );
}

/** Top-level components and total installable targets (counting variants). */
export const COMPONENT_COUNT = registry.reduce(
  (n, c) => n + c.components.length,
  0,
);

export const INSTALLABLE_COUNT = registry.reduce(
  (n, c) =>
    n +
    c.components.reduce((m, comp) => {
      const variants = (comp.examples ?? []).filter((e) => e.installSlug).length;
      return m + (variants || 1);
    }, 0),
  0,
);

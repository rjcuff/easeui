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
 *
 * Unlike `registry` below, this keeps shipping order, for breaking same-day
 * ties (e.g. picking the newest few to feature).
 */
export const catalog: CategoryEntry[] = [
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
        launchedAt: "2026-09-13",
        keywords: ["react button", "animated button", "press animation"],
      },
      {
        slug: "tabs",
        name: "Tabs",
        description:
          "Pill, segment, or underline tabs with an indicator that slides to the selected tab.",
        file: "components/motion/tabs.tsx",
        launchedAt: "2026-09-13",
        keywords: ["react tabs", "animated tabs", "tab indicator"],
      },
      {
        slug: "select",
        name: "Select",
        description:
          "Composable select whose menu fades and scales out of the trigger, and opens upward when there is no room below.",
        file: "components/motion/select.tsx",
        launchedAt: "2026-09-13",
        keywords: ["react select", "animated select", "dropdown"],
      },
      {
        slug: "tooltip",
        name: "Tooltip",
        description:
          "Tooltip that shows a label with its keyboard shortcut, using Command on Mac and Ctrl elsewhere. Moving along a toolbar crossfades to the next tooltip with no delay.",
        file: "components/motion/tooltip.tsx",
        launchedAt: "2026-09-13",
        keywords: ["react tooltip", "keyboard shortcut tooltip", "toolbar tooltip"],
      },
      {
        slug: "theme-toggle",
        name: "Theme Toggle",
        description:
          "Light and dark switch that reveals the new theme as a circle growing from the center of the screen or from the button itself.",
        file: "components/motion/theme-toggle.tsx",
        launchedAt: "2026-09-13",
        keywords: ["theme toggle", "dark mode toggle", "view transition"],
      },
      {
        slug: "range-slider",
        name: "Range Slider",
        description:
          "Native range input with a filled track and tick dots, so keyboard and screen reader support come built in.",
        file: "components/motion/range-slider.tsx",
        launchedAt: "2026-09-13",
        keywords: ["react slider", "range slider", "stepped slider"],
      },
      {
        slug: "hold-to-confirm",
        name: "Hold to Confirm",
        description:
          "Button for destructive actions that fills while you hold it and only fires once the fill completes. Letting go early drains it back quickly.",
        file: "components/motion/hold-to-confirm.tsx",
        launchedAt: "2026-09-13",
        keywords: ["hold to confirm", "hold to delete", "press and hold button"],
      },
      {
        slug: "switch",
        name: "Switch",
        description:
          "On and off switch with a quick slide and no bounce. Inside a label, the whole row is the tap target.",
        file: "components/motion/switch.tsx",
        launchedAt: "2026-09-13",
        keywords: ["react switch", "toggle switch", "accessible switch"],
      },
      {
        slug: "copy-button",
        name: "Copy Button",
        description:
          "Copies text to the clipboard and trades its icon for a check for a moment, with a label or as a single icon.",
        file: "components/motion/copy-button.tsx",
        launchedAt: "2026-09-13",
        keywords: ["copy button", "copy to clipboard", "react clipboard"],
      },
      {
        slug: "toast",
        name: "Toast",
        description:
          "Toasts that stay long enough to read based on their word count, and pause while hovered or while the tab is in the background.",
        file: "components/motion/toast.tsx",
        launchedAt: "2026-09-13",
        keywords: ["react toast", "notification", "toaster"],
      },
      {
        slug: "gradient-text",
        name: "Gradient Text",
        description:
          "Text filled with a slowly drifting rainbow. It pauses while off screen and holds still when reduced motion is on.",
        file: "components/motion/gradient-text.tsx",
        launchedAt: "2026-09-13",
        keywords: ["gradient text", "rainbow text", "animated gradient"],
      },
      {
        slug: "modal",
        name: "Modal",
        description:
          "Centered dialog on the native dialog element that fades and scales in, leaves faster than it arrives, and keeps focus inside while open.",
        file: "components/motion/modal.tsx",
        launchedAt: "2026-09-13",
        keywords: ["react modal", "dialog", "animated modal"],
      },
      {
        slug: "skeleton",
        name: "Skeleton",
        description:
          "Loading placeholder with one shimmer shared across the page. Wrap real content and it takes the same shape, then crossfades away.",
        file: "components/motion/skeleton.tsx",
        launchedAt: "2026-09-13",
        keywords: ["skeleton loader", "loading placeholder", "shimmer"],
      },
      {
        slug: "accordion",
        name: "Accordion",
        description:
          "Expanding sections that grow to their natural height with no measuring, with arrow key navigation and closed panels skipped by Tab.",
        file: "components/motion/accordion.tsx",
        launchedAt: "2026-09-13",
        keywords: ["react accordion", "collapsible", "faq"],
      },
      {
        slug: "checkbox",
        name: "Checkbox",
        description:
          "Checkbox on a real checkbox input, with a check mark that pops in rather than just appearing.",
        file: "components/motion/checkbox.tsx",
        badge: "new",
        launchedAt: "2026-09-14",
        keywords: ["react checkbox", "animated checkbox", "accessible checkbox"],
      },
      {
        slug: "drawer",
        name: "Drawer",
        description:
          "Sheet that slides up from the bottom edge on the native dialog element. Drag the handle down, or flick it, to dismiss.",
        file: "components/motion/drawer.tsx",
        badge: "new",
        launchedAt: "2026-09-14",
        keywords: ["react drawer", "bottom sheet", "swipe to dismiss"],
      },
    ],
  },
];

/** The catalog with each category's components in alphabetical order, as every list on the site shows them. */
export const registry: CategoryEntry[] = catalog.map((category) => ({
  ...category,
  components: [...category.components].sort((a, b) => a.name.localeCompare(b.name)),
}));

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

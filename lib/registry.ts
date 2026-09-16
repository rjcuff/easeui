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
        slug: "pull-to-refresh",
        name: "Pull to Refresh",
        description:
          "A pull-down gesture over scrollable content: the indicator tracks the finger 1:1, then resists past the trigger distance and spins while refreshing.",
        file: "components/motion/pull-to-refresh.tsx",
        badge: "new",
        launchedAt: "2026-09-15",
        keywords: ["pull to refresh", "gesture", "mobile refresh", "swipe down"],
      },
      {
        slug: "notification-stack",
        name: "Notification Stack",
        description:
          "A deck of notification cards: collapsed to the top card with peeking edges behind it, fanning into a readable list on hover or focus.",
        file: "components/motion/notification-stack.tsx",
        badge: "new",
        launchedAt: "2026-09-15",
        keywords: ["notification stack", "card stack", "notification center"],
      },
      {
        slug: "expandable-tabs",
        name: "Expandable Tabs",
        description:
          "A row of icon tabs where the selected one expands to reveal its label, sliding a shared background pill to match.",
        file: "components/motion/expandable-tabs.tsx",
        badge: "new",
        launchedAt: "2026-09-15",
        keywords: ["expandable tabs", "icon tabs", "segmented control"],
      },
      {
        slug: "morphing-search",
        name: "Morphing Search",
        description:
          "A circular search button that morphs into a text field: the same element grows and reshapes via a layout animation, rather than a new one popping in beside it.",
        file: "components/motion/morphing-search.tsx",
        badge: "new",
        launchedAt: "2026-09-15",
        keywords: ["morphing search", "expanding search", "search bar animation"],
      },
      {
        slug: "dynamic-island",
        name: "Dynamic Island",
        description:
          "A pill that morphs between a compact status line and any number of named live-activity views, the same element reshaping via layout animation each time.",
        file: "components/motion/dynamic-island.tsx",
        badge: "new",
        launchedAt: "2026-09-15",
        keywords: ["dynamic island", "morphing pill", "status pill"],
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
        launchedAt: "2026-09-14",
        keywords: ["react checkbox", "animated checkbox", "accessible checkbox"],
      },
      {
        slug: "drawer",
        name: "Drawer",
        description:
          "Sheet that slides up from the bottom edge on the native dialog element. Drag the handle down, or flick it, to dismiss.",
        file: "components/motion/drawer.tsx",
        launchedAt: "2026-09-14",
        keywords: ["react drawer", "bottom sheet", "swipe to dismiss"],
      },
      {
        slug: "input",
        name: "Input",
        description:
          "Text input whose focus ring grows from a hairline to two px, with a destructive ring for aria-invalid.",
        file: "components/motion/input.tsx",
        launchedAt: "2026-09-14",
        keywords: ["react input", "text field", "form input"],
      },
      {
        slug: "textarea",
        name: "Textarea",
        description:
          "Textarea that grows with its content instead of scrolling, down to three rows and up to a scrollable cap.",
        file: "components/motion/textarea.tsx",
        launchedAt: "2026-09-14",
        keywords: ["react textarea", "auto grow textarea", "form textarea"],
      },
      {
        slug: "badge",
        name: "Badge",
        description:
          "Small status pill in five colors, with a crossfade for when its variant changes.",
        file: "components/motion/badge.tsx",
        launchedAt: "2026-09-14",
        keywords: ["react badge", "status pill", "tag"],
      },
      {
        slug: "progress",
        name: "Progress",
        description:
          "Progress bar that fills with scale instead of width, plus an indeterminate state for unknown durations.",
        file: "components/motion/progress.tsx",
        launchedAt: "2026-09-14",
        keywords: ["react progress bar", "loading bar", "indeterminate progress"],
      },
      {
        slug: "card",
        name: "Card",
        description:
          "Bordered surface with header, content, and footer parts for grouping related content.",
        file: "components/motion/card.tsx",
        launchedAt: "2026-09-14",
        keywords: ["react card", "card component", "content card"],
      },
      {
        slug: "avatar",
        name: "Avatar",
        description:
          "Round avatar whose image fades in on load and crossfades to initials if it fails.",
        file: "components/motion/avatar.tsx",
        launchedAt: "2026-09-14",
        keywords: ["react avatar", "profile picture", "initials fallback"],
      },
      {
        slug: "alert",
        name: "Alert",
        description:
          "Banner with a colored accent stripe. Body text stays neutral so contrast never depends on the variant.",
        file: "components/motion/alert.tsx",
        launchedAt: "2026-09-14",
        keywords: ["react alert", "banner", "callout"],
      },
      {
        slug: "dropdown-menu",
        name: "Dropdown Menu",
        description:
          "Action menu that opens from a trigger, flips upward when there is no room below, and supports a destructive item.",
        file: "components/motion/dropdown-menu.tsx",
        launchedAt: "2026-09-14",
        keywords: ["react dropdown menu", "context menu", "action menu"],
      },
      {
        slug: "command-palette",
        name: "Command Palette",
        description:
          "Command-K style search overlay that filters as you type, with arrow keys to move the highlight and Enter to select.",
        file: "components/motion/command-palette.tsx",
        launchedAt: "2026-09-14",
        keywords: ["command palette", "cmdk", "search overlay"],
      },
      {
        slug: "number-ticker",
        name: "Number Ticker",
        description:
          "Number that rolls to a new value like an odometer, one changed digit at a time.",
        file: "components/motion/number-ticker.tsx",
        launchedAt: "2026-09-14",
        keywords: ["animated counter", "odometer", "number roll"],
      },
      {
        slug: "otp-input",
        name: "OTP Input",
        description:
          "One box per digit for a verification code, with paste and SMS autofill support and a shake for a wrong code.",
        file: "components/motion/otp-input.tsx",
        launchedAt: "2026-09-14",
        keywords: ["otp input", "pin input", "verification code"],
      },
      {
        slug: "file-upload",
        name: "File Upload",
        description:
          "Dropzone that also opens the native file picker, with a list below it that pops each file in and collapses smoothly on remove.",
        file: "components/motion/file-upload.tsx",
        launchedAt: "2026-09-14",
        keywords: ["file upload", "dropzone", "drag and drop"],
      },
      {
        slug: "popover",
        name: "Popover",
        description:
          "A panel of arbitrary content anchored to a trigger, opening on click and flipping above it when there's no room below.",
        file: "components/motion/popover.tsx",
        launchedAt: "2026-09-14",
        keywords: ["react popover", "anchored panel", "click to open"],
      },
      {
        slug: "table",
        name: "Table",
        description:
          "A plain, composable data table: sortable headers with an arrow that only shows on hover until active, and rows that tint when selected.",
        file: "components/motion/table.tsx",
        badge: "new",
        launchedAt: "2026-09-15",
        keywords: ["react table", "data table", "sortable table"],
      },
      {
        slug: "selection-actions",
        name: "Selection Actions",
        description:
          "A floating bar of bulk actions that fades and rises in once a selection leaves zero, for pairing with Table or any selectable list.",
        file: "components/motion/selection-actions.tsx",
        badge: "new",
        launchedAt: "2026-09-15",
        keywords: ["bulk actions", "selection toolbar", "floating action bar"],
      },
      {
        slug: "insight-card",
        name: "Insight Card",
        description:
          "A stat tile: a label, a headline value, and an optional trend pill. Pass a Number Ticker as the value to have it roll in on change.",
        file: "components/motion/insight-card.tsx",
        badge: "new",
        launchedAt: "2026-09-15",
        keywords: ["stat card", "metric tile", "kpi card"],
      },
      {
        slug: "diff-view",
        name: "Diff View",
        description:
          "A line-by-line diff with an added or removed mark in the gutter and a tinted row for each side. Renders a diff, doesn't compute one.",
        file: "components/motion/diff-view.tsx",
        badge: "new",
        launchedAt: "2026-09-15",
        keywords: ["diff view", "code diff", "line diff"],
      },
    ],
  },
  {
    slug: "agents",
    name: "Agents",
    description:
      "React components for AI interfaces, covering conversations, streaming answers, progress, and tool activity.",
    components: [
      {
        slug: "message-bubble",
        name: "Message Bubble",
        description:
          "A focused conversational surface with visual tones, independent alignment, and a speech-bubble tail that pops in on arrival.",
        file: "components/motion/message-bubble.tsx",
        launchedAt: "2026-09-14",
        keywords: ["chat bubble", "message bubble", "conversation ui"],
      },
      {
        slug: "agent-loading-states",
        name: "Agent Loading States",
        description:
          "Three loading states for AI interfaces: shimmering status text, live agent progress, and cycling reasoning phrases.",
        file: "components/motion/agent-loading-states.tsx",
        launchedAt: "2026-09-14",
        keywords: ["ai loading state", "shimmer text", "agent progress"],
      },
      {
        slug: "pixel-loader",
        name: "Pixel Loader",
        description:
          "A 3x3 grid of cells that twinkle on independent, randomized cycles, paired with a shimmering label and an optional live elapsed timer.",
        file: "components/motion/pixel-loader.tsx",
        badge: "new",
        launchedAt: "2026-09-15",
        keywords: ["pixel loader", "grid loader", "elapsed timer"],
      },
      {
        slug: "todo-list",
        name: "Todo List",
        description:
          "A collapsible agent task plan with morphing status marks and a completion count.",
        file: "components/motion/todo-list.tsx",
        launchedAt: "2026-09-14",
        keywords: ["agent task list", "todo list", "task plan"],
      },
      {
        slug: "streaming-text",
        name: "Streaming Text",
        description:
          "Reveals a model response as it streams in, fading each newly arrived word in on its own without replaying what's already on screen.",
        file: "components/motion/streaming-text.tsx",
        launchedAt: "2026-09-14",
        keywords: ["streaming text", "ai response", "typewriter effect"],
      },
      {
        slug: "streaming-response",
        name: "Streaming Response",
        description:
          "Wraps a response with the actions people expect once it settles: copy, replay, share, and a thumbs up or down. No card or border, so the answer reads as part of the page.",
        file: "components/motion/streaming-response.tsx",
        launchedAt: "2026-09-14",
        keywords: ["ai response actions", "copy retry feedback", "chat response toolbar"],
      },
      {
        slug: "prompt-input",
        name: "Prompt Input",
        description:
          "A chat composer that grows with its content, submits on Enter, and crossfades its send button into a stop button while a reply streams.",
        file: "components/motion/prompt-input.tsx",
        launchedAt: "2026-09-14",
        keywords: ["chat input", "prompt input", "message composer"],
      },
      {
        slug: "code-block",
        name: "Code Block",
        description:
          "A code block with a label, a copy button, and light coloring for keywords, strings, comments and numbers, with no highlighter dependency.",
        file: "components/motion/code-block.tsx",
        launchedAt: "2026-09-14",
        keywords: ["code block", "syntax highlighting", "copy code"],
      },
      {
        slug: "tool-approval",
        name: "Tool Approval",
        description:
          "A card for an agent action waiting on approval, with Approve and Deny that collapse into a single status pill once resolved.",
        file: "components/motion/tool-approval.tsx",
        launchedAt: "2026-09-14",
        keywords: ["tool approval", "agent permission", "approve deny"],
      },
      {
        slug: "flowchart",
        name: "Flowchart",
        description:
          "A sequence of steps on a dotted canvas, connected by curves that measure the actual cards and follow as you drag one. Click a step to light up its connectors, or edit an if/else step's chips with real dropdowns.",
        file: "components/motion/flowchart.tsx",
        badge: "new",
        launchedAt: "2026-09-15",
        keywords: ["agent workflow", "flowchart", "node canvas", "if else", "condition"],
      },
      {
        slug: "tool-chip",
        name: "Tool Chip",
        description:
          "A small pill naming a tool an agent used, with a spinner, check, or error mark that crossfades in place as its status changes.",
        file: "components/motion/tool-chip.tsx",
        badge: "new",
        launchedAt: "2026-09-15",
        keywords: ["tool chip", "agent tool", "tool call status"],
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

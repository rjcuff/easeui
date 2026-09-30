/**
 * Free components that have a fuller take in easeUI Pro. Only real matches are listed, so the
 * Pro card shows up where it helps and nowhere else. Keyed by "category/slug".
 */
export type ProMatch = { name: string; path: string; pitch: string };

export const PRO_MATCHES: Readonly<Record<string, ProMatch>> = {
  "agents/tool-approval": {
    name: "Tool Call",
    path: "/components/tool-call",
    pitch: "A card for every tool an agent runs, with a live timer and folding input and output, plus an approval prompt that folds into a record.",
  },
  "agents/tool-chip": {
    name: "Tool Call",
    path: "/components/tool-call",
    pitch: "The full card behind the chip. A live timer, the input and output folded underneath, and an approval step.",
  },
  "agents/prompt-input": {
    name: "Model Picker",
    path: "/components/model-picker",
    pitch: "Let people pick the model they're talking to, with each provider's real logo, what it's good at and its context window.",
  },
  "agents/streaming-response": {
    name: "Streaming Message",
    path: "/components/streaming-message",
    pitch: "Markdown that streams in word by word, with code blocks you can copy and actions that wait until the answer is done.",
  },
  "agents/streaming-text": {
    name: "Streaming Message",
    path: "/components/streaming-message",
    pitch: "Full chat markdown as it streams, with lists, inline code and code blocks that land with their own copy button.",
  },
  "agents/agent-loading-states": {
    name: "Thinking Orb",
    path: "/components/thinking-orb",
    pitch: "Dot orbs that show what an agent is doing, thinking, searching, writing or listening, each with its own motion.",
  },
  "agents/pixel-loader": {
    name: "Thinking Loader",
    path: "/components/thinking-loader",
    pitch: "Twinkling pixel loaders laid out as a grid, a diamond or a triangle, for the moment an agent is working.",
  },
  "agents/todo-list": {
    name: "Agent Timeline",
    path: "/components/agent-timeline",
    pitch: "The record of an agent run, with a status and a duration on every step, each folding out to show its detail.",
  },
  "agents/message-bubble": {
    name: "AI Chat App template",
    path: "/templates/ai-chat",
    pitch: "A whole chat app built from these pieces. Projects, a model picker, streaming, tool calls and approvals, ready to deploy.",
  },
  "motion/diff-view": {
    name: "Diff Review",
    path: "/components/diff-review",
    pitch: "An agent's edit as a diff to accept or reject, with both line numbers and counts of added and removed lines.",
  },
  "motion/number-ticker": {
    name: "Number Ticker",
    path: "/components/number-ticker",
    pitch: "Two more ways to move a number. One counts up when it comes into view, the other rolls its digits like an odometer.",
  },
  "motion/hold-to-confirm": {
    name: "Hold Button",
    path: "/components/hold-button",
    pitch: "A hold to confirm button in two tones, with a fill that grows behind the label and drains back if you let go.",
  },
  "motion/insight-card": {
    name: "KPI Card",
    path: "/components/kpi-card",
    pitch: "Three KPI cards with sparklines, a split comparison and a progress target, built for dashboards.",
  },
  "motion/progress": {
    name: "Usage Meter",
    path: "/components/usage-meter",
    pitch: "A segmented usage bar with an upgrade prompt, and a budget meter whose bars fill as spending changes.",
  },
  "motion/table": {
    name: "Data Table",
    path: "/components/data-table",
    pitch: "Search, category chips, sorting and bulk actions, collapsing into cards on a phone.",
  },
  "motion/dropdown-menu": {
    name: "Action Menu",
    path: "/components/action-menu",
    pitch: "A menu with icons, shortcuts, a toggle item and a destructive action, that springs open from its trigger.",
  },
  "motion/tooltip": {
    name: "Elastic Tooltip",
    path: "/components/elastic-tooltip",
    pitch: "A tooltip that springs out of its trigger and flips sides when it runs out of room.",
  },
  "motion/card": {
    name: "Cards",
    path: "/components/cards",
    pitch: "Balance, profile, invite and folder cards, each a small complete surface with its own motion.",
  },
  "motion/text-animation": {
    name: "Text Animations",
    path: "/components/text-animations",
    pitch: "A color sweep reveal, a hand drawn marker highlight and split flap letters like an airport board.",
  },
  "motion/gradient-text": {
    name: "Text Animations",
    path: "/components/text-animations",
    pitch: "A color band that sweeps across a headline once, a marker highlight and split flap letters.",
  },
};

export function findProMatch(category: string, slug: string): ProMatch | undefined {
  return PRO_MATCHES[`${category}/${slug}`];
}

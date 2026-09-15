import {
  AgentProgress,
  ReasoningPhases,
  ShimmerText,
  ThinkingCube,
} from "@/components/motion/agent-loading-states";

const PHASES = ["Reading the codebase", "Searching for related files", "Drafting a response"];

export function AgentLoadingStatesPreview() {
  return (
    <div className="flex w-full max-w-xs flex-col gap-5 rounded-2xl bg-background p-4 shadow-[0_0_0_1px_var(--border)]">
      <div className="flex items-center gap-3">
        <ThinkingCube />
        <ShimmerText>Thinking...</ShimmerText>
      </div>
      <AgentProgress label="Indexing files" value={64} />
      <ReasoningPhases phases={PHASES} />
    </div>
  );
}

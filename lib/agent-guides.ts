export interface AgentGuidePrinciple {
  title: string;
  description: string;
}

export interface AgentGuideStage {
  title: string;
  description: string;
}

export interface AgentGuideConnection {
  slug: string;
  name: string;
  description: string;
}

export interface AgentGuide {
  seo: {
    title: string;
    description: string;
  };
  introduction: string;
  composition: {
    description: string;
    tree: string;
  };
  lifecycle: [AgentGuideStage, AgentGuideStage, AgentGuideStage];
  principles: [
    AgentGuidePrinciple,
    AgentGuidePrinciple,
    AgentGuidePrinciple,
  ];
  implementation: {
    title: string;
    description: string;
  };
  connections: AgentGuideConnection[];
  contract: {
    owns: string;
    leaves: string;
  };
  guidance: {
    useWhen: string;
    avoidWhen: string;
  };
}

/** Behavior guides keyed by component slug. Attach via `guide` in lib/registry.ts. */
export const agentGuides: Readonly<Record<string, AgentGuide>> = {};

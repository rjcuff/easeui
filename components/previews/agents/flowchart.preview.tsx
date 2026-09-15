import { Inbox } from "lucide-react";
import { Flowchart, type FlowStep } from "@/components/motion/flowchart";

const STEPS: FlowStep[] = [
  {
    id: "trigger",
    kind: "Trigger",
    title: "New ticket received",
    description: "Fires when a support email lands in the shared inbox.",
    icon: <Inbox className="h-4 w-4" />,
  },
  {
    id: "route",
    kind: "If / Else",
    kindVariant: "warning",
    condition: [
      {
        id: "priority",
        connector: "if",
        source: "ticket",
        property: { value: "priority", options: ["priority", "category", "channel"] },
        value: { value: "Urgent", options: ["Urgent", "High", "Normal", "Low"] },
      },
      {
        id: "category",
        connector: "and",
        source: "ticket",
        property: { value: "category", options: ["priority", "category", "channel"] },
        value: { value: "Billing", options: ["Billing", "Technical", "Account", "General"] },
      },
    ],
  },
];

export function FlowchartPreview() {
  return (
    <div className="w-full max-w-md">
      <Flowchart steps={STEPS} />
    </div>
  );
}

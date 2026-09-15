import { Inbox, UserCheck } from "lucide-react";
import { Flowchart } from "@/components/motion/flowchart";

const STEPS = [
  {
    id: "trigger",
    kind: "Trigger",
    title: "New ticket received",
    description: "Fires when a support email lands in the shared inbox.",
    icon: <Inbox className="h-4 w-4" />,
  },
  {
    id: "assign",
    kind: "Action",
    title: "Assign to on-call",
    description: "Routes the ticket to whoever is on call right now.",
    icon: <UserCheck className="h-4 w-4" />,
  },
];

export function FlowchartPreview() {
  return (
    <div className="w-full max-w-sm">
      <Flowchart steps={STEPS} />
    </div>
  );
}

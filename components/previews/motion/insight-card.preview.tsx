import { CreditCard, Users } from "lucide-react";
import { InsightCard } from "@/components/motion/insight-card";

export function InsightCardPreview() {
  return (
    <div className="grid w-full max-w-sm grid-cols-2 gap-3">
      <InsightCard
        label="Active users"
        value="2,481"
        trend={{ value: 12, direction: "up" }}
        icon={<Users className="h-4 w-4" />}
      />
      <InsightCard
        label="Failed charges"
        value="18"
        trend={{ value: 4, direction: "down" }}
        icon={<CreditCard className="h-4 w-4" />}
      />
    </div>
  );
}

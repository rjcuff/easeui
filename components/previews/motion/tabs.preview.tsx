"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/motion/tabs";

const PLANS = [
  { value: "monthly", label: "Monthly", price: "$12", note: "Billed every month" },
  { value: "yearly", label: "Yearly", price: "$120", note: "Two months free" },
  { value: "team", label: "Team", price: "$40", note: "Up to five seats" },
];

export function TabsPreview() {
  return (
    <div className="flex w-full max-w-sm flex-col items-center gap-10">
      <Tabs defaultValue="yearly" variant="pill" className="flex flex-col items-center gap-4">
        <TabsList>
          {PLANS.map((plan) => (
            <TabsTrigger key={plan.value} value={plan.value}>
              {plan.label}
            </TabsTrigger>
          ))}
        </TabsList>
        {PLANS.map((plan) => (
          <TabsContent key={plan.value} value={plan.value} className="text-center">
            <p className="text-3xl font-semibold tabular-nums text-foreground">{plan.price}</p>
            <p className="mt-1 text-sm text-muted-foreground">{plan.note}</p>
          </TabsContent>
        ))}
      </Tabs>

      <Tabs defaultValue="inbox" variant="underline">
        <TabsList>
          <TabsTrigger value="inbox">Inbox</TabsTrigger>
          <TabsTrigger value="drafts">Drafts</TabsTrigger>
          <TabsTrigger value="sent">Sent</TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
}

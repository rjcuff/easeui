import { DiffView } from "@/components/motion/diff-view";

const LINES = [
  { type: "context" as const, content: "export function total(items) {" },
  { type: "remove" as const, content: "  return items.reduce((a, b) => a + b)" },
  { type: "add" as const, content: "  return items.reduce((a, b) => a + b, 0)" },
  { type: "context" as const, content: "}" },
];

export function DiffViewPreview() {
  return (
    <div className="w-full max-w-md">
      <DiffView label="cart.ts" lines={LINES} />
    </div>
  );
}

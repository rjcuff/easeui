import { NotificationStack, type NotificationStackItem } from "@/components/motion/notification-stack";

const ITEMS: NotificationStackItem[] = [
  { id: "import-failed", title: "Orders import failed", description: "42s · TimeoutError at Step 2" },
  { id: "sla-breach", title: "SLA breach", description: "2m 11s · Data enrichment" },
  { id: "sync-fixed", title: "Product sync auto-fixed", description: "5m · 404 on GET /products" },
];

export function NotificationStackPreview() {
  return (
    <div className="w-full max-w-sm">
      <NotificationStack items={ITEMS} />
    </div>
  );
}

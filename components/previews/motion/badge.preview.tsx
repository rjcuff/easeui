import { Badge } from "@/components/motion/badge";

export function BadgePreview() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      <Badge>Neutral</Badge>
      <Badge variant="accent">Accent</Badge>
      <Badge variant="success">Success</Badge>
      <Badge variant="warning">Warning</Badge>
      <Badge variant="destructive">Destructive</Badge>
    </div>
  );
}

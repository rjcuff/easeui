import { FileCode, Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export type DiffLineType = "add" | "remove" | "context";
export type DiffLine = { type: DiffLineType; content: string };

export interface DiffViewProps {
  /** Pre-computed diff lines. This renders a diff, it doesn't compute one. */
  lines: DiffLine[];
  /** Shown in the header, such as a filename. Default "diff". */
  label?: string;
  className?: string;
}

const LINE_CLASS: Record<DiffLineType, string> = {
  add: "bg-success/10 text-foreground",
  remove: "bg-destructive/10 text-foreground",
  context: "text-muted-foreground",
};

const MARK: Record<DiffLineType, React.ReactNode> = {
  add: <Plus aria-hidden="true" className="h-3 w-3 text-success" strokeWidth={3} />,
  remove: <Minus aria-hidden="true" className="h-3 w-3 text-destructive" strokeWidth={3} />,
  context: null,
};

/** A line-by-line diff, with an added or removed gutter mark and a tinted row for each side. */
export function DiffView({ lines, label = "diff", className }: DiffViewProps) {
  return (
    <figure
      className={cn(
        "overflow-hidden rounded-2xl bg-card font-mono text-[13px] leading-relaxed shadow-[0_0_0_1px_var(--border)]",
        className,
      )}
    >
      <figcaption className="flex h-11 items-center gap-2 border-b border-border pl-4 pr-1.5 font-sans text-xs text-muted-foreground">
        <FileCode aria-hidden="true" className="h-3.5 w-3.5 shrink-0" />
        <span className="truncate">{label}</span>
      </figcaption>
      <div className="overflow-x-auto py-1.5">
        {lines.map((line, index) => (
          <div
            // biome-ignore lint/suspicious/noArrayIndexKey: a fixed diff, lines never reorder.
            key={index}
            className={cn("flex items-start gap-3 px-4 py-0.5", LINE_CLASS[line.type])}
          >
            <span aria-hidden="true" className="mt-1 flex w-3 shrink-0 items-center justify-center">
              {MARK[line.type]}
            </span>
            <span className="whitespace-pre">{line.content || " "}</span>
          </div>
        ))}
      </div>
    </figure>
  );
}

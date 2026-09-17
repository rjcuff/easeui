import { ArrowUp } from "lucide-react";
import type { HTMLAttributes, TdHTMLAttributes, ThHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

/** Smallest width a dragged column can shrink to. */
const MIN_COLUMN_WIDTH = 80;

export function Table({ className, ...props }: HTMLAttributes<HTMLTableElement>) {
  return (
    <div className="w-full overflow-x-auto rounded-2xl shadow-[0_0_0_1px_var(--border)]">
      <table className={cn("w-full border-collapse text-sm", className)} {...props} />
    </div>
  );
}

export function TableHeader({ className, ...props }: HTMLAttributes<HTMLTableSectionElement>) {
  return <thead className={cn("bg-muted/50", className)} {...props} />;
}

export function TableBody({ className, ...props }: HTMLAttributes<HTMLTableSectionElement>) {
  return <tbody className={cn("divide-y divide-border", className)} {...props} />;
}

export interface TableRowProps extends HTMLAttributes<HTMLTableRowElement> {
  /** Highlights the row as selected. Default false. */
  selected?: boolean;
}

export function TableRow({ selected = false, className, ...props }: TableRowProps) {
  return (
    <tr
      data-selected={selected}
      className={cn(
        "transition-colors duration-150 hover:bg-muted/40 data-[selected=true]:bg-accent/5",
        className,
      )}
      {...props}
    />
  );
}

export interface TableHeadProps extends ThHTMLAttributes<HTMLTableCellElement> {
  /** Shows a sort arrow and makes the header clickable. Omit for a plain, unsortable column. */
  sorted?: "asc" | "desc" | false;
  onSort?: () => void;
  /** Shows a drag handle on the trailing edge; reports the column's new width in pixels as the pointer moves. Width itself stays the caller's state, same as sort. */
  onResize?: (width: number) => void;
}

/** A thin strip on a header's trailing edge that drags the column wider or narrower. */
function ResizeHandle({ onResize }: { onResize: (width: number) => void }) {
  return (
    <span
      aria-hidden="true"
      onPointerDown={(event) => {
        event.preventDefault();
        const th = event.currentTarget.closest("th");
        if (!th) return;
        const startX = event.clientX;
        const startWidth = th.getBoundingClientRect().width;
        const previousCursor = document.body.style.cursor;
        const previousSelect = document.body.style.userSelect;
        document.body.style.cursor = "col-resize";
        document.body.style.userSelect = "none";

        const move = (moveEvent: PointerEvent) => {
          onResize(Math.max(MIN_COLUMN_WIDTH, startWidth + moveEvent.clientX - startX));
        };
        const finish = () => {
          window.removeEventListener("pointermove", move);
          window.removeEventListener("pointerup", finish);
          document.body.style.cursor = previousCursor;
          document.body.style.userSelect = previousSelect;
        };
        window.addEventListener("pointermove", move);
        window.addEventListener("pointerup", finish);
      }}
      className="absolute inset-y-2 right-0 w-1 cursor-col-resize touch-none rounded-full bg-foreground/15 opacity-0 transition-opacity duration-150 group-hover:opacity-100"
    />
  );
}

/** A column heading. Pass onSort and it becomes a button with a sort arrow that only shows on hover until active. Pass onResize to add a drag handle on its trailing edge. */
export function TableHead({ sorted = false, onSort, onResize, className, children, ...props }: TableHeadProps) {
  if (!onSort) {
    return (
      <th
        className={cn(
          "group relative h-10 px-3 text-left text-xs font-medium text-muted-foreground",
          className,
        )}
        {...props}
      >
        {children}
        {onResize ? <ResizeHandle onResize={onResize} /> : null}
      </th>
    );
  }
  return (
    <th
      className={cn("group relative h-10 px-1 text-left text-xs font-medium text-muted-foreground", className)}
      {...props}
    >
      <button
        type="button"
        onClick={onSort}
        className="inline-flex h-8 touch-manipulation items-center gap-1 rounded-md px-2 outline-none transition-colors duration-150 hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-foreground/40"
      >
        {children}
        <ArrowUp
          aria-hidden="true"
          className={cn(
            "h-3 w-3 transition-[opacity,transform] duration-150",
            sorted ? "opacity-100" : "opacity-0 group-hover:opacity-40",
            sorted === "desc" && "rotate-180",
          )}
        />
      </button>
      {onResize ? <ResizeHandle onResize={onResize} /> : null}
    </th>
  );
}

export interface TableCellProps extends TdHTMLAttributes<HTMLTableCellElement> {
  /** Bolds the cell in the foreground color, for a row's primary column, such as a name. Default false. */
  emphasis?: boolean;
  /** Shows a muted "Calculating…" placeholder in place of children, for a value still being computed. Default false. */
  loading?: boolean;
}

export function TableCell({ emphasis = false, loading = false, className, children, ...props }: TableCellProps) {
  return (
    <td
      className={cn("px-3 py-2.5 align-middle", emphasis && "font-medium text-foreground", className)}
      {...props}
    >
      {loading ? (
        <span className="inline-flex items-center gap-1.5 text-muted-foreground">
          Calculating…
          <span
            aria-hidden="true"
            className="h-1.5 w-1.5 animate-pulse rounded-full bg-muted-foreground motion-reduce:animate-none"
          />
        </span>
      ) : (
        children
      )}
    </td>
  );
}

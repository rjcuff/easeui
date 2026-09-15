import { ArrowUp } from "lucide-react";
import type { HTMLAttributes, TdHTMLAttributes, ThHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

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
}

/** A column heading. Pass onSort and it becomes a button with a sort arrow that only shows on hover until active. */
export function TableHead({ sorted = false, onSort, className, children, ...props }: TableHeadProps) {
  if (!onSort) {
    return (
      <th
        className={cn("h-10 px-3 text-left text-xs font-medium text-muted-foreground", className)}
        {...props}
      >
        {children}
      </th>
    );
  }
  return (
    <th className={cn("h-10 px-1 text-left text-xs font-medium text-muted-foreground", className)} {...props}>
      <button
        type="button"
        onClick={onSort}
        className="group inline-flex h-8 touch-manipulation items-center gap-1 rounded-md px-2 outline-none transition-colors duration-150 hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-foreground/40"
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
    </th>
  );
}

export interface TableCellProps extends TdHTMLAttributes<HTMLTableCellElement> {
  /** Bolds the cell in the foreground color, for a row's primary column, such as a name. Default false. */
  emphasis?: boolean;
}

export function TableCell({ emphasis = false, className, ...props }: TableCellProps) {
  return (
    <td
      className={cn("px-3 py-2.5 align-middle", emphasis && "font-medium text-foreground", className)}
      {...props}
    />
  );
}

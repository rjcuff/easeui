"use client";

import { Archive, Tag, Trash2 } from "lucide-react";
import { useState } from "react";
import { Checkbox } from "@/components/motion/checkbox";
import { SelectionActions } from "@/components/motion/selection-actions";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/motion/table";

const ROWS = [
  { id: "1", name: "Priya Nair" },
  { id: "2", name: "Theo Marsh" },
  { id: "3", name: "Aiko Sato" },
];

const ACTION_BUTTON =
  "relative inline-flex h-7 w-7 shrink-0 touch-manipulation items-center justify-center rounded-full outline-none transition-colors duration-150 after:absolute after:-inset-1.5 hover:bg-background/15 focus-visible:ring-2 focus-visible:ring-background/60";

export function SelectionActionsPreview() {
  const [selected, setSelected] = useState<Set<string>>(new Set(["1"]));

  const toggle = (id: string) =>
    setSelected((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  return (
    <div className="flex w-full max-w-sm flex-col items-center gap-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-10" />
            <TableHead>Name</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {ROWS.map((row) => (
            <TableRow key={row.id} selected={selected.has(row.id)}>
              <TableCell className="w-10">
                <Checkbox
                  checked={selected.has(row.id)}
                  onCheckedChange={() => toggle(row.id)}
                  aria-label={`Select ${row.name}`}
                />
              </TableCell>
              <TableCell emphasis>{row.name}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <SelectionActions count={selected.size} onClear={() => setSelected(new Set())}>
        <button type="button" aria-label="Tag" className={ACTION_BUTTON}>
          <Tag aria-hidden="true" className="h-3.5 w-3.5" />
        </button>
        <button type="button" aria-label="Archive" className={ACTION_BUTTON}>
          <Archive aria-hidden="true" className="h-3.5 w-3.5" />
        </button>
        <button type="button" aria-label="Delete" className={ACTION_BUTTON}>
          <Trash2 aria-hidden="true" className="h-3.5 w-3.5" />
        </button>
      </SelectionActions>
    </div>
  );
}

"use client";

import { useEffect, useMemo, useState } from "react";
import { Badge } from "@/components/motion/badge";
import { Checkbox } from "@/components/motion/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/motion/table";

type Person = { id: string; name: string; role: string; status: "Active" | "Away" };

const PEOPLE: Person[] = [
  { id: "1", name: "Priya Nair", role: "Design", status: "Active" },
  { id: "2", name: "Theo Marsh", role: "Engineering", status: "Active" },
  { id: "3", name: "Aiko Sato", role: "Engineering", status: "Away" },
  { id: "4", name: "Callum Reed", role: "Product", status: "Active" },
];

/** Fake load scores as if they'd just been computed, to demo the loading cell. */
const SCORES: Record<string, number> = { "1": 92, "2": 88, "3": 95, "4": 81 };

export function TablePreview() {
  const [sortAsc, setSortAsc] = useState(true);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [nameWidth, setNameWidth] = useState<number>();
  const [scoresReady, setScoresReady] = useState(false);

  useEffect(() => {
    const timeout = window.setTimeout(() => setScoresReady(true), 1200);
    return () => window.clearTimeout(timeout);
  }, []);

  const rows = useMemo(
    () => [...PEOPLE].sort((a, b) => (sortAsc ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name))),
    [sortAsc],
  );

  const allSelected = selected.size === PEOPLE.length;
  const toggleAll = () => setSelected(allSelected ? new Set() : new Set(PEOPLE.map((p) => p.id)));
  const toggleOne = (id: string) =>
    setSelected((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  return (
    <div className="w-full max-w-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-10">
              <Checkbox checked={allSelected} onCheckedChange={toggleAll} aria-label="Select all" />
            </TableHead>
            <TableHead
              sorted={sortAsc ? "asc" : "desc"}
              onSort={() => setSortAsc((value) => !value)}
              onResize={setNameWidth}
              style={nameWidth ? { width: nameWidth } : undefined}
            >
              Name
            </TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Score</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((person) => (
            <TableRow key={person.id} selected={selected.has(person.id)}>
              <TableCell className="w-10">
                <Checkbox
                  checked={selected.has(person.id)}
                  onCheckedChange={() => toggleOne(person.id)}
                  aria-label={`Select ${person.name}`}
                />
              </TableCell>
              <TableCell emphasis style={nameWidth ? { width: nameWidth } : undefined}>
                {person.name}
              </TableCell>
              <TableCell>
                <Badge variant="neutral">{person.role}</Badge>
              </TableCell>
              <TableCell>
                <Badge variant={person.status === "Active" ? "success" : "warning"}>{person.status}</Badge>
              </TableCell>
              <TableCell loading={!scoresReady}>{scoresReady ? SCORES[person.id] : null}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

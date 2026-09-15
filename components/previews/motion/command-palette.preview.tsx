"use client";

import { Calendar, FileText, Search, Settings, User } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/motion/button";
import {
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandPalette,
} from "@/components/motion/command-palette";

// This preview opens only on click. A page that installs this component is the
// one place that should bind the ⌘K shortcut to it (see the site's own header
// search for that pattern) — binding it here too would fire both at once.
export function CommandPalettePreview() {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState("New document");

  return (
    <div className="flex flex-col items-center gap-3">
      <Button variant="secondary" onClick={() => setOpen(true)}>
        <Search aria-hidden="true" className="h-4 w-4 text-muted-foreground" />
        Search
      </Button>
      <p className="text-xs text-muted-foreground">
        Last selected: <span className="text-foreground">{selected}</span>
      </p>
      <CommandPalette open={open} onOpenChange={setOpen}>
        <CommandInput />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Suggestions">
            <CommandItem keywords={["page", "write"]} onSelect={() => setSelected("New document")}>
              <FileText aria-hidden="true" className="h-4 w-4 text-muted-foreground" />
              New document
            </CommandItem>
            <CommandItem keywords={["schedule", "meeting"]} onSelect={() => setSelected("New event")}>
              <Calendar aria-hidden="true" className="h-4 w-4 text-muted-foreground" />
              New event
            </CommandItem>
            <CommandItem keywords={["invite", "teammate"]} onSelect={() => setSelected("Invite teammate")}>
              <User aria-hidden="true" className="h-4 w-4 text-muted-foreground" />
              Invite teammate
            </CommandItem>
          </CommandGroup>
          <CommandGroup heading="Settings">
            <CommandItem keywords={["preferences", "account"]} onSelect={() => setSelected("Preferences")}>
              <Settings aria-hidden="true" className="h-4 w-4 text-muted-foreground" />
              Preferences
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandPalette>
    </div>
  );
}

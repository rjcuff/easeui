"use client";

import { useState } from "react";
import { Button } from "@/components/motion/button";
import { Drawer } from "@/components/motion/drawer";

export function DrawerPreview() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>Open filters</Button>
      <Drawer
        open={open}
        onOpenChange={setOpen}
        title="Filters"
        description="Narrow results down to what matters."
        footer={
          <>
            <Button variant="secondary" onClick={() => setOpen(false)}>
              Clear
            </Button>
            <Button onClick={() => setOpen(false)}>Apply</Button>
          </>
        }
      >
        <div className="flex flex-col gap-4 pb-6 text-sm">
          <p className="text-muted-foreground">
            Drag the handle down, or flick it, to dismiss without picking anything.
          </p>
        </div>
      </Drawer>
    </>
  );
}

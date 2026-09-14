"use client";

import { useState } from "react";
import { Button } from "@/components/motion/button";
import { Modal } from "@/components/motion/modal";

export function ModalPreview() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");

  return (
    <>
      <Button onClick={() => setOpen(true)}>Invite teammate</Button>
      <Modal
        open={open}
        onOpenChange={setOpen}
        title="Invite a teammate"
        description="They will get an email with a link to join this workspace."
        footer={
          <>
            <Button variant="secondary" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                setOpen(false);
                setEmail("");
              }}
            >
              Send invite
            </Button>
          </>
        }
      >
        <label className="flex flex-col gap-2 text-sm">
          <span className="font-medium text-foreground">Email</span>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="name@company.com"
            // 16px on phones so iOS does not zoom into the field.
            className="h-10 rounded-xl bg-card px-3 text-base text-foreground shadow-[0_0_0_1px_var(--border-strong)] outline-none transition-shadow duration-150 placeholder:text-muted-foreground focus:shadow-[0_0_0_2px_var(--accent)] sm:text-sm"
          />
        </label>
      </Modal>
    </>
  );
}

"use client";

import { useId } from "react";
import { Input } from "@/components/motion/input";

export function InputPreview() {
  const emailId = useId();
  const usernameId = useId();
  const errorId = useId();

  return (
    <div className="flex w-full max-w-xs flex-col gap-4">
      <label htmlFor={emailId} className="flex flex-col gap-2 text-sm">
        <span className="font-medium text-foreground">Email</span>
        <Input id={emailId} type="email" placeholder="name@company.com" autoComplete="email" />
      </label>
      <label htmlFor={usernameId} className="flex flex-col gap-2 text-sm">
        <span className="font-medium text-foreground">Username</span>
        <Input
          id={usernameId}
          defaultValue="taken"
          aria-invalid="true"
          aria-describedby={errorId}
        />
        <span id={errorId} className="text-xs text-destructive">
          That username is already taken.
        </span>
      </label>
    </div>
  );
}

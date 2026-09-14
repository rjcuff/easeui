"use client";

import { useState } from "react";
import { Button } from "@/components/motion/button";
import { OtpInput } from "@/components/motion/otp-input";

const CORRECT_CODE = "246810";
const MIN_DELAY_MS = 2000;
const MAX_DELAY_MS = 4000;

/** Stands in for a network round trip: waits 2 to 4 seconds, then checks the code. */
function fakeVerify(code: string): Promise<boolean> {
  const delay = MIN_DELAY_MS + Math.random() * (MAX_DELAY_MS - MIN_DELAY_MS);
  return new Promise((resolve) => setTimeout(() => resolve(code === CORRECT_CODE), delay));
}

export function OtpInputPreview() {
  const [key, setKey] = useState(0);

  return (
    <div className="flex flex-col items-center gap-4">
      <p className="text-xs text-muted-foreground">Try 2 4 6 8 1 0.</p>
      <OtpInput key={key} onVerify={fakeVerify} />
      <Button variant="secondary" size="sm" onClick={() => setKey((k) => k + 1)}>
        Reset
      </Button>
    </div>
  );
}

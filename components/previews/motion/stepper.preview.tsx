"use client";

import { useState } from "react";
import { Button } from "@/components/motion/button";
import { Stepper } from "@/components/motion/stepper";

const STEPS = [
  { label: "Account", description: "Email and password" },
  { label: "Workspace", description: "Name and team size" },
  { label: "Invite", description: "Bring your team" },
  { label: "Done", description: "Start building" },
];

export function StepperPreview() {
  const [step, setStep] = useState(1);

  return (
    <div className="flex w-full max-w-lg flex-col items-center gap-8">
      <Stepper steps={STEPS} current={step} onStepClick={setStep} />
      <div className="flex gap-2">
        <Button variant="secondary" size="sm" onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0}>
          Back
        </Button>
        <Button size="sm" onClick={() => setStep((s) => Math.min(STEPS.length - 1, s + 1))} disabled={step === STEPS.length - 1}>
          Next
        </Button>
      </div>
    </div>
  );
}

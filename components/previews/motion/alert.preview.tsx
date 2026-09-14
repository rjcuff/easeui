import { CircleAlert, TriangleAlert } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/motion/alert";

export function AlertPreview() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-3">
      <Alert variant="warning">
        <TriangleAlert aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0" />
        <div>
          <AlertTitle>Storage almost full</AlertTitle>
          <AlertDescription>You are using 92% of your plan's storage.</AlertDescription>
        </div>
      </Alert>
      <Alert variant="destructive">
        <CircleAlert aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0" />
        <div>
          <AlertTitle>Payment failed</AlertTitle>
          <AlertDescription>Update your card to keep your subscription active.</AlertDescription>
        </div>
      </Alert>
    </div>
  );
}

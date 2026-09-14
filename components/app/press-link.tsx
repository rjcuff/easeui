import Link from "next/link";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

/** A link that presses in slightly while held, like a button. */
export function PressLink({ className, ...props }: ComponentProps<typeof Link>) {
  return (
    <Link
      className={cn(
        "transition-transform duration-150 ease-out active:scale-[0.97] motion-reduce:active:scale-100",
        className,
      )}
      {...props}
    />
  );
}

import { cn } from "@/lib/utils";

/** Flat-top regular octagon (apothem 9) centered in a 24px box. */
export const EASE_MARK_POINTS =
  "8.27,3 15.73,3 21,8.27 21,15.73 15.73,21 8.27,21 3,15.73 3,8.27";

/** easeUI mark: a thick octagon outline drawn in the current text color. */
export function EaseMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={cn("shrink-0", className)}
    >
      <polygon
        points={EASE_MARK_POINTS}
        stroke="currentColor"
        strokeWidth={3.5}
        strokeLinejoin="round"
      />
    </svg>
  );
}

import type { ReactElement } from "react";

export const OG_SIZE = { width: 1200, height: 630 };

/** Flat-top regular octagon, matching the logo mark in `components/app/logo.tsx`. */
const OCTAGON_POINTS = "8.27,3 15.73,3 21,8.27 21,15.73 15.73,21 8.27,21 3,15.73 3,8.27";

/** Social card: the easeUI octagon, centered on the dark background. */
export function ogImage(): ReactElement {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#151515",
      }}
    >
      <svg width={260} height={260} viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <polygon
          points={OCTAGON_POINTS}
          stroke="#ffffff"
          strokeWidth={3.5}
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

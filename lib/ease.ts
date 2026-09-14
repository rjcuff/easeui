// Shared motion tokens. Micro-interactions run 100 to 150ms, standard UI
// 150 to 250ms, and panels up to 300ms.
// Easing curves mirror the CSS custom properties in globals.css.

/** ease-out-quint. Fast start that settles quickly. Entrances, exits, feedback. */
export const EASE_OUT = [0.23, 1, 0.32, 1] as const;
/** ease-in-out-cubic. Elements already on screen moving to a new spot. */
export const EASE_IN_OUT = [0.645, 0.045, 0.355, 1] as const;
/** Sheet and drawer glide. */
export const EASE_DRAWER = [0.32, 0.72, 0, 1] as const;

/** CSS string form of EASE_OUT for inline style transitions. */
export const EASE_OUT_CSS = "cubic-bezier(0.23, 1, 0.32, 1)";

// Springs are described by duration and bounce, which is easier to reason about
// than stiffness and damping. Bounce stays at zero for product UI.

/** Press feedback on buttons and other tappable surfaces. */
export const SPRING_PRESS = {
  type: "spring",
  duration: 0.15,
  bounce: 0,
} as const;

/** Content swaps, label and icon slots trading places inside a control. */
export const SPRING_SWAP = {
  type: "spring",
  duration: 0.2,
  bounce: 0,
} as const;

/** Overlay panel entrances, modals and sheets summoned by pointer. */
export const SPRING_PANEL = {
  type: "spring",
  duration: 0.25,
  bounce: 0,
} as const;

/** Shared-layout glides, pills and indicators moving between positions. */
export const SPRING_LAYOUT = {
  type: "spring",
  duration: 0.22,
  bounce: 0,
} as const;

/** Cursor-follow physics for decorative mouse tracking (magnetic, tilt). */
export const SPRING_MOUSE = {
  stiffness: 320,
  damping: 26,
  mass: 0.3,
} as const;

/** Dragged handles and fills (sliders). Critically damped `useSpring` config,
 * so the value follows the pointer closely and never rebounds off an end. */
export const SPRING_GLIDE = {
  stiffness: 700,
  damping: 50,
  mass: 0.5,
} as const;

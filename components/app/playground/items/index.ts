import type { PlaygroundItem } from "../core";
import { modalItem } from "./modal";
import { popoverItem } from "./popover";
import { pressItem } from "./press";
import { springItem } from "./spring";
import { staggerItem } from "./stagger";
import { tweenItem } from "./tween";

/**
 * Local playground catalog, separate from the shadcn registry (`lib/registry.ts`).
 * These never ship as installable components.
 */
export const PLAYGROUND_ITEMS: PlaygroundItem[] = [
  tweenItem,
  springItem,
  pressItem,
  popoverItem,
  modalItem,
  staggerItem,
];

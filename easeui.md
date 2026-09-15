# easeUI component blueprint

This is the agent-facing companion to `CONTRIBUTING.md`. That file states the
principles (ease out, animate transform/opacity, 44px tap targets). This file
is the mechanics underneath them: the exact patterns this codebase already
uses, so a new component looks like it was written by the same person who
wrote the rest of the library.

Read `CONTRIBUTING.md` first for the rules. Read this for how to actually
satisfy them in code.

## Anatomy of a component file

`components/motion/<slug>.tsx`, always — even for an `agents`-category
component. The registry category (`motion` vs `agents`) only affects where
the component is *listed*; the physical file always lives in
`components/motion/`. There is no `components/agents/` directory.

Order inside the file:

```tsx
"use client";                          // only if it touches state, refs, or effects

import { ... } from "lucide-react";     // icons
import { motion, useReducedMotion } from "motion/react"; // if using motion/react at all
import { useEffect, useRef, useState } from "react";
import { EASE_OUT } from "@/lib/ease"; // if using a shared token
import { cn } from "@/lib/utils";

export interface XProps { ... }        // exported, one JSDoc line per prop
const SOME_KEYFRAMES = [...];           // module-level constants: keyframes, class strings
function localHelper() { ... }          // small helpers used only by this file

/** One sentence, sometimes two, on what it does and the one behavior worth naming. */
export function X({ ...props }: XProps) { ... }
```

A component file never imports from `components/app/*`. That's the site's
own chrome. A registry component must be self-contained — it's a file a
consumer copies into their own project, and it has to work there with only
`lucide-react`, `motion`, `clsx`/`tailwind-merge`, and React.

Small style helpers (a `SWAP`/`SHOWN`/`HIDDEN` trio, a `prefersReducedMotion()`
check) get redefined per file rather than imported from a shared util. That's
deliberate: it keeps each file copy-pasteable on its own. Don't "fix" this by
extracting a shared helper into `lib/`.

## Controlled / uncontrolled state

Every input-like component (Checkbox, Switch, OtpInput, FileUpload, PromptInput)
follows the same shape:

```tsx
export interface XProps {
  /** Controlled value. */
  value?: T;
  /** Starting value when uncontrolled. Default ... */
  defaultValue?: T;
  onChange?: (value: T) => void;
}

const [uncontrolled, setUncontrolled] = useState(defaultValue);
const isControlled = value !== undefined;
const current = isControlled ? value : uncontrolled;

const setValue = (next: T) => {
  if (!isControlled) setUncontrolled(next);
  onChange?.(next);
};
```

Boolean toggles use `checked`/`defaultChecked`/`onCheckedChange` instead of
`value`/`onChange` (matches the native `<input type="checkbox">` naming).

## Compound "named slot" props

When a component can show one of several *distinct* pieces of content in
an expanded or active state — not just an on/off toggle — a rigid enum of
named props (`compact`, `expandedA`, `expandedB`, ...) doesn't scale.
Dynamic Island's live-activity views (a call, a timer, a music player — any
number of them) instead take a compound shape:

```tsx
<DynamicIsland view={activeId} compact={<>...</>}>
  <DynamicIslandView id="call">...</DynamicIslandView>
  <DynamicIslandView id="timer">...</DynamicIslandView>
</DynamicIsland>
```

`DynamicIslandView` is never rendered on its own — it's read via
`Children.toArray(children).filter(isValidElement)`, then matched by `id`
against `view`. No shared context is needed here, since there's no
per-child interactive state to coordinate (contrast with Tabs'
`TabsContent`, which does need context for keyboard nav). Reach for this
shape whenever "expanded" isn't one fixed layout but a family of them
selected by id.

## Choosing how to animate: WAAPI vs motion/react vs plain CSS

This is the single most common judgment call. Load the `pick-ui-library`
skill if it's not already in context — the short version, as this codebase
actually applies it:

- **Plain Tailwind transition classes** — hover/focus/press states on a
  static element. `transition-colors duration-150`. No JS.
- **`element.animate()` (WAAPI)**, imperative, fired from an effect or event
  handler — a one-off effect that isn't tied to a piece of React state:
  a shake, a pop, a spin-in-place, a crossfading icon swap. Used in
  OtpInput's shake/pop, GradientText's drift, ThinkingCube's turns,
  PixelLoader's pulse. Cheap, no re-render, and the component doesn't need
  to track "is it animating" as state.
- **`motion/react`** (`motion.div`, `AnimatePresence`, `layout`) — anything
  where React state already drives *what* renders, and the animation is
  *how it arrives or leaves*: entrances driven by a boolean/enum, exit
  animations, `layoutId` shared-element transitions, drag gestures. Used in
  Modal, Drawer, DropdownMenu, StreamingResponse's action row, ToolApproval's
  button-row-to-pill collapse.

Don't reach for `motion/react` for something WAAPI already does more cheaply
(a decorative loop with no state), and don't hand-roll WAAPI state machines
for something that's really just "this boolean is true, render with exit."

## Motion tokens

`lib/ease.ts` has the curves and springs. Use them; don't invent a new
`cubic-bezier(...)` inline unless the shared ones genuinely don't fit (rare —
check the file's own doc comments for which one is "for this kind of thing"
before adding a new one).

- Micro-interactions: 100–150ms. Standard UI: 150–250ms. Panels: up to 300ms.
- `EASE_OUT` for entrances and feedback. `EASE_IN_OUT` for an element already
  on screen moving to a new spot.
- Springs: `duration` + `bounce`, bounce at 0 for product UI. `SPRING_PRESS`
  for taps, `SPRING_SWAP` for content trading places in a slot, `SPRING_PANEL`
  for pointer-summoned overlays, `SPRING_LAYOUT` for `layoutId` glides.

## Reduced motion

Two versions of the same check, depending on which animation system:

```tsx
// Inside a React-rendered component using motion/react:
const reduce = useReducedMotion();

// Inside an effect driving WAAPI directly:
function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
```

Every animated component checks one of these and turns the animation off
completely when it's true — never just makes it faster. If the component
also depends on off-screen state (ThinkingCube, PixelLoader), pair reduced
motion with the check, don't add a separate opt-out.

## Layout-animation gotchas

Two failure modes came up repeatedly while building components that morph
shape via the `layout` prop (Dynamic Island, Morphing Search, Notification
Stack's peek-to-list expansion):

- **Nested content stretches during the resize.** `layout` on a container
  animates its shape change via a scale-correction transform (a FLIP), and
  that correction only propagates to *other* `layout`-aware descendants. A
  child that isn't marked `layout` gets visually stretched or squashed
  non-uniformly while the parent resizes around it — most obvious on text,
  but it hits icons too (Morphing Search's collapsed icon looked warped
  before this was fixed). Mark the content that swaps in — the compact
  line, the expanded card, the icon button — with `layout` as well, not
  just the outer shell. If something newly revealed still looks off mid
  transition, delay its opacity fade-in (`animate={{ opacity: 1,
  transition: { delay: ... } }}`) until the shape change is mostly
  settled, so it only appears once it's actually the right size.
- **A list collapsing reads as two separate motions instead of one.** When
  `AnimatePresence` removes items from a `layout`-driven list, the default
  `mode="sync"` keeps exiting items in normal flow until they finish
  animating out — so a remaining sibling's `layout` reflow only happens
  *after* they unmount, reading as "items fade, then the stack suddenly
  snaps shut." `mode="popLayout"` pulls exiting items out of flow
  immediately so the reflow animates in parallel with the fade.
  ToolApproval already relies on this; Notification Stack and Morphing
  Search needed it added too.

A spring with visible bounce (`bounce` above 0) is a deliberate exception
to this library's usual bounce:0 rule, reserved for a component that's
meant to feel soft or alive rather than a stiff panel (Dynamic Island's
shell uses `bounce: 0.35`). Say so in a comment when reaching for it — it
should read as an intentional choice, not an oversight, and it should stay
rare.

## Recipes seen more than once

**Crossfading swap in a shared slot** (CopyButton's icon↔check, PromptInput's
send↔stop, OtpInput's spinner↔check): both states render at once, stacked in
a CSS grid cell, opacity/scale toggling between them.

```tsx
const SWAP = "col-start-1 row-start-1 transition-[opacity,scale] duration-200 ease-out motion-reduce:transition-none";
const SHOWN = "scale-100 opacity-100";
const HIDDEN = "scale-50 opacity-0";
```

**A gentle shake** (OtpInput, for a wrong code): small, gets smaller,
settles — not a rattle.

```ts
const SHAKE: Keyframe[] = [
  { transform: "translateX(0)" },
  { transform: "translateX(-5px)" },
  { transform: "translateX(4px)" },
  { transform: "translateX(-2px)" },
  { transform: "translateX(0)" },
];
```

**A quick pop on arrival** (OtpInput's filled digit): small scale-and-fade in
under 150ms, not a bounce.

```ts
const POP: Keyframe[] = [
  { transform: "scale(0.9)", opacity: 0.6 },
  { transform: "scale(1)", opacity: 1 },
];
```

## Styling conventions

- Hairline borders are `shadow-[0_0_0_1px_var(--border)]` (or `--border-strong`
  for a more visible one), not a `border` utility — it blends against any
  background and doesn't add layout width.
- Pills and buttons: `rounded-full`. Cards and panels: `rounded-xl` or
  `rounded-2xl`.
- A small visible control still gets a ~44px tap target via an invisible hit
  area: `after:absolute after:-inset-1.5` (or similar) rather than padding
  that changes the visible size.
- Focus: `focus-visible:ring-2 focus-visible:ring-foreground/40
  focus-visible:ring-offset-2 focus-visible:ring-offset-background`.
- Disabled: `disabled:pointer-events-none disabled:opacity-50`.
- `className` is always the last prop, merged with `cn(...)` (tailwind-merge)
  so a consumer's override wins.
- `bg-muted` and `bg-card` resolve to the *same* color in this theme
  (`--muted: var(--card)`), so a `bg-muted` highlight drawn on top of a
  `bg-card` surface is invisible — this exact bug shipped once before being
  caught by actually looking at a screenshot. When two stacked surfaces
  need to visibly contrast, reach for `bg-background` against `bg-card`
  instead (those two do differ, in both themes), and don't trust a token
  pair to contrast without checking a rendered screenshot.
- A decorative element that needs to sit *behind* its in-flow siblings via
  `position: absolute` plus a negative `z-index` needs its parent to
  actually establish a stacking context, or the negative z-index escapes
  to a higher ancestor and can render behind the component's own
  background — or the page. Add `isolate` to the parent alongside
  `relative`, then layer `-z-10`, `-z-20`, etc. on the decorative elements
  from front to back.

## A clickable row that contains its own buttons

Flowchart's condition card and Notification Stack's hover-to-expand
wrapper both needed the same shape: an outer element that reacts to a
click or hover (select a card, expand a stack), while still containing
independently-clickable children (a dropdown chip, a "View all" button). A
native
`<button>` can't nest another `<button>` — it's invalid HTML and breaks
the inner control. Use `<div role="button" tabIndex={0} onClick={...}
onKeyDown={...}>` for the outer element instead, and suppress the
resulting biome rule with a comment that says *why*, not just that it's
suppressed:

```tsx
// biome-ignore lint/a11y/useSemanticElements: a <button> can't nest the chip buttons inside it.
<div role="button" tabIndex={0} ...>
```

A wrapper that only listens for hover or focus (no click, no role at all)
trips `lint/a11y/noStaticElementInteractions` instead — same fix, worded
around what's actually inside: "only tracks hover to expand the stack;
every card underneath is its own focusable control."

## Comments

One short line, plain language. Say the *why*, never the *what* — the code
already says what. If a comment would need two lines to make its point, it's
usually explaining too much; cut the qualifying clause. JSDoc on exported
props is the exception — that's public API documentation shown in the site's
reference table, and can run a little longer.

## The registry-wiring checklist

Five files, every time, or `bun run check:registry` fails:

1. `components/motion/<slug>.tsx` — the component, exported with a documented props interface.
2. `components/previews/<category>/<slug>.preview.tsx` — a realistic, working demo (`"use client"` if it has state).
3. `components/previews/index.tsx` — one `dynamic(() => import(...))` entry keyed `<category>/<slug>`.
4. `lib/registry.ts` — a catalog entry: `slug`, `name`, `description`, `file`, `badge: "new"`, `launchedAt`, `keywords`.
5. `lib/component-dates.ts` — `publishedAt`/`updatedAt` keyed `<category>/<slug>`.

Then: `bun run typecheck`, `bun run lint`, `bun scripts/check-registry.ts` (or
`bun run check` for all of it at once). Fix everything before moving on —
don't batch fixes across multiple components.

### The biome-ignore gotcha

`// biome-ignore lint/suspicious/noArrayIndexKey: ...` (and other inline
suppressions) must sit on the line **directly above the exact flagged
line** — usually the `key={...}` attribute itself, not the JSX element's
opening tag if `key` isn't on that same line. Get the placement wrong and
biome reports the suppression as unused *and* still flags the original
issue. When in doubt, put the comment immediately above whichever line the
error output points its `>` arrow at.

## Mobile and touch

A code-level pass (no device or browser lab — verify visually when you have
one) turned up the same two bug classes repeatedly. Check for both on every
new component and every edit to an existing one.

**Every icon-only circular control needs a 44px effective tap target, even
when its visible size is smaller.** Don't enlarge the visible box — extend
an invisible hit area with `after:absolute after:-inset-*`, sized so
`visible size + 2 × inset ≈ 44px`:

| Visible size | Inset needed |
| --- | --- |
| 28px (`h-7 w-7`) | `after:-inset-2` |
| 32px (`h-8 w-8`) | `after:-inset-1.5` |
| 36px (`h-9 w-9`) | `after:-inset-1` |

Modal's and Drawer's close buttons had this from the start; FileUpload's
remove button, StreamingResponse's action row, and DropdownMenuTrigger
didn't, and got it added. A text button with horizontal padding (like
ToolApproval's Approve/Deny) is more forgiving and usually doesn't need this,
but an icon alone in a circle always does.

**A floating panel (dropdown, popover) must never be wider than the
viewport**, or the whole page gets a horizontal scrollbar on a narrow
screen. Toast already had the right pattern:

```
w-[min(22rem,calc(100vw-2rem))]
```

For a panel that only sets a `min-w-*` (DropdownMenuContent,
PopoverContent), pair it with `max-w-[calc(100vw-2rem)]` so it can grow for
its content but never past the screen. Select's menu sidesteps this
differently — it's pinned to `inset-x-0` on its trigger, so it's never
wider than the control that opened it; that's the safest pattern of all
when the layout allows it.

What this pass didn't do: full-width clamping only stops a panel from
*causing page overflow*. It doesn't reposition a panel horizontally to stay
on screen the way DropdownMenuContent and PopoverContent already do
vertically (flipping above the trigger when there's no room below) — a menu
anchored very close to the left or right edge can still render partly
off-screen rather than shifting inward. Extending the existing vertical-flip
`useLayoutEffect` to also clamp horizontally is the natural next step, but
it changes real positioning math in a component already in use, so don't
make that change without visually verifying the result.

A canvas-style component with a fixed internal card/tile size (Flowchart's
256px cards) has a soft minimum comfortable container width as a result —
that's a legitimate design constraint, not a bug, as long as the *container*
itself stays fluid (`w-full`) and doesn't force page overflow. Don't chase
it down to arbitrary phone widths; a reasonable minimum (roughly 300–320px)
is fine.

## When a component needs a dependency

It almost never does. Every existing component ships on `lucide-react`,
`motion`, `clsx`/`tailwind-merge`, and React — nothing else. Before reaching
for a library (a date picker, a virtualizer, a charting lib), check whether
the interaction can be built on native elements and CSS/WAAPI the way the
rest of the library does. If a component genuinely can't work without a
dependency (a real syntax highlighter, for instance), that's a sign it may
need a different shape than "just a component file" — flag it rather than
quietly adding the dependency.

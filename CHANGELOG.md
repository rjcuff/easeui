# Changelog

All notable changes to easeUI are listed here. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and versions follow
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

Components ship as copy-paste source through the `@easeui` shadcn registry, so a
change to a component's props or behavior is called out under its name. Breaking
changes to a component's API are marked **Breaking**.

## [Unreleased]

### Added

- **Color Picker**. A draggable color field, native keyboard sliders, HEX editing, and preset swatches. Supports controlled and uncontrolled values, disabled controls, form submission and reset, and reduced motion.

- `CHANGELOG.md`, branch and release rules in `CONTRIBUTING.md`, a pull request template, and issue templates for bugs and component requests.
- 21st.dev export scripts. `scripts/build-21st.ts` turns seven picks (Rating, Tag Input, Morphing Search, Hold to Confirm, Expandable Tabs, Stepper, Number Ticker) into self-contained files with the motion tokens inlined and colors mapped to the stock shadcn theme.
- `scripts/build-21st-blocks.ts` bundles six blocks (Agent Run, Onboarding Flow, Revenue Dashboard, Account Settings, Sign In With Code, Mobile App Shell) into single files, inlining every free component each one uses.
- **Reasoning Disclosure** (agents). A model's reasoning that shimmers "Thinking" while it streams, stays pinned to its newest line, and folds into "Thought for 8s" once the answer starts. It times itself or takes a `duration`, and a message loaded from history starts folded.
- Playground curve editor. The Easing tab now has a draggable cubic-bezier editor with presets, keyboard nudging and exact inputs, a lane that races your curve against a known one, and code in Motion, CSS, Tailwind and GSAP.
- Playground share links. The URL keeps the current settings, and a link button copies it, so a tuned curve opens exactly as it was shared.

### Changed

- Site header: the GitHub button shows the live star count next to the icon instead of a "Star" label.
- Playground: preview and code sit beside a sticky controls column on wide screens, with a reset button.
- Stepper: every step now takes an equal share of the row, the last one included, so labels stay centered under their circles.

## [0.1.0] - 2026-10-02

The first public release: 53 components across two categories, a docs site, a
shadcn registry, a hosted MCP server, and an agent skill.

### Added

#### Components

- **Button** with four variants, a quick press, hairline rings, and a 44px tap area at every size. Icons animate on hover.
- **Tabs** in pill, segment, and underline styles with a sliding indicator.
- **Select** whose menu scales out of the trigger and opens upward when there is no room below.
- **Tooltip** with keyboard shortcuts (Command on Mac, Ctrl elsewhere) and an instant crossfade along a toolbar via `TooltipGroup`.
- **Theme Toggle** that reveals the new theme as a growing circle, from the screen center or the button.
- **Range Slider** on a native range input, with a filled track and tick dots.
- **Hold to Confirm** for destructive actions. Fills while held and drains back on early release.
- **Switch** in two sizes. Inside a label, the whole row is the tap target.
- **Copy Button** that swaps its icon for a check, with or without a label.
- **Toast** with reading-time durations, pause on hover or a background tab, a stack that spreads on hover, and swipe to dismiss.
- **Gradient Text** with a drifting rainbow that pauses off screen.
- **Modal** on the native dialog element, with focus kept inside.
- **Skeleton** with one shimmer shared across the page, wrapping real content to take its shape.
- **Accordion** that grows to natural height with no measuring, with arrow key navigation.
- **Checkbox** on a real checkbox input with a check that pops in.
- **Drawer**, a bottom sheet on the native dialog element. Drag or flick to dismiss.
- **Input** with a focus ring that grows from a hairline, and a destructive ring for `aria-invalid`.
- **Textarea** that grows with its content up to a scrollable cap.
- **Badge** in five colors with a crossfade between variants.
- **Progress** that fills with scale, plus an indeterminate state.
- **Card** with header, title, description, content, and footer parts.
- **Avatar** in three sizes with a status dot, image fade-in, initials fallback, and an `AvatarGroup` that fans out on hover.
- **Alert** with a colored accent stripe and neutral body text.
- **Dropdown Menu** that flips upward when needed and supports a destructive item.
- **Command Palette**, a command-K overlay with filtering, groups, and arrow key navigation.
- **Number Ticker** that rolls each changed digit like an odometer.
- **OTP Input** with paste and SMS autofill, a shake for a wrong code, and an `onVerify` mode that runs the check-and-color cycle itself.
- **File Upload**, a dropzone with a native picker, size limits, and an animated file list.
- **Popover** anchored to a trigger, opening on click and flipping when needed.
- **Table** with sortable headers, resizable columns, selected rows, and a loading cell.
- **Selection Actions**, a floating bulk action bar that appears once a selection exists.
- **Insight Card**, a stat tile with an optional trend pill.
- **Diff View** that renders a precomputed line diff.
- **Text Animation** with scramble, reveal, and shimmer variants.
- **Pull to Refresh** that tracks the finger, then resists past the trigger distance.
- **Notification Stack** that fans from a peeking deck into a list on hover or focus.
- **Expandable Tabs**, icon tabs where the selected one expands to show its label.
- **Morphing Search**, a search button that morphs into a text field.
- **Dynamic Island**, a pill that morphs between a compact line and named views.
- **Rating** with hover preview, a fill wave, and native radios for arrow keys.
- **Stepper** with a line that fills as you advance and clickable finished steps.
- **Tag Input** where Enter or a comma adds a tag, Backspace marks then removes, and duplicates shake.

#### Agents components

- **Message Bubble** with tones, alignment, and a tail that pops in.
- **Agent Loading States** with `ShimmerText`, `AgentProgress`, and `ReasoningPhases`.
- **Pixel Loader**, a 3x3 twinkling grid with a shimmering label and an elapsed timer.
- **Todo List**, a collapsible task plan with morphing status marks.
- **Streaming Text** that fades in new text without replaying what is shown.
- **Streaming Response** with copy, replay, share, feedback, and follow-up prompts.
- **Prompt Input**, a growing composer whose send button crossfades into stop.
- **Code Block** with a copy button and light syntax coloring, no highlighter dependency.
- **Tool Approval**, a card whose Approve and Deny collapse into a status pill.
- **Flowchart**, draggable steps on a dotted canvas with live connectors and an if/else editor.
- **Tool Chip**, a pill naming a tool with a status mark that crossfades in place.

#### Site and tooling

- Docs site with a components sidebar, previews, and an API table per component.
- shadcn registry at `/r`, installable as `@easeui/<slug>`, with direct-URL fallback.
- Hosted MCP server at `/api/mcp`, an agent skill in `skills/easeui`, and an agent guide.
- `@shadcn/lint` through oxlint, a registry check, and accessibility tests in CI.
- Links to easeUI Pro and Studio from the free site.

### Fixed

- Layout shift when a modal or drawer opens.
- Progress bar now has a defined track and a value label.
- Avatar fallback contrast and the mobile nav close label.
- Hairline rings on bare `bg-muted` fills for light mode contrast.
- OTP success check now morphs in place instead of popping in beside it.
- Pull to Refresh and Dynamic Island previews no longer restyle through `className`.
- The sidebar stays mounted across navigation.

[Unreleased]: https://github.com/rjcuff/easeui/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/rjcuff/easeui/releases/tag/v0.1.0

# Contributing to easeUI

Thanks for helping out. This guide covers local setup, adding a component, and what a pull request needs.

## Setup

1. Install [Bun](https://bun.sh).
2. Fork and clone the repository.
3. Run `bun install`, then `bun run dev`.
4. Open http://localhost:3000.

## Adding a component

A component needs five pieces. `bun run check:registry` fails if any are missing.

1. **Source file** in `components/motion/<slug>.tsx`. Export the component and its props interface, and document each prop with a short JSDoc comment so it shows up in the API table.
2. **Preview** in `components/previews/motion/<slug>.preview.tsx`, exporting a component such as `ButtonPreview`.
3. **Preview registration** in `components/previews/index.tsx` under the key `motion/<slug>`.
4. **Registry entry** in `lib/registry.ts` with `slug`, `name`, `description`, and `file`. Add `badge: "new"` and `launchedAt` for a new launch.
5. **Dates** in `lib/component-dates.ts` with `publishedAt` and `updatedAt`.

Then run `bun run check` before opening a pull request. That includes
`@shadcn/lint`, which flags restyling a component via `className` instead of
using its variants. See `.oxlintrc.json` for exceptions.

## Motion guidelines

- Animate transform and opacity only. Avoid animating width, height, margin, or padding.
- Enter with an ease-out curve in 150 to 250ms. Exits can be a little faster.
- Start entering elements near their final size, around a scale of 0.95 to 0.97, never from 0.
- Scale an element from the side it comes from, such as a menu growing out of its trigger.
- Press feedback scales to 0.97. Do not scale on hover.
- Skip animation for actions people repeat constantly or trigger from the keyboard.
- Use duration and bounce for springs, and keep bounce at zero unless the interaction is playful.
- Respect reduced motion by turning the animation off completely.
- Use the tokens in `lib/ease.ts` instead of inventing new curves.

## Accessibility

- Keep tap targets at least 44px, using an invisible hit area if the visible control is smaller.
- Support the keyboard. Menus and tabs need arrow keys, and Escape closes overlays.
- Give icon-only buttons an `aria-label`.
- Prefer native elements, such as a real `<button>` or `<input>`, over rebuilt ones.

## Writing style

Site copy, descriptions, and hints should read plainly.

- No em dashes.
- No "Label: text" phrasing in sentences.
- Avoid marketing words like seamless, effortless, or elevate.

## Commits and pull requests

- Use conventional commits, such as `feat: add switch component` or `fix: tooltip position on scroll`.
- Keep each pull request focused on one change.
- Include a short description and a screenshot or recording for visual changes.
- Make sure `bun run check` and `bun run test` pass.

## License

By contributing, you agree that your contributions are licensed under the [MIT License](LICENSE).

# easeUI

Open-source React components with smooth easing and spring animations. Every component is a TypeScript source file you add to your project with the shadcn CLI, so the code is yours to change.

Website: [easeui.dev](https://easeui.dev)

## Components

| Component | What it does |
| --- | --- |
| Button | Quick press feedback, four variants, and a 44px tap area at every size |
| Tabs | Pill, segment, or underline tabs with a sliding indicator and arrow key support |
| Select | Menu that fades and scales out of its trigger, with full keyboard control |
| Tooltip | Opens on hover or focus, and nearby tooltips open instantly after the first |
| Theme Toggle | Reveals the new theme as a circle from the screen center or from the button |
| Range Slider | Native range input with a filled track and tick dots |

## Install a component

Set up the theme tokens once, then add any component.

```bash
npx shadcn@latest init
npx shadcn@latest add https://easeui.dev/r/button.json
```

Each component page on the site also shows the manual install steps and the full source.

## How the motion works

- Animations use transform and opacity only.
- Interface motion stays between 100 and 300ms with ease-out curves.
- Springs use duration and bounce, with bounce at zero for product UI.
- Buttons press to 0.97 and nothing scales on hover.
- Every animation turns off when the operating system asks for reduced motion.

Shared timing tokens live in `lib/ease.ts`.

## Develop locally

Requires [Bun](https://bun.sh).

```bash
bun install
bun run dev
```

The site runs at http://localhost:3000.

| Script | Purpose |
| --- | --- |
| `bun run dev` | Start the Next.js dev server |
| `bun run build` | Production build |
| `bun run typecheck` | TypeScript check |
| `bun run lint` | Biome lint |
| `bun run test` | Unit tests |
| `bun run check:registry` | Validate every registry entry, date, and source file |
| `bun run check` | Typecheck, lint, and registry check together |

## Project structure

```
app/                  Next.js routes, registry endpoints, and pages
components/motion/    The installable components
components/previews/  Live previews shown on the site
components/app/       Site chrome, docs UI, and the playground
lib/registry.ts       Component catalog
lib/ease.ts           Shared motion tokens
```

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).

## License

[MIT](LICENSE)

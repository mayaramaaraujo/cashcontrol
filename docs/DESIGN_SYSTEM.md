# Implementation: Design Tokens + Feature Architecture + Shared UI Primitives

Foundational layer the rest of the app builds on: the visual token scale, the folder structure, and the reusable component set.

## Design tokens (`src/app/globals.css`)

Tailwind CSS v4, CSS-first `@theme` tokens defined in `:root` and mirrored into `@theme inline`:

- **Backgrounds**: `--color-bg-base/elevated/sheet` plus hero/page gradient stops.
- **Text**: `--color-text-primary` down through `--color-text-faintest` (8-step scale) and a dedicated `--color-text-icon`.
- **Brand**: `--color-primary` (pink/mauve) with `-dark`/`-darker`/`-light`/`-muted` steps.
- **Semantic accents**: positive, warning, danger, violet, neutral-accent.
- **Avatar palette**: 6 cycling colors for member/category avatars, exposed as `.avatar-gradient-{1..6}` utility classes.
- **Surfaces**: translucent `--color-surface-{1..4}` steps + border color, for layering over the dark backgrounds.
- **Radii**: `--radius-xs` through `--radius-3xl`.
- **Glow shadows** and two keyframe animations (`cc-sheet-in`, `cc-dim-in`) for the bottom-sheet pattern.

All styling must use these tokens or Tailwind's standard scale — no arbitrary values (`text-[13px]`, `py-3.75`, etc.), per `AGENTS.md`.

Also includes a global browser-autofill override (`input:-webkit-autofill`) so Chrome's opaque light autofill background doesn't clash with the dark theme.

## Architecture

Feature-based, under `src/features/*` (`auth`, `groups`, `income`, `bills`, `dashboard`, `history`), each with its own `components/`, `hooks/`, `api/`, and a `types.ts` holding that feature's shared constants/types (single source of truth — never redeclare a constant in a component). Cross-feature code lives in `src/shared/*`.

## Shared UI primitives (`src/shared/components/`)

- **Avatar** — circular initials badge, cycles through the 6-color avatar palette.
- **Button** — `primary` / `secondary` / `outline` / `danger` variants, `sm` / `md` sizes.
- **Input** — text input with optional leading icon, `invalid` state.
- **Chip** — toggleable pill (category/filter selection).
- **SegmentedControl** — equal-width multi-option track.
- **Sheet** — bottom sheet modal (portal, Escape-to-close, backdrop click, scroll lock).
- **BottomNav** — fixed app-shell nav with a center FAB.

Still to come: **ProgressBar** — add when the first screen that needs it is built.

Before adding a new component, check this list and the relevant feature's own `components/` folder first — see the "Reuse before creating" rule in `AGENTS.md`.

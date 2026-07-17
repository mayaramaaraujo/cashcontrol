<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

<!-- END:nextjs-agent-rules -->

## Code Guidelines

- **Don't over-engineer — always use the simplest, cleanest approach.** Solve the problem in front of you, not the hypothetical future one. Prefer a plain function/component over a generic abstraction, config layer, or extra indirection until at least two real call sites actually need it. Fewer moving parts beats more flexibility nobody asked for.
- **Always check node_modules documentation first** — before implementing any feature or using any API, check the updated documentation in `node_modules/<package>/dist/docs/` or the package's README. Don't rely on training data for version-specific behavior.
- **Use Tailwind CSS tokens only** — use Tailwind utility classes and the design tokens defined in `src/app/globals.css` for styling; no inline styles, arbitrary style objects, or arbitrary values like `text-[22px]`, `py-3.75`, `size-4.5`. Always map to the project's token scale (`text-text-primary`, `bg-surface-2`, `rounded-lg`, etc., or Tailwind's own standard scale where no project token applies).
- **Never use `any` type** — do not disable `// eslint-disable-next-line @typescript-eslint/no-explicit-any` without exhaustive investigation. Only disable if absolutely necessary after exploring all alternatives (proper typing, generics, type unions, type guards, better imports/definitions). Always document why it was unavoidable.
- **Use Lucide icons** — always import icons directly from `lucide-react`. Never write inline SVG markup in components and never create custom SVG icon components. Before using an icon, verify it exists at https://lucide.dev/icons/.
- **Reuse before creating** — before creating any new component, search `src/shared/components/` (see its README for the current list) and the relevant feature's own `components/` folder for something that already does the job or is close enough to extend via props. Never create a duplicate Button/Input/Chip/etc. under a different name or copy-paste-tweak an existing one into a near-identical sibling. If nothing fits, add the new primitive to `src/shared/components/` when it's reusable across features, or the feature's `components/` folder when it's feature-specific — and update that folder's README so the next search finds it.
- **Single source of truth for constants and types** — every shared constant (categories, options lists, enums) must live in its feature's `types.ts`. Never redeclare a constant in a component; always import it. If two features need the same constant, it belongs in `src/shared/lib/`.
- **All IDs must be UUIDs** — use `crypto.randomUUID()` (built into Node 14.17+ and all modern browsers, no package needed) whenever generating an ID in application code. Never use `Date.now()`, random strings, or other non-UUID formats for IDs.
- **One component per file** — every React component must live in its own dedicated file. Never define two or more components (including private sub-components) in the same file. If a component is only used by one parent, place it in the same feature's `components/` folder (or an `_components/` subfolder) and import it.
- **No legacy compatibility code before launch** — the app has not launched yet; there are no real users with old URLs or saved state. Never add redirect shims, backwards-compatibility aliases, or deprecated-route stubs. Delete the old thing cleanly and move on.

## Git Workflow

**ALWAYS create a feature/fix branch, never commit directly to main:**

1. Create a descriptive branch: `git checkout -b feature/description` or `git checkout -b fix/description`
2. Make all commits on the feature branch
3. When ready, create a pull request to merge into main
4. Only merge to main via pull request after all checks pass

This ensures main stays clean, changes are reviewed, and history is clear.

## Pre-Commit Testing Requirements

**ALWAYS run the following before committing:**

1. `npm run lint` — must pass with 0 errors (warnings are acceptable if they're known library limitations)
2. `npx tsc --noEmit` (or `npm run build`) — must succeed with 0 TypeScript errors
3. `npm run test` / `npm run test:integration` — once test scripts exist in `package.json`, all tests must pass. There is no test suite yet; add one alongside the first feature that needs it rather than deferring indefinitely.
4. **Manual testing** — for feature changes, run `npm run dev` and test the feature manually in the browser first (don't rely on tests/typecheck alone)

Only create a commit after all checks pass AND manual testing is complete. This prevents broken code from being committed to main and ensures features work as intended.

# shared/components

Design-system primitives shared across features, built on the tokens in `src/app/globals.css`. Import from `@/shared/components` (barrel in `index.ts`).

- **Avatar** — circular initials badge, cycles through the app's 6-color avatar palette (`colorIndex` 0–5)
- **Button** — `primary` / `secondary` / `outline` / `danger` variants, `sm` / `md` sizes
- **Input** — text input with optional leading icon or `leadingText` (e.g. a "€" currency symbol), `invalid` state
- **DatePicker** — calendar-popup date field (built on `react-datepicker`), value/onChange in `YYYY-MM-DD`, opens a full-screen portal calendar instead of the native OS date input
- **Chip** — toggleable pill (category/filter selection), `selected` + `accent` props
- **SegmentedControl** — equal-width multi-option track (e.g. Income/Bills/Left)
- **Sheet** — bottom sheet modal (portal, Escape-to-close, backdrop click, scroll lock)
- **BottomNav** — fixed app-shell nav with a center FAB
- **ProgressBar** — thin rounded track with a filled bar (`percent` 0-100, optional `color` override)
- **Switch** — small toggle (track + sliding knob), e.g. the bill sheet's "Repeat every month" row
- **LanguageSwitcher** — segmented EN/PT-BR toggle backed by `useTranslation()` from `@/shared/lib/i18n/context`

**Before adding a new component here or in a feature's `components/` folder, check this list (and the feature's own folder) for something that already does the job.** See the "Reuse before creating" rule in `AGENTS.md`.

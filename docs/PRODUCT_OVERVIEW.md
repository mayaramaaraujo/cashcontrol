# CashControl — Product Overview

Shared income/bills tracker for couples and roommates. Group members log what they bring in each month, track shared bills (fixed/variable, paid/pending), and see a combined picture of income, bills, and what's left.

## Status

Design tokens, feature-based architecture skeleton, and the shared design-system primitives (Avatar, Button, Input, Chip, SegmentedControl, Sheet, BottomNav — `src/shared/components/`) are in place. See `docs/DESIGN_SYSTEM.md`. Supabase is wired up and the Login/Signup screens + auth session handling are done — see `docs/AUTH.md`. Group setup, Home/Bills/History/People screens, and the rest of the data model are still to come.

## Implementation docs

Each major implementation has its own writeup in `docs/`:

- [`DESIGN_SYSTEM.md`](./DESIGN_SYSTEM.md) — design tokens, feature-based architecture, shared UI primitives.
- [`AUTH.md`](./AUTH.md) — Supabase auth, Login/Signup UI, session handling, route protection.

## Architecture

- **Framework**: Next.js (App Router), React, TypeScript, Tailwind CSS v4 (CSS-first `@theme` tokens in `src/app/globals.css`)
- **Icons**: [lucide-react](https://lucide.dev/icons/) exclusively — no inline SVG or custom icon components
- **Forms**: `react-hook-form` + `zod` (via `@hookform/resolvers/zod`) — schemas live in each feature's `types.ts`
- **Structure**: feature-based under `src/features/*` (`auth`, `groups`, `income`, `bills`, `dashboard`, `history`), each with `components/`, `hooks/`, `api/`, and a shared constants/types file. Cross-feature primitives live in `src/shared/*`.
- **Backend**: Supabase — auth wired up (`src/shared/lib/supabase/`, `proxy.ts`, `src/app/auth/callback/`); data model not yet built
- **Deploy**: Vercel (planned)
- **PWA**: planned, not yet configured

## Roadmap

1. ~~Design tokens + architecture skeleton~~ (done)
2. ~~Shared design-system primitives (Button, Input, Sheet, Chip, Avatar, SegmentedControl, BottomNav)~~ (done — ProgressBar still to come, add when the first screen that needs it is built)
3. ~~Login/Signup screens + Supabase auth (session handling, route protection, Google OAuth)~~ (done)
4. Screens: Group setup → Home / Bills / History / People
5. Supabase data model (groups, members, income, bills)
6. PWA manifest/service worker
7. Vercel deploy

Update this file whenever a branch changes architecture, features, or this roadmap.

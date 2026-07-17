# CashControl — Product Overview

Shared income/bills tracker for couples and roommates. Group members log what they bring in each month, track shared bills (fixed/variable, paid/pending), and see a combined picture of income, bills, and what's left.

## Status

Design tokens, feature-based architecture skeleton, and the shared design-system primitives (Avatar, Button, Input, Chip, SegmentedControl, Sheet, BottomNav — `src/shared/components/`) are in place. No real screens, auth, or backend yet.

## Architecture

- **Framework**: Next.js (App Router), React, TypeScript, Tailwind CSS v4 (CSS-first `@theme` tokens in `src/app/globals.css`)
- **Icons**: [lucide-react](https://lucide.dev/icons/) exclusively — no inline SVG or custom icon components
- **Structure**: feature-based under `src/features/*` (`auth`, `groups`, `income`, `bills`, `dashboard`, `history`), each with `components/`, `hooks/`, `api/`, and a shared constants/types file. Cross-feature primitives live in `src/shared/*`.
- **Backend**: Supabase (planned — not yet wired up)
- **Deploy**: Vercel (planned)
- **PWA**: planned, not yet configured

## Roadmap

1. ~~Design tokens + architecture skeleton~~ (done)
2. ~~Shared design-system primitives (Button, Input, Sheet, Chip, Avatar, SegmentedControl, BottomNav)~~ (done — ProgressBar still to come, add when the first screen that needs it is built)
3. Screens: Login → Group setup → Home / Bills / History / People
4. Supabase auth + data model
5. PWA manifest/service worker
6. Vercel deploy

Update this file whenever a branch changes architecture, features, or this roadmap.

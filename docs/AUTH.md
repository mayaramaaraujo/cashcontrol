# Implementation: Supabase Auth + Login/Signup

Backend and screens for signing users in and out. Ships email/password auth, session refresh, and route protection. (Google OAuth was tried and removed — see "Removed" below.)

## Backend

- **Provider**: Supabase Auth, via `@supabase/ssr`.
- **`src/shared/lib/supabase/client.ts`** — browser client (`createBrowserClient`) for use in Client Components; syncs the session into cookies itself.
- **`src/shared/lib/supabase/server.ts`** — async server client (`createServerClient`, awaits `cookies()` from `next/headers`) for Server Components and Route Handlers.
- **Env vars**: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` (see `.env.local.example`). Only the anon/public key is used in app code — never the `service_role` secret key.

## Route protection

- **`src/proxy.ts`** — this Next.js fork renames Middleware to Proxy. Must live at `src/proxy.ts` (same level as `src/app`), export a `proxy` function, and runs on the Node.js runtime by default (no `runtime` export).
- On every request it refreshes the session (`supabase.auth.getUser()`) and redirects:
  - Unauthenticated + route outside `/login`, `/signup`, `/auth/callback` → `/login`.
  - Authenticated + visiting `/login` or `/signup` → `/`.
- **`src/app/auth/callback/route.ts`** — `GET` handler that exchanges the OAuth/email `code` query param for a session (`exchangeCodeForSession`), then redirects to `/` (or `/login` on failure).

## Feature code (`src/features/auth/`)

- **`types.ts`** — `loginSchema` / `signupSchema` (zod v4, `z.email()`) and their inferred types. Single source of truth for validation shape. `signupSchema` requires `name`, passed to `supabase.auth.signUp` as `options.data.full_name` (Supabase auth user metadata) — `src/features/groups/api/actions.ts`'s `deriveDisplayName` reads it back when a signed-up user creates/joins a group.
- **`components/AuthShell.tsx`** — shared chrome for both screens (gradient icon badge, heading, subtitle, terms footer). Justified as shared since both Login and Signup use it.
- **`components/LoginForm.tsx`** / **`components/SignupForm.tsx`** — `react-hook-form` + `zodResolver`, built on the existing `Input`/`Button` primitives. Call `supabase.auth.signInWithPassword` / `supabase.auth.signUp` directly from the client. Root-level errors (invalid credentials, rate limits, etc.) surface via `setError("root", ...)`.
- **Pages**: `src/app/login/page.tsx`, `src/app/signup/page.tsx`.

## Removed

- **Google OAuth**: a `GoogleButton` component (`supabase.auth.signInWithOAuth({ provider: "google" })`) was built but removed — the provider is disabled by default in a fresh Supabase project (`external.google: false`) and wasn't enabled/working end-to-end. Email/password is the only sign-in method for now; revisit if/when the Google provider is actually configured in the Supabase dashboard.

## Known external dependencies (not code issues)

- **Signup email rate limiting**: Supabase's built-in email sender is a low-volume dev/test sender (roughly 2–4 emails/hour on free tier). Heavy signup testing will trip "email rate limit exceeded." Fix before real launch by adding a custom SMTP provider under Authentication → Emails → SMTP Settings.

## Explicitly out of scope

- The "Create your group" screen (next roadmap step, not part of this auth slice).
- "Forgot password" — rendered as static text in the design, no route/action wired yet.

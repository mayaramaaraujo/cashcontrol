# Implementation: Supabase Auth + Login/Signup

Backend and screens for signing users in and out. Ships email/password auth plus a wired (but dashboard-gated) Google OAuth path, session refresh, and route protection.

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

- **`types.ts`** — `loginSchema` / `signupSchema` (zod v4, `z.email()`) and their inferred types. Single source of truth for validation shape.
- **`components/AuthShell.tsx`** — shared chrome for both screens (gradient icon badge, heading, subtitle, terms footer). Justified as shared since both Login and Signup use it.
- **`components/LoginForm.tsx`** / **`components/SignupForm.tsx`** — `react-hook-form` + `zodResolver`, built on the existing `Input`/`Button` primitives. Call `supabase.auth.signInWithPassword` / `supabase.auth.signUp` directly from the client. Root-level errors (invalid credentials, rate limits, etc.) surface via `setError("root", ...)`.
- **`components/GoogleButton.tsx`** — shared OAuth button (`supabase.auth.signInWithOAuth({ provider: "google" })`), text-only (no Google "G" mark — lucide has no brand icons and inline SVG is disallowed project-wide).
- **Pages**: `src/app/login/page.tsx`, `src/app/signup/page.tsx`.

## Known external dependencies (not code issues)

- **Google OAuth is disabled by default** in a fresh Supabase project (`external.google: false`). The `GoogleButton` code path is complete but the button will error until the provider is enabled in Supabase dashboard → Authentication → Providers.
- **Signup email rate limiting**: Supabase's built-in email sender is a low-volume dev/test sender (roughly 2–4 emails/hour on free tier). Heavy signup testing will trip "email rate limit exceeded." Fix before real launch by adding a custom SMTP provider under Authentication → Emails → SMTP Settings.

## Explicitly out of scope

- The "Create your group" screen (next roadmap step, not part of this auth slice).
- "Forgot password" — rendered as static text in the design, no route/action wired yet.
- Enabling the Google provider inside the Supabase dashboard — external console step, not something app code can do.

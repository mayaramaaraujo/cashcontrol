# shared/lib/supabase

Supabase client setup:

- **`client.ts`** — `createClient()` using `createBrowserClient` (`@supabase/ssr`), for Client Components.
- **`server.ts`** — async `createClient()` using `createServerClient` (`@supabase/ssr`), for Server Components and Route Handlers. Awaits `cookies()` from `next/headers`.
- **`admin.ts`** — `getAdminClient()`, a lazy-init service-role client (bypasses RLS) for code with no user session, e.g. the bill-reminders cron route. Requires `SUPABASE_SERVICE_ROLE_KEY`.

Requires `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in `.env.local` (see `.env.local.example`).

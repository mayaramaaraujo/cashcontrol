# shared/lib/supabase

Supabase client setup:

- **`client.ts`** — `createClient()` using `createBrowserClient` (`@supabase/ssr`), for Client Components.
- **`server.ts`** — async `createClient()` using `createServerClient` (`@supabase/ssr`), for Server Components and Route Handlers. Awaits `cookies()` from `next/headers`.

Requires `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in `.env.local` (see `.env.local.example`).

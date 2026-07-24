# auth

Login/signup screens and session handling, backed by Supabase Auth (email/password only — Google OAuth was removed, see `docs/AUTH.md`).

- **`types.ts`** — `loginSchema` / `signupSchema` (zod) + inferred form types. `signupSchema` includes `name`, stored as `user_metadata.full_name` on signup and used as the display name when the person later creates/joins a group (`deriveDisplayName` in `src/features/groups/api/actions.ts`).
- **`components/AuthShell.tsx`** — shared chrome (icon badge, heading, subtitle, terms footer) for the login/signup screens.
- **`components/LoginForm.tsx`** / **`components/SignupForm.tsx`** — `react-hook-form` + zod forms; call the Supabase browser client (`src/shared/lib/supabase/client.ts`) directly.
- **`components/LogoutButton.tsx`** / **`components/DeleteAccountButton.tsx`** — account actions, currently surfaced on `/setup`; `api/actions.ts`'s `logout`/`deleteAccount` server actions back them (`deleteAccount` calls the `delete_own_account` Postgres RPC — a security definer function, since deleting an `auth.users` row needs privileges the anon key doesn't have).

Session refresh and route protection live in `src/proxy.ts` (this Next.js fork renamed Middleware to Proxy). The email-confirmation callback lands in `src/app/auth/callback/route.ts`.

See `docs/AUTH.md` for the full implementation writeup.

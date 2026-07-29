# notifications

Web Push subscription management for bill due/overdue reminders (sent by the `bill-reminders` cron, see `src/app/api/cron/bill-reminders/route.ts`).

- `types.ts` — `PushSubscriptionPayload`.
- `lib.ts` — client-side `subscribeToPush`/`unsubscribeFromPush`, registering `public/sw.js` and calling `PushManager.subscribe`.
- `api/actions.ts` — `saveSubscription` (upsert on `endpoint`), `deleteSubscription`.
- `components/NotificationToggle.tsx` — the People page's "Push notifications" row (reuses `shared/components/Switch`). Requests `Notification.requestPermission()` on enable, subscribes, and persists the subscription; unsubscribes and deletes on disable.

Requires `NEXT_PUBLIC_VAPID_PUBLIC_KEY` (and server-side `VAPID_PUBLIC_KEY`/`VAPID_PRIVATE_KEY`/`VAPID_SUBJECT` for the cron's `web-push` sender) — see `.env.local.example`.

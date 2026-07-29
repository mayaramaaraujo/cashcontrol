"use server";

import { createClient } from "@/shared/lib/supabase/server";
import type { PushSubscriptionPayload } from "@/features/notifications/types";

export async function saveSubscription(
  payload: PushSubscriptionPayload,
): Promise<{ error: string } | undefined> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not authenticated" };
  }

  const { error } = await supabase.from("push_subscriptions").upsert(
    {
      user_id: user.id,
      endpoint: payload.endpoint,
      p256dh: payload.p256dh,
      auth: payload.auth,
    },
    { onConflict: "endpoint" },
  );

  if (error) {
    return { error: error.message };
  }
}

export async function deleteSubscription(endpoint: string): Promise<void> {
  const supabase = await createClient();
  await supabase.from("push_subscriptions").delete().eq("endpoint", endpoint);
}

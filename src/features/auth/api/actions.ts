"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/shared/lib/supabase/server";

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}

export async function deleteAccount(): Promise<{ error: string } | undefined> {
  const supabase = await createClient();
  const { error } = await supabase.rpc("delete_own_account");

  if (error) {
    return { error: error.message };
  }

  // The user's auth session may already be invalidated server-side by the
  // account deletion above, so ignore any error here — cookies still get
  // cleared locally either way, and the redirect below is what matters.
  await supabase.auth.signOut().catch(() => {});
  redirect("/login");
}

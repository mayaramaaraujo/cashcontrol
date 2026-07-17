"use server";

import { redirect } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/shared/lib/supabase/server";
import { createGroupSchema, type CreateGroupValues } from "@/features/groups/types";

function deriveDisplayName(user: User) {
  const metaName = user.user_metadata?.full_name ?? user.user_metadata?.name;
  if (typeof metaName === "string" && metaName.trim()) return metaName.trim();

  const localPart = user.email?.split("@")[0] ?? "Member";
  return localPart.charAt(0).toUpperCase() + localPart.slice(1);
}

export async function createGroup(
  values: CreateGroupValues,
): Promise<{ error: string } | undefined> {
  const { name } = createGroupSchema.parse(values);

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not authenticated" };
  }

  const inviteCode = crypto.randomUUID().split("-")[0];

  const { data: group, error: groupError } = await supabase
    .from("groups")
    .insert({ name, invite_code: inviteCode, created_by: user.id })
    .select("id")
    .single();

  if (groupError || !group) {
    return { error: groupError?.message ?? "Failed to create group" };
  }

  const { error: memberError } = await supabase.from("group_members").insert({
    group_id: group.id,
    user_id: user.id,
    display_name: deriveDisplayName(user),
    role: "admin",
    status: "active",
    color_index: 0,
  });

  if (memberError) {
    await supabase.from("groups").delete().eq("id", group.id);
    return { error: memberError.message };
  }

  // Not inside a try/catch in the caller: redirect() throws a special
  // NEXT_REDIRECT signal that must propagate, not be treated as an error.
  redirect("/home");
}

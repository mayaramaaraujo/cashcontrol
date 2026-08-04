"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/shared/lib/supabase/server";
import { getCurrentGroup } from "@/shared/lib/supabase/get-current-group";
import { getResendClient, EMAIL_FROM, EMAIL_SENDING_ENABLED } from "@/shared/lib/resend";
import { isCurrency, type Currency } from "@/shared/lib/currency";
import {
  createGroupSchema,
  inviteByEmailSchema,
  type CreateGroupValues,
  type InviteByEmailValues,
} from "@/features/groups/types";

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

  // A plain insert()+select() here would fail: groups_select requires an
  // active group_members row, which doesn't exist until the second insert
  // below runs, so Postgres rejects reading the just-inserted row back.
  // The RPC does both inserts atomically as security definer, sidestepping
  // that chicken-and-egg RLS check (and rolling back both on any failure).
  const { error: rpcError } = await supabase.rpc("create_group_with_owner", {
    p_name: name,
    p_display_name: deriveDisplayName(user),
  });

  if (rpcError) {
    return { error: rpcError.message };
  }

  // Not inside a try/catch in the caller: redirect() throws a special
  // NEXT_REDIRECT signal that must propagate, not be treated as an error.
  redirect("/home");
}

function deriveNameFromEmail(email: string) {
  const localPart = email.split("@")[0];
  return localPart.charAt(0).toUpperCase() + localPart.slice(1);
}

export async function inviteByEmail(
  values: InviteByEmailValues,
): Promise<{ error: string } | undefined> {
  const { email } = inviteByEmailSchema.parse(values);

  const currentGroup = await getCurrentGroup();
  if (!currentGroup) {
    return { error: "Not in a group" };
  }

  const supabase = await createClient();

  const { count } = await supabase
    .from("group_members")
    .select("id", { count: "exact", head: true })
    .eq("group_id", currentGroup.groupId);

  const { error } = await supabase.from("group_members").insert({
    group_id: currentGroup.groupId,
    invited_email: email,
    display_name: deriveNameFromEmail(email),
    status: "invited",
    color_index: (count ?? 0) % 6,
  });

  if (error) {
    return { error: error.message };
  }

  if (EMAIL_SENDING_ENABLED) {
    const { data: group } = await supabase
      .from("groups")
      .select("invite_code")
      .eq("id", currentGroup.groupId)
      .single();

    if (group?.invite_code) {
      const headersList = await headers();
      const host = headersList.get("host") ?? "";
      const protocol = host.startsWith("localhost") ? "http" : "https";
      const inviteUrl = `${protocol}://${host}/join/${group.invite_code}`;

      // Best-effort: the group_members row is already saved, so a failed
      // email send shouldn't roll back the invite or block the request.
      await getResendClient().emails.send({
        from: EMAIL_FROM,
        to: email,
        subject: `You're invited to join ${currentGroup.groupName} on CashControl`,
        html: `<p>You've been invited to join <strong>${currentGroup.groupName}</strong> on CashControl.</p><p><a href="${inviteUrl}">Accept the invite</a></p>`,
      });
    }
  }

  revalidatePath("/settings");
}

export async function joinGroupByCode(
  inviteCode: string,
): Promise<{ error: string } | undefined> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not authenticated" };
  }

  const { error } = await supabase.rpc("join_group_by_code", {
    p_invite_code: inviteCode,
    p_display_name: deriveDisplayName(user),
  });

  if (error) {
    return { error: error.message };
  }

  redirect("/home");
}

export async function updateGroupCurrency(currency: Currency): Promise<{ error: string } | undefined> {
  if (!isCurrency(currency)) {
    return { error: "Invalid currency" };
  }

  const currentGroup = await getCurrentGroup();
  if (!currentGroup) {
    return { error: "Not in a group" };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("groups")
    .update({ currency })
    .eq("id", currentGroup.groupId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/", "layout");
}

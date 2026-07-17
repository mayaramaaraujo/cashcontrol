import { createClient } from "./server";

export type CurrentGroup = {
  groupId: string;
  groupName: string;
  memberId: string;
  role: "admin" | "member";
};

export async function getCurrentGroup(): Promise<CurrentGroup | null> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data } = await supabase
    .from("group_members")
    .select("id, role, groups(id, name)")
    .eq("user_id", user.id)
    .eq("status", "active")
    .maybeSingle();

  if (!data || !data.groups) return null;

  return {
    groupId: data.groups.id,
    groupName: data.groups.name,
    memberId: data.id,
    role: data.role as "admin" | "member",
  };
}

import { redirect } from "next/navigation";
import { getCurrentGroup } from "@/shared/lib/supabase/get-current-group";
import { createClient } from "@/shared/lib/supabase/server";
import type { GroupMember } from "@/features/groups/types";
import { AppChrome } from "./_components/AppChrome";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const currentGroup = await getCurrentGroup();

  if (!currentGroup) {
    redirect("/setup");
  }

  const supabase = await createClient();
  const { data: memberRows } = await supabase
    .from("group_members")
    .select("id, group_id, user_id, invited_email, display_name, role, color_index, status, created_at")
    .eq("group_id", currentGroup.groupId)
    .eq("status", "active")
    .order("created_at", { ascending: true });

  const members: GroupMember[] = (memberRows ?? []).map((row) => ({
    id: row.id,
    groupId: row.group_id,
    userId: row.user_id,
    invitedEmail: row.invited_email,
    displayName: row.display_name,
    role: row.role as "admin" | "member",
    colorIndex: row.color_index,
    status: row.status as "active" | "invited",
    createdAt: row.created_at,
  }));

  return (
    <AppChrome groupName={currentGroup.groupName} members={members}>
      {children}
    </AppChrome>
  );
}

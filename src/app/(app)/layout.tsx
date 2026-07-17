import { redirect } from "next/navigation";
import { getCurrentGroup } from "@/shared/lib/supabase/get-current-group";
import { createClient } from "@/shared/lib/supabase/server";
import { GROUP_MEMBER_COLUMNS, mapGroupMemberRow } from "@/features/groups/lib";
import { AppChrome } from "./_components/AppChrome";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const currentGroup = await getCurrentGroup();

  if (!currentGroup) {
    redirect("/setup");
  }

  const supabase = await createClient();
  const { data: memberRows } = await supabase
    .from("group_members")
    .select(GROUP_MEMBER_COLUMNS)
    .eq("group_id", currentGroup.groupId)
    .eq("status", "active")
    .order("created_at", { ascending: true });

  const members = (memberRows ?? []).map(mapGroupMemberRow);

  return (
    <AppChrome groupName={currentGroup.groupName} members={members}>
      {children}
    </AppChrome>
  );
}

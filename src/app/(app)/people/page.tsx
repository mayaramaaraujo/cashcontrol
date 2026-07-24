import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { getCurrentGroup } from "@/shared/lib/supabase/get-current-group";
import { createClient } from "@/shared/lib/supabase/server";
import { GROUP_MEMBER_COLUMNS, mapGroupMemberRow } from "@/features/groups/lib";
import type { MemberRow } from "@/features/groups/components/MembersList";
import { InviteLinkCard } from "@/features/groups/components/InviteLinkCard";
import { InviteByEmailForm } from "@/features/groups/components/InviteByEmailForm";
import { MembersList } from "@/features/groups/components/MembersList";
import { LogoutButton } from "@/features/auth/components/LogoutButton";
import { DeleteAccountButton } from "@/features/auth/components/DeleteAccountButton";

function monthRange(month: string) {
  const [year, monthNum] = month.split("-").map(Number);
  const start = new Date(Date.UTC(year, monthNum - 1, 1));
  const end = new Date(Date.UTC(year, monthNum, 1));
  return { start: start.toISOString().slice(0, 10), end: end.toISOString().slice(0, 10) };
}

interface PeoplePageProps {
  searchParams: Promise<{ month?: string }>;
}

export default async function PeoplePage({ searchParams }: PeoplePageProps) {
  const currentGroup = await getCurrentGroup();
  if (!currentGroup) {
    redirect("/setup");
  }

  const { month: monthParam } = await searchParams;
  const now = new Date();
  const month = monthParam ?? `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const { start, end } = monthRange(month);

  const supabase = await createClient();
  const headersList = await headers();
  const host = headersList.get("host") ?? "";
  const protocol = host.startsWith("localhost") ? "http" : "https";

  const [groupRes, membersRes, entriesRes] = await Promise.all([
    supabase.from("groups").select("invite_code").eq("id", currentGroup.groupId).single(),
    supabase
      .from("group_members")
      .select(GROUP_MEMBER_COLUMNS)
      .eq("group_id", currentGroup.groupId)
      .order("created_at", { ascending: true }),
    supabase
      .from("income_entries")
      .select("member_id, amount")
      .eq("group_id", currentGroup.groupId)
      .gte("entry_date", start)
      .lt("entry_date", end),
  ]);

  const members = (membersRes.data ?? []).map(mapGroupMemberRow);

  const totalsByMember = new Map<string, number>();
  for (const entry of entriesRes.data ?? []) {
    totalsByMember.set(entry.member_id, (totalsByMember.get(entry.member_id) ?? 0) + Number(entry.amount));
  }

  const rows: MemberRow[] = members.map((member) => ({
    member,
    isYou: member.id === currentGroup.memberId,
    monthTotal: totalsByMember.get(member.id) ?? 0,
  }));

  const inviteUrl = `${protocol}://${host}/join/${groupRes.data?.invite_code ?? ""}`;

  return (
    <div>
      <InviteLinkCard inviteUrl={inviteUrl} />
      <InviteByEmailForm />
      <MembersList rows={rows} />

      <div className="mt-10 flex items-center justify-between border-t border-surface-border pt-5">
        <LogoutButton />
        <DeleteAccountButton />
      </div>
    </div>
  );
}

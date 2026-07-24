import { Avatar, type AvatarColorIndex } from "@/shared/components/Avatar";
import { getInitials, formatCurrency } from "@/shared/lib/utils";
import type { GroupMember } from "@/features/groups/types";

export interface MemberRow {
  member: GroupMember;
  isYou: boolean;
  monthTotal: number;
}

interface MembersListProps {
  rows: MemberRow[];
}

function roleLabel(member: GroupMember) {
  if (member.status === "invited") return "Invited";
  return member.role === "admin" ? "Admin" : "Member";
}

function roleColorClass(member: GroupMember, isYou: boolean) {
  if (member.status === "invited") return "text-text-subtle";
  if (isYou) return "text-primary-light";
  return "text-neutral-accent";
}

export function MembersList({ rows }: MembersListProps) {
  return (
    <div>
      <p className="mt-6 mb-3 font-display text-base font-semibold text-text-primary">Members</p>
      <div className="flex flex-col gap-2">
        {rows.map(({ member, isYou, monthTotal }) => (
          <div
            key={member.id}
            className="flex items-center gap-3 rounded-2xl border border-surface-border bg-surface-1 p-3.5"
          >
            <Avatar
              initials={getInitials(member.displayName)}
              colorIndex={member.colorIndex as AvatarColorIndex}
              size="lg"
              className={member.status === "invited" ? "opacity-55" : ""}
            />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <span className="truncate text-sm font-semibold text-text-primary">
                  {member.displayName}
                </span>
                {isYou ? (
                  <span className="shrink-0 rounded-sm bg-primary/16 px-1.5 py-0.5 text-xs font-bold text-primary-light">
                    YOU
                  </span>
                ) : null}
              </div>
              <p className="mt-0.5 text-xs text-text-subtle">
                {member.status === "invited" ? "Invitation sent" : `€${formatCurrency(monthTotal)} this month`}
              </p>
            </div>
            <span className={`shrink-0 text-xs font-semibold ${roleColorClass(member, isYou)}`}>
              {roleLabel(member)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

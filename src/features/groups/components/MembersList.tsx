import { Avatar, type AvatarColorIndex } from "@/shared/components/Avatar";
import { getInitials, formatCurrency } from "@/shared/lib/utils";
import { CURRENCY_SYMBOL, type Currency } from "@/shared/lib/currency";
import type { GroupMember } from "@/features/groups/types";
import type { Dictionary } from "@/shared/lib/i18n/dictionaries";

export interface MemberRow {
  member: GroupMember;
  isYou: boolean;
  monthTotal: number;
}

interface MembersListProps {
  rows: MemberRow[];
  dict: Dictionary;
  currency: Currency;
}

function roleLabel(member: GroupMember, dict: Dictionary) {
  if (member.status === "invited") return dict.people.invited;
  return member.role === "admin" ? dict.people.admin : dict.people.member;
}

function roleColorClass(member: GroupMember, isYou: boolean) {
  if (member.status === "invited") return "text-text-subtle";
  if (isYou) return "text-primary-light";
  return "text-neutral-accent";
}

export function MembersList({ rows, dict, currency }: MembersListProps) {
  return (
    <div>
      <p className="mt-6 mb-3 font-display text-base font-semibold text-text-primary">{dict.people.members}</p>
      <div className="flex flex-col gap-2">
        {rows.map(({ member, isYou, monthTotal }) => (
          <div
            key={member.id}
            className="flex items-center gap-3 rounded-lg border border-surface-border bg-surface-1 p-3.5"
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
                  <span className="shrink-0 rounded bg-primary/16 px-1.5 py-0.5 text-xs font-bold text-primary-light">
                    {dict.people.you}
                  </span>
                ) : null}
              </div>
              <p className="mt-0.5 text-xs text-text-subtle">
                {member.status === "invited"
                  ? dict.people.invitationSent
                  : dict.people.thisMonth(`${CURRENCY_SYMBOL[currency]}${formatCurrency(monthTotal, currency)}`)}
              </p>
            </div>
            <span className={`shrink-0 text-xs font-semibold ${roleColorClass(member, isYou)}`}>
              {roleLabel(member, dict)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

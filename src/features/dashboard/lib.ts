import type { AvatarColorIndex } from "@/shared/components/Avatar";
import { formatCurrency } from "@/shared/lib/utils";
import type { GroupMember } from "@/features/groups/types";
import type { IncomeEntry } from "@/features/income/types";
import type { Bill } from "@/features/bills/types";

export type SummaryMode = "income" | "bills" | "left";

export interface HeroData {
  label: string;
  value: number;
  colorClass: string;
  sub: string;
}

export function computeHero(
  entries: IncomeEntry[],
  bills: Bill[],
  activeMemberCount: number,
): Record<SummaryMode, HeroData> {
  const incomeTotal = entries.reduce((sum, e) => sum + e.amount, 0);
  const billsTotal = bills.reduce((sum, b) => sum + b.amount, 0);
  const billsPaid = bills.filter((b) => b.paid).reduce((sum, b) => sum + b.amount, 0);
  const billsPending = billsTotal - billsPaid;
  const left = incomeTotal - billsTotal;
  const leftPositive = left >= 0;

  return {
    income: {
      label: "COMBINED INCOME",
      value: incomeTotal,
      colorClass: "text-text-primary",
      sub: `${activeMemberCount} ${activeMemberCount === 1 ? "person" : "people"} contributing this month`,
    },
    bills: {
      label: "TOTAL BILLS",
      value: billsTotal,
      colorClass: "text-text-primary",
      sub: `€${formatCurrency(billsPaid)} paid · €${formatCurrency(billsPending)} pending`,
    },
    left: {
      label: "LEFT AFTER BILLS",
      value: Math.abs(left),
      colorClass: leftPositive ? "text-positive" : "text-danger",
      sub: leftPositive ? "On track for this month" : "Bills exceed income this month",
    },
  };
}

export interface MemberStripEntry {
  id: string;
  name: string;
  colorIndex: AvatarColorIndex;
  amount: number;
}

export function computeMemberStrip(
  members: GroupMember[],
  entries: IncomeEntry[],
): MemberStripEntry[] {
  const totalsByMember = new Map<string, number>();
  for (const entry of entries) {
    totalsByMember.set(entry.memberId, (totalsByMember.get(entry.memberId) ?? 0) + entry.amount);
  }

  return members.map((member) => ({
    id: member.id,
    name: member.displayName,
    colorIndex: member.colorIndex as AvatarColorIndex,
    amount: totalsByMember.get(member.id) ?? 0,
  }));
}

export type ActivityFilter = "all" | "income" | "bills";

export interface ActivityItem {
  id: string;
  isIncome: boolean;
  title: string;
  sub: string;
  amount: number;
  amountColorClass: string;
  date: string;
}

export function buildIncomeActivity(
  entries: IncomeEntry[],
  members: GroupMember[],
): ActivityItem[] {
  const memberById = new Map(members.map((m) => [m.id, m]));

  return entries.map((entry) => {
    const member = memberById.get(entry.memberId);
    const dateLabel = new Date(entry.entryDate).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
    const parts = [member?.displayName ?? "Member", dateLabel];
    if (entry.note) parts.push(entry.note);

    return {
      id: entry.id,
      isIncome: true,
      title: entry.category,
      sub: parts.join(" · "),
      amount: entry.amount,
      amountColorClass: "text-positive",
      date: entry.entryDate,
    };
  });
}

export function buildBillActivity(bills: Bill[], month: string): ActivityItem[] {
  return bills.map((bill) => ({
    id: bill.id,
    isIncome: false,
    title: bill.name,
    sub: `${bill.category} · due day ${bill.dueDay}${bill.paid ? " · paid" : " · pending"}`,
    amount: bill.amount,
    amountColorClass: bill.paid ? "text-text-subtle" : "text-warning",
    date: `${month}-${String(bill.dueDay).padStart(2, "0")}`,
  }));
}

export function mergeActivity(income: ActivityItem[], bills: ActivityItem[]): ActivityItem[] {
  return [...income, ...bills].sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
}

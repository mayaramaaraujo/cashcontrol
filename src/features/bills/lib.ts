import type { Database } from "@/shared/lib/supabase/database.types";
import { BILL_CATEGORY_COLORS, type Bill, type BillCategory } from "@/features/bills/types";
import type { CategoryBreakdownRow } from "@/shared/components/CategoryBreakdown";

export const BILL_COLUMNS =
  "id, group_id, name, category, amount, due_day, fixed, paid, paid_at, repeat_monthly, created_at" as const;

type BillRow = Database["public"]["Tables"]["bills"]["Row"];

export function mapBillRow(row: BillRow): Bill {
  return {
    id: row.id,
    groupId: row.group_id,
    name: row.name,
    category: row.category,
    amount: Number(row.amount),
    dueDay: row.due_day,
    fixed: row.fixed,
    paid: row.paid,
    paidAt: row.paid_at,
    repeatMonthly: row.repeat_monthly,
    createdAt: row.created_at,
  };
}

export type BillDueStatus = "upcoming" | "due-soon" | "overdue";

export interface BillDueInfo {
  status: BillDueStatus;
  nextDueDate: string; // ISO yyyy-mm-dd, clamped to the month's last day
  daysUntilDue: number; // negative once overdue
  isPaidThisCycle: boolean;
}

function isSameMonth(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();
}

function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function toIsoDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function getBillDueInfo(
  bill: Pick<Bill, "dueDay" | "paid" | "paidAt" | "repeatMonthly">,
  today: Date = new Date(),
  dueSoonThresholdDays = 3,
): BillDueInfo {
  const todayStart = startOfDay(today);

  const isPaidThisCycle = bill.repeatMonthly
    ? bill.paid && bill.paidAt != null && isSameMonth(new Date(bill.paidAt), todayStart)
    : bill.paid;

  const daysInMonth = new Date(todayStart.getFullYear(), todayStart.getMonth() + 1, 0).getDate();
  const effectiveDay = Math.min(bill.dueDay, daysInMonth);
  const nextDueDate = new Date(todayStart.getFullYear(), todayStart.getMonth(), effectiveDay);

  const msPerDay = 24 * 60 * 60 * 1000;
  const daysUntilDue = Math.round((nextDueDate.getTime() - todayStart.getTime()) / msPerDay);

  let status: BillDueStatus = "upcoming";
  if (!isPaidThisCycle) {
    if (daysUntilDue < 0) status = "overdue";
    else if (daysUntilDue <= dueSoonThresholdDays) status = "due-soon";
  }

  return {
    status: isPaidThisCycle ? "upcoming" : status,
    nextDueDate: toIsoDate(nextDueDate),
    daysUntilDue,
    isPaidThisCycle,
  };
}

export interface BillsSummary {
  paidTotal: number;
  pendingTotal: number;
  percentPaid: number;
}

export function computeBillsSummary(bills: Bill[]): BillsSummary {
  const total = bills.reduce((sum, b) => sum + b.amount, 0);
  const paidTotal = bills
    .filter((b) => getBillDueInfo(b).isPaidThisCycle)
    .reduce((sum, b) => sum + b.amount, 0);
  const pendingTotal = total - paidTotal;
  const percentPaid = total === 0 ? 0 : Math.round((paidTotal / total) * 100);

  return { paidTotal, pendingTotal, percentPaid };
}

/** Paid bills for the current cycle, grouped by category, sorted descending. */
export function computeCategoryBreakdown(bills: Bill[]): CategoryBreakdownRow[] {
  const paidBills = bills.filter((b) => getBillDueInfo(b).isPaidThisCycle);
  const total = paidBills.reduce((sum, b) => sum + b.amount, 0);

  const totalsByCategory = new Map<string, number>();
  for (const bill of paidBills) {
    totalsByCategory.set(bill.category, (totalsByCategory.get(bill.category) ?? 0) + bill.amount);
  }

  return Array.from(totalsByCategory.entries())
    .sort(([, a], [, b]) => b - a)
    .map(([category, amount]) => ({
      category,
      accent: BILL_CATEGORY_COLORS[category as BillCategory] ?? "neutral-accent",
      amount,
      percent: total === 0 ? 0 : Math.round((amount / total) * 100),
    }));
}

export type BillFilter = "all" | "fixed" | "variable";

export function filterBills(bills: Bill[], filter: BillFilter): Bill[] {
  if (filter === "fixed") return bills.filter((b) => b.fixed);
  if (filter === "variable") return bills.filter((b) => !b.fixed);
  return bills;
}

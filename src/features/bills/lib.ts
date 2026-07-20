import type { Database } from "@/shared/lib/supabase/database.types";
import type { Bill } from "@/features/bills/types";

export const BILL_COLUMNS =
  "id, group_id, name, category, amount, due_day, fixed, paid, repeat_monthly, created_at" as const;

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
    repeatMonthly: row.repeat_monthly,
    createdAt: row.created_at,
  };
}

export interface BillsSummary {
  paidTotal: number;
  pendingTotal: number;
  percentPaid: number;
}

export function computeBillsSummary(bills: Bill[]): BillsSummary {
  const total = bills.reduce((sum, b) => sum + b.amount, 0);
  const paidTotal = bills.filter((b) => b.paid).reduce((sum, b) => sum + b.amount, 0);
  const pendingTotal = total - paidTotal;
  const percentPaid = total === 0 ? 0 : Math.round((paidTotal / total) * 100);

  return { paidTotal, pendingTotal, percentPaid };
}

export type BillFilter = "all" | "fixed" | "variable";

export function filterBills(bills: Bill[], filter: BillFilter): Bill[] {
  if (filter === "fixed") return bills.filter((b) => b.fixed);
  if (filter === "variable") return bills.filter((b) => !b.fixed);
  return bills;
}

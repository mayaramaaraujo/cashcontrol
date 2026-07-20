"use client";

import { useState } from "react";
import { Repeat } from "lucide-react";
import { Chip } from "@/shared/components/Chip";
import { formatCurrency } from "@/shared/lib/utils";
import { filterBills, type BillFilter } from "@/features/bills/lib";
import { BILL_CATEGORY_COLORS, type Bill, type BillCategory } from "@/features/bills/types";
import { BillSheet } from "@/features/bills/components/BillSheet";
import { PaidToggle } from "@/features/bills/components/PaidToggle";

interface BillsListProps {
  bills: Bill[];
}

const FILTERS: { value: BillFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "fixed", label: "Fixed" },
  { value: "variable", label: "Variable" },
];

const DOT_BG_CLASSES: Record<string, string> = {
  primary: "bg-primary",
  "positive-dark": "bg-positive-dark",
  violet: "bg-violet",
  warning: "bg-warning",
  "neutral-accent": "bg-neutral-accent",
};

function categoryDotClass(category: string) {
  const accent = BILL_CATEGORY_COLORS[category as BillCategory];
  return DOT_BG_CLASSES[accent] ?? "bg-neutral-accent";
}

export function BillsList({ bills }: BillsListProps) {
  const [filter, setFilter] = useState<BillFilter>("all");
  const [editingBillId, setEditingBillId] = useState<string | null>(null);

  const visible = filterBills(bills, filter);
  const editingBill = bills.find((b) => b.id === editingBillId);

  if (bills.length === 0) {
    return (
      <p className="mt-6 rounded-2xl border border-surface-border bg-surface-1 p-6 text-center text-sm text-text-subtle">
        No bills yet — add one to get started.
      </p>
    );
  }

  return (
    <div>
      <div className="mt-6 flex gap-1.5">
        {FILTERS.map((f) => (
          <Chip key={f.value} selected={filter === f.value} onClick={() => setFilter(f.value)}>
            {f.label}
          </Chip>
        ))}
      </div>

      <div className="mt-3 flex flex-col gap-2">
        {visible.map((bill) => (
          <div
            key={bill.id}
            className="flex items-center gap-3 rounded-2xl border border-surface-border bg-surface-1 p-3.5"
          >
            <PaidToggle bill={bill} />
            <button
              type="button"
              onClick={() => setEditingBillId(bill.id)}
              className="flex min-w-0 flex-1 items-center gap-2.5 text-left"
            >
              <span className={`size-1.5 shrink-0 rounded-full ${categoryDotClass(bill.category)}`} />
              <div className="min-w-0">
                <span className="text-sm font-semibold text-text-primary">{bill.name}</span>
                <p className="mt-0.5 flex items-center gap-1 truncate text-xs text-text-subtle">
                  {bill.category} · due {bill.dueDay}
                  {bill.repeatMonthly ? <Repeat className="size-3" /> : null}
                </p>
              </div>
            </button>
            <span
              className={`font-display text-sm font-bold ${bill.paid ? "text-positive" : "text-text-primary"}`}
            >
              €{formatCurrency(bill.amount)}
            </span>
          </div>
        ))}
      </div>

      <BillSheet
        open={!!editingBillId}
        bill={editingBill}
        onClose={() => setEditingBillId(null)}
      />
    </div>
  );
}

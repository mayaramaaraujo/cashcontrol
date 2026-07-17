"use client";

import { useState } from "react";
import { ArrowUp, ArrowDown } from "lucide-react";
import { Chip } from "@/shared/components/Chip";
import { formatCurrency } from "@/shared/lib/utils";
import { mergeActivity, type ActivityItem, type ActivityFilter } from "@/features/dashboard/lib";

interface ActivitySectionProps {
  incomeItems: ActivityItem[];
  billItems: ActivityItem[];
}

const FILTERS: { value: ActivityFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "income", label: "Income" },
  { value: "bills", label: "Bills" },
];

export function ActivitySection({ incomeItems, billItems }: ActivitySectionProps) {
  const [filter, setFilter] = useState<ActivityFilter>("all");

  const filtered =
    filter === "income" ? incomeItems : filter === "bills" ? billItems : mergeActivity(incomeItems, billItems);
  const visible = filtered.slice(0, 8);

  return (
    <div>
      <div className="mt-6 mb-3 flex items-center justify-between">
        <p className="font-display text-base font-semibold text-text-primary">Activity</p>
        <div className="flex gap-1.5">
          {FILTERS.map((f) => (
            <Chip key={f.value} selected={filter === f.value} onClick={() => setFilter(f.value)}>
              {f.label}
            </Chip>
          ))}
        </div>
      </div>

      {visible.length === 0 ? (
        <p className="rounded-2xl border border-surface-border bg-surface-1 p-4 text-center text-sm text-text-subtle">
          Nothing here for this filter yet.
        </p>
      ) : (
        <div className="flex flex-col gap-2">
          {visible.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-3 rounded-2xl border border-surface-border bg-surface-1 p-3"
            >
              <span
                className={`flex size-9 shrink-0 items-center justify-center rounded-xl ${
                  item.isIncome ? "bg-positive/14" : "bg-warning/14"
                }`}
              >
                {item.isIncome ? (
                  <ArrowUp className="size-4 text-positive" />
                ) : (
                  <ArrowDown className="size-4 text-warning" />
                )}
              </span>
              <div className="min-w-0 flex-1">
                <span className="text-sm font-semibold text-text-primary">{item.title}</span>
                <p className="mt-0.5 truncate text-xs text-text-subtle">{item.sub}</p>
              </div>
              <span className={`font-display text-sm font-bold ${item.amountColorClass}`}>
                {item.isIncome ? "+" : "−"}€{formatCurrency(item.amount)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

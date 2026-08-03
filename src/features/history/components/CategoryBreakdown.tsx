import { ProgressBar } from "@/shared/components/ProgressBar";
import { formatCurrency } from "@/shared/lib/utils";
import { CURRENCY_SYMBOL, type Currency } from "@/shared/lib/currency";
import type { CategoryBreakdownRow } from "@/features/history/lib";
import type { IncomeCategory } from "@/features/income/types";
import type { Dictionary } from "@/shared/lib/i18n/dictionaries";

interface CategoryBreakdownProps {
  monthLabel: string;
  rows: CategoryBreakdownRow[];
  dict: Dictionary;
  currency: Currency;
}

const ACCENT_BG_CLASSES: Record<string, string> = {
  "avatar-1": "bg-avatar-1",
  "avatar-2": "bg-avatar-2",
  "avatar-3": "bg-avatar-3",
  "avatar-4": "bg-avatar-4",
  "avatar-5": "bg-avatar-5",
  "neutral-accent": "bg-neutral-accent",
};

export function CategoryBreakdown({ monthLabel, rows, dict, currency }: CategoryBreakdownProps) {
  return (
    <div>
      <p className="mt-6 mb-3 font-display text-base font-semibold text-text-primary">
        {dict.history.byCategory(monthLabel)}
      </p>
      {rows.length === 0 ? (
        <p className="rounded-2xl border border-surface-border bg-surface-1 p-6 text-center text-sm text-text-subtle">
          {dict.history.noIncomeThisMonth}
        </p>
      ) : (
        <div className="flex flex-col gap-3.5 rounded-xl border border-surface-border bg-surface-1 p-4">
          {rows.map((row) => (
            <div key={row.category}>
              <div className="mb-1.5 flex items-center justify-between">
                <span className="flex items-center gap-2 text-xs font-semibold text-text-secondary">
                  <span className={`size-2 rounded ${ACCENT_BG_CLASSES[row.accent] ?? "bg-neutral-accent"}`} />
                  {dict.categories.income[row.category as IncomeCategory] ?? row.category}
                </span>
                <span className="text-xs font-semibold text-text-tertiary">
                  {CURRENCY_SYMBOL[currency]}{formatCurrency(row.amount, currency)}
                </span>
              </div>
              <ProgressBar
                percent={row.percent}
                color={ACCENT_BG_CLASSES[row.accent] ?? "bg-neutral-accent"}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

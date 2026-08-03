import { ProgressBar } from "@/shared/components/ProgressBar";
import { formatCurrency } from "@/shared/lib/utils";
import { CURRENCY_SYMBOL, type Currency } from "@/shared/lib/currency";

export interface CategoryBreakdownRow {
  category: string;
  accent: string;
  amount: number;
  percent: number;
}

interface CategoryBreakdownProps {
  title: string;
  rows: CategoryBreakdownRow[];
  emptyMessage: string;
  categoryLabel: (category: string) => string;
  currency: Currency;
}

const ACCENT_BG_CLASSES: Record<string, string> = {
  primary: "bg-primary",
  positive: "bg-positive",
  "positive-dark": "bg-positive-dark",
  warning: "bg-warning",
  violet: "bg-violet",
  "avatar-1": "bg-avatar-1",
  "avatar-2": "bg-avatar-2",
  "avatar-3": "bg-avatar-3",
  "avatar-4": "bg-avatar-4",
  "avatar-5": "bg-avatar-5",
  "neutral-accent": "bg-neutral-accent",
};

export function CategoryBreakdown({ title, rows, emptyMessage, categoryLabel, currency }: CategoryBreakdownProps) {
  return (
    <div>
      <p className="mt-6 mb-3 font-display text-base font-semibold text-text-primary">{title}</p>
      {rows.length === 0 ? (
        <p className="rounded-2xl border border-surface-border bg-surface-1 p-6 text-center text-sm text-text-subtle">
          {emptyMessage}
        </p>
      ) : (
        <div className="flex flex-col gap-3.5 rounded-xl border border-surface-border bg-surface-1 p-4">
          {rows.map((row) => (
            <div key={row.category}>
              <div className="mb-1.5 flex items-center justify-between">
                <span className="flex items-center gap-2 text-xs font-semibold text-text-secondary">
                  <span className={`size-2 rounded ${ACCENT_BG_CLASSES[row.accent] ?? "bg-neutral-accent"}`} />
                  {categoryLabel(row.category)}
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

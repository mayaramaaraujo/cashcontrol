import { formatCurrency } from "@/shared/lib/utils";
import type { EarlierMonth } from "@/features/history/lib";

interface EarlierMonthsProps {
  months: EarlierMonth[];
}

export function EarlierMonths({ months }: EarlierMonthsProps) {
  return (
    <div>
      <p className="mt-6 mb-3 font-display text-base font-semibold text-text-primary">
        Earlier months
      </p>
      {months.length === 0 ? (
        <p className="rounded-2xl border border-surface-border bg-surface-1 p-6 text-center text-sm text-text-subtle">
          No history yet.
        </p>
      ) : (
        <div className="flex flex-col gap-2">
          {months.map((point) => (
            <div
              key={point.month}
              className="flex items-center justify-between rounded-2xl border border-surface-border bg-surface-1 p-3.5"
            >
              <span className="text-sm font-semibold text-text-primary">{point.label}</span>
              <span className="font-display text-sm font-bold text-text-primary">
                €{formatCurrency(point.total)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

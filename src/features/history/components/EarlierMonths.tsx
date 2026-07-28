import { formatCurrency } from "@/shared/lib/utils";
import type { EarlierMonth } from "@/features/history/lib";
import type { Dictionary } from "@/shared/lib/i18n/dictionaries";

interface EarlierMonthsProps {
  months: EarlierMonth[];
  dict: Dictionary;
}

export function EarlierMonths({ months, dict }: EarlierMonthsProps) {
  return (
    <div>
      <p className="mt-6 mb-3 font-display text-base font-semibold text-text-primary">
        {dict.history.earlierMonths}
      </p>
      {months.length === 0 ? (
        <p className="rounded-2xl border border-surface-border bg-surface-1 p-6 text-center text-sm text-text-subtle">
          {dict.history.noHistory}
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

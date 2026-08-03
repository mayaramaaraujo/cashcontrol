import { ProgressBar } from "@/shared/components/ProgressBar";
import { formatCurrency } from "@/shared/lib/utils";
import { CURRENCY_SYMBOL, type Currency } from "@/shared/lib/currency";
import type { BillsSummary as BillsSummaryData } from "@/features/bills/lib";
import type { Dictionary } from "@/shared/lib/i18n/dictionaries";

interface BillsSummaryProps {
  summary: BillsSummaryData;
  dict: Dictionary;
  currency: Currency;
}

export function BillsSummary({ summary, dict, currency }: BillsSummaryProps) {
  const { paidTotal, pendingTotal, percentPaid } = summary;
  const symbol = CURRENCY_SYMBOL[currency];

  return (
    <div>
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-lg border border-surface-border bg-surface-1 p-3.5">
          <p className="text-xs text-text-subtle">{dict.bills.paid}</p>
          <p className="mt-1.5 font-display text-xl font-bold text-positive">
            {symbol}{formatCurrency(paidTotal, currency)}
          </p>
        </div>
        <div className="rounded-lg border border-surface-border bg-surface-1 p-3.5">
          <p className="text-xs text-text-subtle">{dict.bills.pending}</p>
          <p className="mt-1.5 font-display text-xl font-bold text-warning">
            {symbol}{formatCurrency(pendingTotal, currency)}
          </p>
        </div>
      </div>

      <div className="mt-2.5">
        <ProgressBar percent={percentPaid} color="bg-gradient-to-r from-positive to-positive-dark" />
        <p className="mt-2 text-xs text-text-subtle">{dict.bills.percentPaid(percentPaid)}</p>
      </div>
    </div>
  );
}

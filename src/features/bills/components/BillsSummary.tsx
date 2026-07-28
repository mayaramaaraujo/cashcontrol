import { ProgressBar } from "@/shared/components/ProgressBar";
import { formatCurrency } from "@/shared/lib/utils";
import type { BillsSummary as BillsSummaryData } from "@/features/bills/lib";
import type { Dictionary } from "@/shared/lib/i18n/dictionaries";

interface BillsSummaryProps {
  summary: BillsSummaryData;
  dict: Dictionary;
}

export function BillsSummary({ summary, dict }: BillsSummaryProps) {
  const { paidTotal, pendingTotal, percentPaid } = summary;

  return (
    <div>
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-2xl border border-surface-border bg-surface-1 p-4">
          <p className="text-xs font-semibold text-text-subtle">{dict.bills.paid}</p>
          <p className="mt-1.5 font-display text-xl font-bold text-positive">
            €{formatCurrency(paidTotal)}
          </p>
        </div>
        <div className="rounded-2xl border border-surface-border bg-surface-1 p-4">
          <p className="text-xs font-semibold text-text-subtle">{dict.bills.pending}</p>
          <p className="mt-1.5 font-display text-xl font-bold text-warning">
            €{formatCurrency(pendingTotal)}
          </p>
        </div>
      </div>

      <div className="mt-4">
        <ProgressBar percent={percentPaid} color="bg-gradient-to-r from-positive to-positive-dark" />
        <p className="mt-2 text-xs text-text-subtle">{dict.bills.percentPaid(percentPaid)}</p>
      </div>
    </div>
  );
}

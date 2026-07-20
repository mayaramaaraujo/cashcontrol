"use client";

import { useTransition } from "react";
import { Check } from "lucide-react";
import { toggleBillPaid } from "@/features/bills/api/actions";
import type { Bill } from "@/features/bills/types";

interface PaidToggleProps {
  bill: Bill;
}

export function PaidToggle({ bill }: PaidToggleProps) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      type="button"
      aria-label={bill.paid ? "Mark as unpaid" : "Mark as paid"}
      disabled={isPending}
      onClick={() => startTransition(() => toggleBillPaid(bill.id, !bill.paid))}
      className={`flex size-6 shrink-0 items-center justify-center rounded-md border transition-colors disabled:opacity-50 ${
        bill.paid ? "border-positive bg-positive text-white" : "border-surface-4 bg-transparent text-transparent"
      }`}
    >
      <Check className="size-3.5" />
    </button>
  );
}

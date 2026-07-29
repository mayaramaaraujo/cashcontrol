"use client";

import { useTransition } from "react";
import { SegmentedControl } from "@/shared/components/SegmentedControl";
import { updateGroupCurrency } from "@/features/groups/api/actions";
import { CURRENCIES, CURRENCY_LABEL, type Currency } from "@/shared/lib/currency";

interface CurrencySwitcherProps {
  currency: Currency;
}

export function CurrencySwitcher({ currency }: CurrencySwitcherProps) {
  const [isPending, startTransition] = useTransition();

  return (
    <SegmentedControl<Currency>
      value={currency}
      onChange={(next) =>
        startTransition(async () => {
          await updateGroupCurrency(next);
        })
      }
      options={CURRENCIES.map((value) => ({ value, label: CURRENCY_LABEL[value] }))}
      className={isPending ? "opacity-60" : ""}
    />
  );
}

import { currencyGroupingLocale, type Currency } from "@/shared/lib/currency";

/** Formats a number as the design's currency string, e.g. 1234 -> "1.234" (grouping only, no symbol — the symbol is rendered separately). */
export function formatCurrency(amount: number, currency: Currency): string {
  return amount.toLocaleString(currencyGroupingLocale(currency));
}

/** Uppercase initial(s) for an avatar, e.g. "Elena" -> "E". */
export function getInitials(name: string): string {
  return name.charAt(0).toUpperCase();
}


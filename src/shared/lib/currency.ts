export const CURRENCIES = ["EUR", "BRL"] as const;

export type Currency = (typeof CURRENCIES)[number];

export const DEFAULT_CURRENCY: Currency = "EUR";

export const CURRENCY_SYMBOL: Record<Currency, string> = {
  EUR: "€",
  BRL: "R$",
};

export const CURRENCY_LABEL: Record<Currency, string> = {
  EUR: "Euro (€)",
  BRL: "Real (R$)",
};

/** Locale used only for toLocaleString grouping — both use period thousands, comma decimal. */
const CURRENCY_GROUPING_LOCALE: Record<Currency, string> = {
  EUR: "de-DE",
  BRL: "pt-BR",
};

export function isCurrency(value: string): value is Currency {
  return (CURRENCIES as readonly string[]).includes(value);
}

export function currencyGroupingLocale(currency: Currency): string {
  return CURRENCY_GROUPING_LOCALE[currency];
}

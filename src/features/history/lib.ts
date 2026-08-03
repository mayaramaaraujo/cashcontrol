import { INCOME_CATEGORY_COLORS, type IncomeCategory } from "@/features/income/types";
import type { CategoryBreakdownRow } from "@/shared/components/CategoryBreakdown";

export interface MonthEntry {
  category: string;
  amount: number;
  entryDate: string;
}

/** The `month` value (e.g. "2026-06") plus the 5 preceding months, oldest first. */
export function lastSixMonths(month: string): string[] {
  const [year, monthNum] = month.split("-").map(Number);
  return Array.from({ length: 6 }, (_, i) => {
    const d = new Date(Date.UTC(year, monthNum - 1 - (5 - i), 1));
    return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`;
  });
}

export function monthLabel(month: string, withYear = false, intlLocale = "en-US"): string {
  const [year, monthNum] = month.split("-").map(Number);
  const d = new Date(Date.UTC(year, monthNum - 1, 1));
  return d.toLocaleDateString(intlLocale, { month: "short", year: withYear ? "numeric" : undefined });
}

export interface TrendPoint {
  month: string;
  label: string;
  total: number;
  percentOfMax: number;
  isCurrent: boolean;
}

export function computeTrend(
  entries: MonthEntry[],
  months: string[],
  currentMonth: string,
  intlLocale = "en-US",
): TrendPoint[] {
  const totalsByMonth = new Map<string, number>();
  for (const entry of entries) {
    const month = entry.entryDate.slice(0, 7);
    totalsByMonth.set(month, (totalsByMonth.get(month) ?? 0) + entry.amount);
  }

  const totals = months.map((month) => totalsByMonth.get(month) ?? 0);
  const max = Math.max(...totals, 1);

  return months.map((month, i) => ({
    month,
    label: monthLabel(month, false, intlLocale),
    total: totals[i],
    percentOfMax: Math.round((totals[i] / max) * 100),
    isCurrent: month === currentMonth,
  }));
}

export interface EarlierMonth {
  month: string;
  label: string;
  total: number;
}

/** The trend's non-current months, most recent first, with year-qualified labels. */
export function earlierMonths(trend: TrendPoint[], intlLocale = "en-US"): EarlierMonth[] {
  return trend
    .filter((point) => !point.isCurrent)
    .map((point) => ({ month: point.month, label: monthLabel(point.month, true, intlLocale), total: point.total }))
    .reverse();
}

export function computeCategoryBreakdown(entries: MonthEntry[], month: string): CategoryBreakdownRow[] {
  const monthEntries = entries.filter((e) => e.entryDate.slice(0, 7) === month);
  const total = monthEntries.reduce((sum, e) => sum + e.amount, 0);

  const totalsByCategory = new Map<string, number>();
  for (const entry of monthEntries) {
    totalsByCategory.set(entry.category, (totalsByCategory.get(entry.category) ?? 0) + entry.amount);
  }

  return Array.from(totalsByCategory.entries())
    .sort(([, a], [, b]) => b - a)
    .map(([category, amount]) => ({
      category,
      accent: INCOME_CATEGORY_COLORS[category as IncomeCategory] ?? "neutral-accent",
      amount,
      percent: total === 0 ? 0 : Math.round((amount / total) * 100),
    }));
}

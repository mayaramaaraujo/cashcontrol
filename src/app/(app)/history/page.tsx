import { redirect } from "next/navigation";
import { getCurrentGroup } from "@/shared/lib/supabase/get-current-group";
import { createClient } from "@/shared/lib/supabase/server";
import {
  lastSixMonths,
  monthLabel,
  computeTrend,
  computeCategoryBreakdown,
  earlierMonths,
  type MonthEntry,
} from "@/features/history/lib";
import { TrendChart } from "@/features/history/components/TrendChart";
import { CategoryBreakdown } from "@/features/history/components/CategoryBreakdown";
import { EarlierMonths } from "@/features/history/components/EarlierMonths";

interface HistoryPageProps {
  searchParams: Promise<{ month?: string }>;
}

export default async function HistoryPage({ searchParams }: HistoryPageProps) {
  const currentGroup = await getCurrentGroup();
  if (!currentGroup) {
    redirect("/setup");
  }

  const { month: monthParam } = await searchParams;
  const now = new Date();
  const month = monthParam ?? `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

  const months = lastSixMonths(month);
  const rangeStart = `${months[0]}-01`;
  const [rangeEndYear, rangeEndMonth] = month.split("-").map(Number);
  const rangeEnd = new Date(Date.UTC(rangeEndYear, rangeEndMonth, 1)).toISOString().slice(0, 10);

  const supabase = await createClient();
  const { data } = await supabase
    .from("income_entries")
    .select("category, amount, entry_date")
    .eq("group_id", currentGroup.groupId)
    .gte("entry_date", rangeStart)
    .lt("entry_date", rangeEnd);

  const entries: MonthEntry[] = (data ?? []).map((row) => ({
    category: row.category,
    amount: Number(row.amount),
    entryDate: row.entry_date,
  }));

  const trend = computeTrend(entries, months, month);
  const categoryBreakdown = computeCategoryBreakdown(entries, month);

  return (
    <div>
      <TrendChart trend={trend} />
      <CategoryBreakdown monthLabel={monthLabel(month, true)} rows={categoryBreakdown} />
      <EarlierMonths months={earlierMonths(trend)} />
    </div>
  );
}

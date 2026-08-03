import { redirect } from "next/navigation";
import { getCurrentGroup } from "@/shared/lib/supabase/get-current-group";
import { createClient } from "@/shared/lib/supabase/server";
import { BILL_COLUMNS, mapBillRow, computeBillsSummary, computeCategoryBreakdown } from "@/features/bills/lib";
import { BillsSummary } from "@/features/bills/components/BillsSummary";
import { BillsList } from "@/features/bills/components/BillsList";
import { CategoryBreakdown } from "@/shared/components/CategoryBreakdown";
import type { BillCategory } from "@/features/bills/types";
import { monthLabel } from "@/features/history/lib";
import { getLocale } from "@/shared/lib/i18n/server";
import { getDictionary } from "@/shared/lib/i18n/dictionaries";
import { LOCALE_INTL_TAG } from "@/shared/lib/i18n/config";

export default async function BillsPage() {
  const currentGroup = await getCurrentGroup();
  if (!currentGroup) {
    redirect("/setup");
  }

  const locale = await getLocale();
  const dict = getDictionary(locale);

  const supabase = await createClient();
  const { data: billRows } = await supabase
    .from("bills")
    .select(BILL_COLUMNS)
    .eq("group_id", currentGroup.groupId)
    .order("due_day", { ascending: true });

  const bills = (billRows ?? []).map(mapBillRow);
  const summary = computeBillsSummary(bills);
  const categoryBreakdown = computeCategoryBreakdown(bills);

  const now = new Date();
  const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

  return (
    <div>
      <BillsSummary summary={summary} dict={dict} currency={currentGroup.currency} />
      <CategoryBreakdown
        title={dict.bills.byCategory(monthLabel(currentMonth, true, LOCALE_INTL_TAG[locale]))}
        rows={categoryBreakdown}
        emptyMessage={dict.bills.noPaidBillsThisMonth}
        categoryLabel={(category) => dict.categories.bill[category as BillCategory] ?? category}
        currency={currentGroup.currency}
      />
      <BillsList bills={bills} currency={currentGroup.currency} />
    </div>
  );
}

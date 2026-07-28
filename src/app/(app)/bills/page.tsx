import { redirect } from "next/navigation";
import { getCurrentGroup } from "@/shared/lib/supabase/get-current-group";
import { createClient } from "@/shared/lib/supabase/server";
import { BILL_COLUMNS, mapBillRow, computeBillsSummary } from "@/features/bills/lib";
import { BillsSummary } from "@/features/bills/components/BillsSummary";
import { BillsList } from "@/features/bills/components/BillsList";
import { getLocale } from "@/shared/lib/i18n/server";
import { getDictionary } from "@/shared/lib/i18n/dictionaries";

export default async function BillsPage() {
  const currentGroup = await getCurrentGroup();
  if (!currentGroup) {
    redirect("/setup");
  }

  const dict = getDictionary(await getLocale());

  const supabase = await createClient();
  const { data: billRows } = await supabase
    .from("bills")
    .select(BILL_COLUMNS)
    .eq("group_id", currentGroup.groupId)
    .order("due_day", { ascending: true });

  const bills = (billRows ?? []).map(mapBillRow);
  const summary = computeBillsSummary(bills);

  return (
    <div>
      <BillsSummary summary={summary} dict={dict} />
      <BillsList bills={bills} />
    </div>
  );
}

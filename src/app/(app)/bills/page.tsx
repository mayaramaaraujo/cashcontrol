import { redirect } from "next/navigation";
import { getCurrentGroup } from "@/shared/lib/supabase/get-current-group";
import { createClient } from "@/shared/lib/supabase/server";
import { BILL_COLUMNS, mapBillRow, computeBillsSummary } from "@/features/bills/lib";
import { BillsSummary } from "@/features/bills/components/BillsSummary";
import { BillsList } from "@/features/bills/components/BillsList";

export default async function BillsPage() {
  const currentGroup = await getCurrentGroup();
  if (!currentGroup) {
    redirect("/setup");
  }

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
      <BillsSummary summary={summary} />
      <BillsList bills={bills} />
    </div>
  );
}

"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/shared/lib/supabase/server";
import { getCurrentGroup } from "@/shared/lib/supabase/get-current-group";
import { billSchema, type BillValues } from "@/features/bills/types";

function revalidateBills() {
  revalidatePath("/bills");
  revalidatePath("/home");
}

export async function addBill(values: BillValues): Promise<{ error: string } | undefined> {
  const parsed = billSchema.parse(values);

  const currentGroup = await getCurrentGroup();
  if (!currentGroup) {
    return { error: "Not in a group" };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("bills").insert({
    group_id: currentGroup.groupId,
    name: parsed.name,
    category: parsed.category,
    amount: parsed.amount,
    due_day: parsed.dueDay,
    fixed: parsed.fixed,
    repeat_monthly: parsed.repeatMonthly,
  });

  if (error) {
    return { error: error.message };
  }

  revalidateBills();
}

export async function updateBill(
  billId: string,
  values: BillValues,
): Promise<{ error: string } | undefined> {
  const parsed = billSchema.parse(values);

  const supabase = await createClient();
  const { error } = await supabase
    .from("bills")
    .update({
      name: parsed.name,
      category: parsed.category,
      amount: parsed.amount,
      due_day: parsed.dueDay,
      fixed: parsed.fixed,
      repeat_monthly: parsed.repeatMonthly,
    })
    .eq("id", billId);

  if (error) {
    return { error: error.message };
  }

  revalidateBills();
}

export async function deleteBill(billId: string): Promise<{ error: string } | undefined> {
  const supabase = await createClient();
  const { error } = await supabase.from("bills").delete().eq("id", billId);

  if (error) {
    return { error: error.message };
  }

  revalidateBills();
}

export async function toggleBillPaid(billId: string, paid: boolean): Promise<void> {
  const supabase = await createClient();
  await supabase.from("bills").update({ paid }).eq("id", billId);

  revalidateBills();
}

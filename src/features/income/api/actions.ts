"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/shared/lib/supabase/server";
import { getCurrentGroup } from "@/shared/lib/supabase/get-current-group";
import { addIncomeSchema, type AddIncomeValues } from "@/features/income/types";

export async function addEntry(values: AddIncomeValues): Promise<{ error: string } | undefined> {
  const parsed = addIncomeSchema.parse(values);

  const currentGroup = await getCurrentGroup();
  if (!currentGroup) {
    return { error: "Not in a group" };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("income_entries").insert({
    group_id: currentGroup.groupId,
    member_id: parsed.memberId,
    category: parsed.category,
    amount: parsed.amount,
    note: parsed.note || null,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/home");
  revalidatePath("/history");
}

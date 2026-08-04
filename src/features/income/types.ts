import * as z from "zod";
import { en } from "@/shared/lib/i18n/dictionaries/en";
import type { Dictionary } from "@/shared/lib/i18n/dictionaries";

export type IncomeEntry = {
  id: string;
  groupId: string;
  memberId: string;
  category: string;
  amount: number;
  note: string | null;
  entryDate: string;
  createdAt: string;
};

/**
 * The literal names seeded for every group (supabase/migrations/0008_custom_categories.sql)
 * — kept only so `dict.categories.income` can translate them. Not the source of truth for
 * what categories exist; that's the `categories` table (see `@/features/categories`).
 */
export type DefaultIncomeCategory = "Salary" | "Freelance" | "Bonus" | "Part-time" | "Gift" | "Other";

export function createAddIncomeSchema(dict: Dictionary) {
  return z.object({
    memberId: z.uuid(),
    category: z.string().min(1, dict.income.validation.categoryRequired),
    amount: z.coerce.number().positive(dict.income.validation.amountPositive),
    entryDate: z.iso.date(dict.income.validation.dateRequired),
    note: z.string().optional(),
  });
}

/** Default English schema, used for server-side re-validation in Server Actions. */
export const addIncomeSchema = createAddIncomeSchema(en);

export type AddIncomeValues = z.infer<typeof addIncomeSchema>;

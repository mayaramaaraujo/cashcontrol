import * as z from "zod";
import { en } from "@/shared/lib/i18n/dictionaries/en";
import type { Dictionary } from "@/shared/lib/i18n/dictionaries";

export type Bill = {
  id: string;
  groupId: string;
  name: string;
  category: string;
  amount: number;
  dueDay: number;
  fixed: boolean;
  paid: boolean;
  paidAt: string | null;
  repeatMonthly: boolean;
  createdAt: string;
};

/**
 * The literal names seeded for every group (supabase/migrations/0008_custom_categories.sql)
 * — kept only so `dict.categories.bill` can translate them. Not the source of truth for
 * what categories exist; that's the `categories` table (see `@/features/categories`).
 */
export type DefaultBillCategory =
  | "Housing"
  | "Utilities"
  | "Insurance"
  | "Subscriptions"
  | "Groceries"
  | "Fuel"
  | "Other";

export function createBillSchema(dict: Dictionary) {
  return z.object({
    name: z.string().min(1, dict.bills.validation.nameRequired),
    amount: z.coerce.number().positive(dict.bills.validation.amountPositive),
    dueDay: z.coerce.number().int().min(1).max(31),
    fixed: z.boolean(),
    category: z.string().min(1, dict.bills.validation.categoryRequired),
    repeatMonthly: z.boolean(),
    paid: z.boolean(),
  });
}

/** Default English schema, used for server-side re-validation in Server Actions. */
export const billSchema = createBillSchema(en);

export type BillValues = z.infer<typeof billSchema>;

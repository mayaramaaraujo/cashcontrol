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

export const INCOME_CATEGORIES = [
  "Salary",
  "Freelance",
  "Bonus",
  "Part-time",
  "Gift",
  "Other",
] as const;

export type IncomeCategory = (typeof INCOME_CATEGORIES)[number];

export const INCOME_CATEGORY_COLORS: Record<IncomeCategory, string> = {
  Salary: "avatar-3",
  Freelance: "avatar-2",
  Bonus: "avatar-4",
  "Part-time": "avatar-5",
  Gift: "avatar-1",
  Other: "neutral-accent",
};

export function createAddIncomeSchema(dict: Dictionary) {
  return z.object({
    memberId: z.uuid(),
    category: z.enum(INCOME_CATEGORIES),
    amount: z.coerce.number().positive(dict.income.validation.amountPositive),
    note: z.string().optional(),
  });
}

/** Default English schema, used for server-side re-validation in Server Actions. */
export const addIncomeSchema = createAddIncomeSchema(en);

export type AddIncomeValues = z.infer<typeof addIncomeSchema>;

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
  repeatMonthly: boolean;
  createdAt: string;
};

export const BILL_CATEGORIES = [
  "Housing",
  "Utilities",
  "Insurance",
  "Subscriptions",
  "Other",
] as const;

export type BillCategory = (typeof BILL_CATEGORIES)[number];

export const BILL_CATEGORY_COLORS: Record<BillCategory, string> = {
  Housing: "primary",
  Utilities: "positive-dark",
  Insurance: "violet",
  Subscriptions: "warning",
  Other: "neutral-accent",
};

export function createBillSchema(dict: Dictionary) {
  return z.object({
    name: z.string().min(1, dict.bills.validation.nameRequired),
    amount: z.coerce.number().positive(dict.bills.validation.amountPositive),
    dueDay: z.coerce.number().int().min(1).max(31),
    fixed: z.boolean(),
    category: z.enum(BILL_CATEGORIES),
    repeatMonthly: z.boolean(),
  });
}

/** Default English schema, used for server-side re-validation in Server Actions. */
export const billSchema = createBillSchema(en);

export type BillValues = z.infer<typeof billSchema>;

import * as z from "zod";

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

export const addIncomeSchema = z.object({
  memberId: z.uuid(),
  category: z.enum(INCOME_CATEGORIES),
  amount: z.coerce.number().positive("Enter an amount greater than 0"),
  note: z.string().optional(),
});

export type AddIncomeValues = z.infer<typeof addIncomeSchema>;

import * as z from "zod";

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
  Housing: "avatar-3",
  Utilities: "avatar-4",
  Insurance: "violet",
  Subscriptions: "avatar-1",
  Other: "neutral-accent",
};

export const billSchema = z.object({
  name: z.string().min(1, "Bill name is required"),
  amount: z.coerce.number().positive("Enter an amount greater than 0"),
  dueDay: z.coerce.number().int().min(1).max(31),
  fixed: z.boolean(),
  category: z.enum(BILL_CATEGORIES),
  repeatMonthly: z.boolean(),
});

export type BillValues = z.infer<typeof billSchema>;

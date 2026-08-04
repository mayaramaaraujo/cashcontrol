import * as z from "zod";
import { CHIP_ACCENTS, type ChipAccent } from "@/shared/lib/chip-accents";
import { en } from "@/shared/lib/i18n/dictionaries/en";
import type { Dictionary } from "@/shared/lib/i18n/dictionaries";

export type CategoryType = "bill" | "income";

export type Category = {
  id: string;
  groupId: string;
  type: CategoryType;
  name: string;
  color: ChipAccent;
  createdAt: string;
};

export function createCategorySchema(dict: Dictionary) {
  return z.object({
    type: z.enum(["bill", "income"]),
    name: z.string().min(1, dict.settings.categoryNameRequired).max(30),
    color: z.enum(CHIP_ACCENTS),
  });
}

/** Default English schema, used for server-side re-validation in Server Actions. */
export const categorySchema = createCategorySchema(en);

export type CategoryValues = z.infer<typeof categorySchema>;

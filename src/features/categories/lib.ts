import type { Database } from "@/shared/lib/supabase/database.types";
import type { ChipAccent } from "@/shared/lib/chip-accents";
import type { Category, CategoryType } from "@/features/categories/types";

export const CATEGORY_COLUMNS = "id, group_id, type, name, color, created_at" as const;

type CategoryRow = Database["public"]["Tables"]["categories"]["Row"];

export function mapCategoryRow(row: CategoryRow): Category {
  return {
    id: row.id,
    groupId: row.group_id,
    type: row.type as CategoryType,
    name: row.name,
    color: row.color as ChipAccent,
    createdAt: row.created_at,
  };
}

export function categoriesByType(categories: Category[], type: CategoryType): Category[] {
  return categories.filter((category) => category.type === type);
}

/** Category name -> chip accent color, for breakdown charts/dots that only have the category name. */
export function colorsByCategoryName(categories: Category[]): Record<string, string> {
  return Object.fromEntries(categories.map((category) => [category.name, category.color]));
}

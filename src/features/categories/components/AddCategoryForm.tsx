"use client";

import { useEffect, useMemo } from "react";
import type * as z from "zod";
import { Plus, Loader2 } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { Input } from "@/shared/components/Input";
import { Button } from "@/shared/components/Button";
import { CHIP_ACCENTS, CHIP_ACCENT_BG_CLASSES, type ChipAccent } from "@/shared/components/Chip";
import { addCategory } from "@/features/categories/api/actions";
import { createCategorySchema, type CategoryType } from "@/features/categories/types";
import { useTranslation } from "@/shared/lib/i18n/context";

const COLOR_OPTIONS = CHIP_ACCENTS.filter((accent): accent is Exclude<ChipAccent, "neutral"> => accent !== "neutral");

interface AddCategoryFormProps {
  type: CategoryType;
}

type CategoryFormInput = z.input<ReturnType<typeof createCategorySchema>>;
type CategoryFormValues = z.output<ReturnType<typeof createCategorySchema>>;

function defaultValues(type: CategoryType): CategoryFormInput {
  return { type, name: "", color: COLOR_OPTIONS[0] };
}

export function AddCategoryForm({ type }: AddCategoryFormProps) {
  const { dict } = useTranslation();
  const categorySchema = useMemo(() => createCategorySchema(dict), [dict]);
  const {
    register,
    control,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<CategoryFormInput, unknown, CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: defaultValues(type),
  });

  useEffect(() => {
    reset(defaultValues(type));
  }, [type, reset]);

  async function onSubmit(values: CategoryFormValues) {
    const result = await addCategory(values);
    if (result?.error) {
      setError("root", { message: result.error });
      return;
    }
    reset(defaultValues(type));
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-3 flex flex-col gap-2.5">
      <Controller
        control={control}
        name="color"
        render={({ field }) => (
          <div className="flex flex-wrap gap-1.5">
            {COLOR_OPTIONS.map((accent) => (
              <button
                key={accent}
                type="button"
                aria-label={accent}
                aria-pressed={field.value === accent}
                onClick={() => field.onChange(accent)}
                className={`size-6 shrink-0 rounded-full ${CHIP_ACCENT_BG_CLASSES[accent]} ${
                  field.value === accent ? "ring-2 ring-text-primary ring-offset-2 ring-offset-bg-sheet" : ""
                }`}
              />
            ))}
          </div>
        )}
      />

      <div className="flex gap-2">
        <Input
          placeholder={dict.settings.addCategoryPlaceholder}
          invalid={!!errors.name}
          className="flex-1"
          {...register("name")}
        />
        <Button type="submit" size="sm" disabled={isSubmitting}>
          {isSubmitting ? <Loader2 className="size-4 animate-spin" /> : <Plus className="size-4" />}
        </Button>
      </div>

      {errors.name ? <p className="text-xs font-medium text-danger">{errors.name.message}</p> : null}
      {errors.root ? <p className="text-xs font-medium text-danger">{errors.root.message}</p> : null}
    </form>
  );
}

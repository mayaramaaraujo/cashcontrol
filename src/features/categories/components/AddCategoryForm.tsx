"use client";

import { useEffect, useMemo } from "react";
import type * as z from "zod";
import { Loader2 } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { Input } from "@/shared/components/Input";
import { Button } from "@/shared/components/Button";
import { Sheet } from "@/shared/components/Sheet";
import { CHIP_ACCENTS, CHIP_ACCENT_BG_CLASSES, type ChipAccent } from "@/shared/components/Chip";
import { addCategory } from "@/features/categories/api/actions";
import { createCategorySchema, type CategoryType } from "@/features/categories/types";
import { useTranslation } from "@/shared/lib/i18n/context";

const COLOR_OPTIONS = CHIP_ACCENTS.filter((accent): accent is Exclude<ChipAccent, "neutral"> => accent !== "neutral");

interface AddCategoryFormProps {
  type: CategoryType;
  usedColors: ChipAccent[];
  open: boolean;
  onClose: () => void;
}

type CategoryFormInput = z.input<ReturnType<typeof createCategorySchema>>;
type CategoryFormValues = z.output<ReturnType<typeof createCategorySchema>>;

export function AddCategoryForm({ type, usedColors, open, onClose }: AddCategoryFormProps) {
  const { dict } = useTranslation();
  const categorySchema = useMemo(() => createCategorySchema(dict), [dict]);
  const availableColors = useMemo(
    () => COLOR_OPTIONS.filter((accent) => !usedColors.includes(accent)),
    [usedColors],
  );

  function defaultValues(): CategoryFormInput {
    return { type, name: "", color: availableColors[0] ?? COLOR_OPTIONS[0] };
  }

  const {
    register,
    control,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<CategoryFormInput, unknown, CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: defaultValues(),
  });

  useEffect(() => {
    if (open) reset(defaultValues());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, type]);

  async function onSubmit(values: CategoryFormValues) {
    const result = await addCategory(values);
    if (result?.error) {
      setError("root", { message: result.error });
      return;
    }
    onClose();
  }

  return (
    <Sheet open={open} onClose={onClose} title={dict.settings.addCategory}>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <Controller
          control={control}
          name="color"
          render={({ field }) => (
            <div className="flex flex-wrap gap-2.5">
              {COLOR_OPTIONS.map((accent) => {
                const taken = usedColors.includes(accent) && field.value !== accent;
                return (
                  <button
                    key={accent}
                    type="button"
                    aria-label={accent}
                    aria-pressed={field.value === accent}
                    disabled={taken}
                    onClick={() => field.onChange(accent)}
                    className={`size-9 shrink-0 rounded-full ${CHIP_ACCENT_BG_CLASSES[accent]} ${
                      field.value === accent
                        ? "ring-2 ring-text-primary ring-offset-2 ring-offset-bg-sheet"
                        : ""
                    } ${taken ? "cursor-not-allowed opacity-20" : ""}`}
                  />
                );
              })}
            </div>
          )}
        />

        <Input
          placeholder={dict.settings.addCategoryPlaceholder}
          invalid={!!errors.name}
          {...register("name")}
        />

        {errors.name ? <p className="text-xs font-medium text-danger">{errors.name.message}</p> : null}
        {errors.root ? <p className="text-xs font-medium text-danger">{errors.root.message}</p> : null}

        <Button type="submit" disabled={isSubmitting} fullWidth>
          {isSubmitting ? <Loader2 className="size-4 animate-spin" /> : null}
          {dict.settings.add}
        </Button>
      </form>
    </Sheet>
  );
}

"use client";

import { useEffect } from "react";
import type * as z from "zod";
import { Loader2 } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { Sheet } from "@/shared/components/Sheet";
import { Input } from "@/shared/components/Input";
import { Button } from "@/shared/components/Button";
import { Avatar, type AvatarColorIndex } from "@/shared/components/Avatar";
import { Chip, type ChipAccent } from "@/shared/components/Chip";
import { getInitials } from "@/shared/lib/utils";
import { addEntry } from "@/features/income/api/actions";
import { addIncomeSchema, INCOME_CATEGORIES, INCOME_CATEGORY_COLORS } from "@/features/income/types";
import type { GroupMember } from "@/features/groups/types";

interface AddIncomeSheetProps {
  open: boolean;
  onClose: () => void;
  members: GroupMember[];
  defaultMemberId: string;
}

type AddIncomeFormInput = z.input<typeof addIncomeSchema>;
type AddIncomeValues = z.output<typeof addIncomeSchema>;

export function AddIncomeSheet({ open, onClose, members, defaultMemberId }: AddIncomeSheetProps) {
  const {
    register,
    control,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<AddIncomeFormInput, unknown, AddIncomeValues>({
    resolver: zodResolver(addIncomeSchema),
    defaultValues: {
      memberId: defaultMemberId,
      category: INCOME_CATEGORIES[0],
      amount: 0,
      note: "",
    },
  });

  useEffect(() => {
    if (open) {
      reset({
        memberId: defaultMemberId,
        category: INCOME_CATEGORIES[0],
        amount: 0,
        note: "",
      });
    }
  }, [open, defaultMemberId, reset]);

  async function onSubmit(values: AddIncomeValues) {
    const result = await addEntry(values);
    if (result?.error) {
      setError("root", { message: result.error });
      return;
    }
    onClose();
  }

  return (
    <Sheet open={open} onClose={onClose} title="Add income">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-1">
        <div>
          <Input
            leadingText="€"
            type="number"
            step="0.01"
            inputMode="decimal"
            placeholder="0"
            invalid={!!errors.amount}
            className="font-display font-bold"
            {...register("amount")}
          />
          {errors.amount ? (
            <p className="mt-2 text-xs font-medium text-danger">{errors.amount.message}</p>
          ) : null}
        </div>

        <Controller
          control={control}
          name="memberId"
          render={({ field }) => (
            <div className="mt-3">
              <p className="mb-2 text-xs font-semibold text-text-subtle">Who earned this?</p>
              <div className="flex gap-2 overflow-x-auto pb-0.5">
                {members.map((member) => (
                  <button
                    key={member.id}
                    type="button"
                    onClick={() => field.onChange(member.id)}
                    className={`flex shrink-0 items-center gap-2 rounded-lg border py-2 pr-3.5 pl-2 text-sm font-semibold transition-colors ${
                      field.value === member.id
                        ? "border-primary bg-primary/15 text-text-primary"
                        : "border-surface-border bg-surface-2 text-text-muted"
                    }`}
                  >
                    <Avatar
                      initials={getInitials(member.displayName)}
                      colorIndex={member.colorIndex as AvatarColorIndex}
                      size="sm"
                    />
                    {member.displayName}
                  </button>
                ))}
              </div>
            </div>
          )}
        />

        <Controller
          control={control}
          name="category"
          render={({ field }) => (
            <div className="mt-3">
              <p className="mb-2 text-xs font-semibold text-text-subtle">Category</p>
              <div className="flex flex-wrap gap-2">
                {INCOME_CATEGORIES.map((category) => (
                  <Chip
                    key={category}
                    type="button"
                    accent={INCOME_CATEGORY_COLORS[category] as ChipAccent}
                    selected={field.value === category}
                    onClick={() => field.onChange(category)}
                  >
                    {category}
                  </Chip>
                ))}
              </div>
            </div>
          )}
        />

        <Input placeholder="Add a note (optional)" className="mt-3.5" {...register("note")} />

        <Button type="submit" fullWidth disabled={isSubmitting} className="mt-4">
          {isSubmitting ? <Loader2 className="size-4 animate-spin" /> : null}
          Save income
        </Button>

        {errors.root ? (
          <p className="mt-2 text-center text-xs font-medium text-danger">{errors.root.message}</p>
        ) : null}
      </form>
    </Sheet>
  );
}

"use client";

import { useEffect, useMemo } from "react";
import type * as z from "zod";
import { Loader2, Calendar } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { Sheet } from "@/shared/components/Sheet";
import { Input } from "@/shared/components/Input";
import { Button } from "@/shared/components/Button";
import { SegmentedControl } from "@/shared/components/SegmentedControl";
import { Chip, type ChipAccent } from "@/shared/components/Chip";
import { Switch } from "@/shared/components/Switch";
import { addBill, updateBill, deleteBill } from "@/features/bills/api/actions";
import {
  createBillSchema,
  BILL_CATEGORIES,
  BILL_CATEGORY_COLORS,
  type BillValues,
  type Bill,
} from "@/features/bills/types";
import { useTranslation } from "@/shared/lib/i18n/context";

interface BillSheetProps {
  open: boolean;
  onClose: () => void;
  bill?: Bill;
}

type BillFormInput = z.input<ReturnType<typeof createBillSchema>>;

const DEFAULT_VALUES: BillFormInput = {
  name: "",
  amount: 0,
  dueDay: 1,
  fixed: true,
  category: BILL_CATEGORIES[0],
  repeatMonthly: true,
};

function billToValues(bill: Bill): BillFormInput {
  return {
    name: bill.name,
    amount: bill.amount,
    dueDay: bill.dueDay,
    fixed: bill.fixed,
    category: bill.category as BillValues["category"],
    repeatMonthly: bill.repeatMonthly,
  };
}

export function BillSheet({ open, onClose, bill }: BillSheetProps) {
  const { dict } = useTranslation();
  const billSchema = useMemo(() => createBillSchema(dict), [dict]);
  const {
    register,
    control,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<BillFormInput, unknown, BillValues>({
    resolver: zodResolver(billSchema),
    defaultValues: bill ? billToValues(bill) : DEFAULT_VALUES,
  });

  useEffect(() => {
    if (open) reset(bill ? billToValues(bill) : DEFAULT_VALUES);
  }, [open, bill, reset]);

  async function onSubmit(values: BillValues) {
    const result = bill ? await updateBill(bill.id, values) : await addBill(values);
    if (result?.error) {
      setError("root", { message: result.error });
      return;
    }
    onClose();
  }

  async function onDelete() {
    if (!bill) return;
    const result = await deleteBill(bill.id);
    if (result?.error) {
      setError("root", { message: result.error });
      return;
    }
    onClose();
  }

  return (
    <Sheet open={open} onClose={onClose} title={bill ? dict.bills.sheet.editTitle : dict.bills.sheet.addTitle}>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div>
          <Input
            placeholder={dict.bills.sheet.namePlaceholder}
            invalid={!!errors.name}
            {...register("name")}
          />
          {errors.name ? (
            <p className="mt-2 text-xs font-medium text-danger">{errors.name.message}</p>
          ) : null}
        </div>

        <div className="flex gap-2.5">
          <div className="flex-1">
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
          <div className="flex-1">
            <Input
              icon={Calendar}
              type="number"
              inputMode="numeric"
              min={1}
              max={31}
              placeholder={dict.bills.sheet.dueDayPlaceholder}
              invalid={!!errors.dueDay}
              className="text-xs font-semibold"
              {...register("dueDay")}
            />
            {errors.dueDay ? (
              <p className="mt-2 text-xs font-medium text-danger">{errors.dueDay.message}</p>
            ) : null}
          </div>
        </div>

        <Controller
          control={control}
          name="fixed"
          render={({ field }) => (
            <SegmentedControl
              value={field.value ? "fixed" : "variable"}
              onChange={(value) => field.onChange(value === "fixed")}
              options={[
                { value: "fixed", label: dict.bills.sheet.fixed },
                { value: "variable", label: dict.bills.sheet.variable },
              ]}
            />
          )}
        />

        <Controller
          control={control}
          name="category"
          render={({ field }) => (
            <div>
              <p className="mb-2 text-xs font-semibold text-text-subtle">{dict.bills.sheet.category}</p>
              <div className="flex flex-wrap gap-2">
                {BILL_CATEGORIES.map((category) => (
                  <Chip
                    key={category}
                    type="button"
                    accent={BILL_CATEGORY_COLORS[category] as ChipAccent}
                    selected={field.value === category}
                    onClick={() => field.onChange(category)}
                  >
                    {dict.categories.bill[category]}
                  </Chip>
                ))}
              </div>
            </div>
          )}
        />

        <Controller
          control={control}
          name="repeatMonthly"
          render={({ field }) => (
            <div className="flex items-center justify-between rounded-lg border border-surface-border bg-surface-2 px-4 py-3.5">
              <span className="text-sm font-medium text-text-primary">{dict.bills.sheet.repeatMonthly}</span>
              <Switch checked={field.value} onCheckedChange={field.onChange} />
            </div>
          )}
        />

        <Button type="submit" fullWidth disabled={isSubmitting} className="mt-2">
          {isSubmitting ? <Loader2 className="size-4 animate-spin" /> : null}
          {bill ? dict.bills.sheet.saveChanges : dict.bills.sheet.saveBill}
        </Button>

        {bill ? (
          <Button
            type="button"
            variant="danger"
            fullWidth
            disabled={isSubmitting}
            onClick={onDelete}
          >
            {dict.bills.sheet.deleteBill}
          </Button>
        ) : null}

        {errors.root ? (
          <p className="text-center text-xs font-medium text-danger">{errors.root.message}</p>
        ) : null}
      </form>
    </Sheet>
  );
}

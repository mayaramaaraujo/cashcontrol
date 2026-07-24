"use client";

import { Mail } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Input } from "@/shared/components/Input";
import { Button } from "@/shared/components/Button";
import { inviteByEmail } from "@/features/groups/api/actions";
import { inviteByEmailSchema, type InviteByEmailValues } from "@/features/groups/types";

export function InviteByEmailForm() {
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<InviteByEmailValues>({ resolver: zodResolver(inviteByEmailSchema) });

  async function onSubmit(values: InviteByEmailValues) {
    const result = await inviteByEmail(values);
    if (result?.error) {
      setError("root", { message: result.error });
      return;
    }
    reset();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-3.5">
      <div className="flex items-start gap-2">
        <div className="flex-1">
          <Input
            icon={Mail}
            placeholder="Invite by email"
            invalid={!!errors.email}
            {...register("email")}
          />
        </div>
        <Button type="submit" disabled={isSubmitting}>
          Add
        </Button>
      </div>
      {errors.email ? (
        <p className="mt-2 text-xs font-medium text-danger">{errors.email.message}</p>
      ) : null}
      {errors.root ? (
        <p className="mt-2 text-xs font-medium text-danger">{errors.root.message}</p>
      ) : null}
    </form>
  );
}

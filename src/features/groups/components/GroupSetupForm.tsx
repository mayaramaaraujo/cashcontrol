"use client";

import { Loader2, Home } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/shared/components/Button";
import { Input } from "@/shared/components/Input";
import { createGroup } from "@/features/groups/api/actions";
import { createGroupSchema, type CreateGroupValues } from "@/features/groups/types";

export function GroupSetupForm() {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<CreateGroupValues>({ resolver: zodResolver(createGroupSchema) });

  async function onSubmit(values: CreateGroupValues) {
    const result = await createGroup(values);
    if (result?.error) {
      setError("root", { message: result.error });
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-6 flex flex-col">
      <Input
        icon={Home}
        placeholder="e.g. Casa Ferrari"
        invalid={!!errors.name}
        {...register("name")}
      />
      {errors.name ? (
        <p className="mt-2 text-xs font-medium text-danger">{errors.name.message}</p>
      ) : null}

      <Button type="submit" fullWidth disabled={isSubmitting} className="mt-6">
        {isSubmitting ? <Loader2 className="size-4 animate-spin" /> : null}
        Go to dashboard
      </Button>

      {errors.root ? (
        <p className="mt-2 text-xs font-medium text-danger">{errors.root.message}</p>
      ) : null}
    </form>
  );
}

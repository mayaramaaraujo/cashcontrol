"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Loader2, Lock, Mail } from "lucide-react";
import { Button } from "@/shared/components/Button";
import { Input } from "@/shared/components/Input";
import { createClient } from "@/shared/lib/supabase/client";
import { loginSchema, type LoginFormValues } from "@/features/auth/types";

export function LoginForm() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({ resolver: zodResolver(loginSchema) });

  async function onSubmit(values: LoginFormValues) {
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword(values);

    if (error) {
      setError("root", { message: error.message });
      return;
    }

    router.replace("/");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
      <div className="flex flex-col gap-3">
        <Input
          icon={Mail}
          type="email"
          placeholder="you@email.com"
          invalid={!!errors.email}
          {...register("email")}
        />
        <Input
          icon={Lock}
          type="password"
          placeholder="••••••••"
          invalid={!!errors.password}
          {...register("password")}
        />
      </div>

      {errors.root ? (
        <p className="mt-2 text-xs font-medium text-danger">{errors.root.message}</p>
      ) : null}

      <p className="mt-2 text-right text-xs font-semibold text-primary-light">
        Forgot password?
      </p>

      <Button type="submit" fullWidth disabled={isSubmitting} className="mt-4">
        {isSubmitting ? <Loader2 className="size-4 animate-spin" /> : null}
        Sign in
      </Button>

      <p className="mt-4 text-center text-xs text-text-dim">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="font-semibold text-primary-light">
          Sign up
        </Link>
      </p>
    </form>
  );
}

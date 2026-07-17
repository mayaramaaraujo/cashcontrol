"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Loader2, Lock, Mail } from "lucide-react";
import { Button } from "@/shared/components/Button";
import { Input } from "@/shared/components/Input";
import { createClient } from "@/shared/lib/supabase/client";
import { signupSchema, type SignupFormValues } from "@/features/auth/types";
import { GoogleButton } from "@/features/auth/components/GoogleButton";

export function SignupForm() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormValues>({ resolver: zodResolver(signupSchema) });

  async function onSubmit(values: SignupFormValues) {
    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email: values.email,
      password: values.password,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    });

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
        {errors.password ? (
          <p className="text-xs font-medium text-danger">{errors.password.message}</p>
        ) : null}
      </div>

      {errors.root ? (
        <p className="mt-2 text-xs font-medium text-danger">{errors.root.message}</p>
      ) : null}

      <Button type="submit" fullWidth disabled={isSubmitting} className="mt-5">
        {isSubmitting ? <Loader2 className="size-4 animate-spin" /> : null}
        Create account
      </Button>

      <div className="mt-5 flex items-center gap-3">
        <div className="h-px flex-1 bg-surface-border" />
        <span className="text-xs font-bold tracking-wide text-text-dim">OR</span>
        <div className="h-px flex-1 bg-surface-border" />
      </div>

      <div className="mt-4">
        <GoogleButton />
      </div>

      <p className="mt-4 text-center text-xs text-text-dim">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-primary-light">
          Sign in
        </Link>
      </p>
    </form>
  );
}

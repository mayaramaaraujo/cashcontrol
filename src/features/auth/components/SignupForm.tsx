"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Loader2, Lock, Mail, MailCheck, User } from "lucide-react";
import { Button } from "@/shared/components/Button";
import { Input } from "@/shared/components/Input";
import { createClient } from "@/shared/lib/supabase/client";
import { signupSchema, type SignupFormValues } from "@/features/auth/types";

interface SignupFormProps {
  /** Where to land after signing up (e.g. an invite link). Only a same-origin path is honored. */
  next?: string;
}

export function SignupForm({ next }: SignupFormProps) {
  const router = useRouter();
  const [confirmationSentTo, setConfirmationSentTo] = useState<string | null>(null);
  const destination = next?.startsWith("/") && !next.startsWith("//") ? next : "/";
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormValues>({ resolver: zodResolver(signupSchema) });

  async function onSubmit(values: SignupFormValues) {
    const supabase = createClient();
    const redirectTo = new URL("/auth/callback", window.location.origin);
    if (next) redirectTo.searchParams.set("next", next);

    const { data, error } = await supabase.auth.signUp({
      email: values.email,
      password: values.password,
      options: {
        data: { full_name: values.name },
        emailRedirectTo: redirectTo.toString(),
      },
    });

    if (error) {
      setError("root", { message: error.message });
      return;
    }

    // With email confirmation required, signUp doesn't return a session —
    // the account only becomes active once the user clicks the confirmation
    // link, which lands on /auth/callback and creates the session there.
    if (!data.session) {
      setConfirmationSentTo(values.email);
      return;
    }

    router.replace(destination);
    router.refresh();
  }

  if (confirmationSentTo) {
    return (
      <div className="flex flex-col items-center text-center">
        <MailCheck className="size-10 text-primary-light" />
        <p className="mt-4 text-sm leading-relaxed text-text-subtle">
          We sent a confirmation link to <span className="font-semibold text-text-primary">{confirmationSentTo}</span>.
          Click it to activate your account and sign in.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
      <div className="flex flex-col gap-3">
        <Input
          icon={User}
          placeholder="Your name"
          invalid={!!errors.name}
          {...register("name")}
        />
        {errors.name ? (
          <p className="text-xs font-medium text-danger">{errors.name.message}</p>
        ) : null}
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

      <p className="mt-4 text-center text-xs text-text-dim">
        Already have an account?{" "}
        <Link
          href={next ? `/login?next=${encodeURIComponent(next)}` : "/login"}
          className="font-semibold text-primary-light"
        >
          Sign in
        </Link>
      </p>
    </form>
  );
}

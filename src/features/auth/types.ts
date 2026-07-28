import * as z from "zod";
import type { Dictionary } from "@/shared/lib/i18n/dictionaries";

export function createLoginSchema(dict: Dictionary) {
  return z.object({
    email: z.email(dict.auth.validation.emailInvalid),
    password: z.string().min(1, dict.auth.validation.passwordRequired),
  });
}

export type LoginFormValues = z.infer<ReturnType<typeof createLoginSchema>>;

export function createSignupSchema(dict: Dictionary) {
  return z.object({
    name: z.string().min(1, dict.auth.validation.nameRequired),
    email: z.email(dict.auth.validation.emailInvalid),
    password: z.string().min(8, dict.auth.validation.passwordMinLength),
  });
}

export type SignupFormValues = z.infer<ReturnType<typeof createSignupSchema>>;

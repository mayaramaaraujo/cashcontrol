import * as z from "zod";

export const loginSchema = z.object({
  email: z.email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export const signupSchema = z.object({
  email: z.email("Enter a valid email address"),
  password: z.string().min(8, "Must be at least 8 characters"),
});

export type SignupFormValues = z.infer<typeof signupSchema>;

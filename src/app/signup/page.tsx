import type { Metadata } from "next";
import { AuthShell } from "@/features/auth/components/AuthShell";
import { SignupForm } from "@/features/auth/components/SignupForm";

export const metadata: Metadata = {
  title: "Sign up — CashControl",
};

export default function SignupPage() {
  return (
    <AuthShell title="Create your account" subtitle="Set up your login to get started with CashControl.">
      <SignupForm />
    </AuthShell>
  );
}

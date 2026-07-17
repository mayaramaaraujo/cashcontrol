import type { Metadata } from "next";
import { AuthShell } from "@/features/auth/components/AuthShell";
import { LoginForm } from "@/features/auth/components/LoginForm";

export const metadata: Metadata = {
  title: "Sign in — CashControl",
};

export default function LoginPage() {
  return (
    <AuthShell
      title="CashControl"
      subtitle="Track what everyone brings in and what's owed. One shared picture, every month."
    >
      <LoginForm />
    </AuthShell>
  );
}

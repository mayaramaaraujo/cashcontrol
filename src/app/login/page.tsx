import type { Metadata } from "next";
import { AuthShell } from "@/features/auth/components/AuthShell";
import { LoginForm } from "@/features/auth/components/LoginForm";

export const metadata: Metadata = {
  title: "Sign in — CashControl",
};

interface LoginPageProps {
  searchParams: Promise<{ next?: string }>;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { next } = await searchParams;

  return (
    <AuthShell
      title="CashControl"
      subtitle="Track what everyone brings in and what's owed. One shared picture, every month."
    >
      <LoginForm next={next} />
    </AuthShell>
  );
}

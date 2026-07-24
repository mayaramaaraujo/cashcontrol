import type { Metadata } from "next";
import { AuthShell } from "@/features/auth/components/AuthShell";
import { SignupForm } from "@/features/auth/components/SignupForm";

export const metadata: Metadata = {
  title: "Sign up — CashControl",
};

interface SignupPageProps {
  searchParams: Promise<{ next?: string }>;
}

export default async function SignupPage({ searchParams }: SignupPageProps) {
  const { next } = await searchParams;

  return (
    <AuthShell title="Create your account" subtitle="Set up your login to get started with CashControl.">
      <SignupForm next={next} />
    </AuthShell>
  );
}

import type { Metadata } from "next";
import { AuthShell } from "@/features/auth/components/AuthShell";
import { LoginForm } from "@/features/auth/components/LoginForm";
import { getLocale } from "@/shared/lib/i18n/server";
import { getDictionary } from "@/shared/lib/i18n/dictionaries";

export async function generateMetadata(): Promise<Metadata> {
  const dict = getDictionary(await getLocale());
  return { title: dict.auth.loginPageTitle };
}

interface LoginPageProps {
  searchParams: Promise<{ next?: string }>;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { next } = await searchParams;
  const dict = getDictionary(await getLocale());

  return (
    <AuthShell title={dict.auth.appTitle} subtitle={dict.auth.loginSubtitle} termsNotice={dict.auth.termsNotice}>
      <LoginForm next={next} />
    </AuthShell>
  );
}

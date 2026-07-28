import type { Metadata } from "next";
import { AuthShell } from "@/features/auth/components/AuthShell";
import { SignupForm } from "@/features/auth/components/SignupForm";
import { getLocale } from "@/shared/lib/i18n/server";
import { getDictionary } from "@/shared/lib/i18n/dictionaries";

export async function generateMetadata(): Promise<Metadata> {
  const dict = getDictionary(await getLocale());
  return { title: dict.auth.signupPageTitle };
}

interface SignupPageProps {
  searchParams: Promise<{ next?: string }>;
}

export default async function SignupPage({ searchParams }: SignupPageProps) {
  const { next } = await searchParams;
  const dict = getDictionary(await getLocale());

  return (
    <AuthShell title={dict.auth.signupTitle} subtitle={dict.auth.signupSubtitle} termsNotice={dict.auth.termsNotice}>
      <SignupForm next={next} />
    </AuthShell>
  );
}

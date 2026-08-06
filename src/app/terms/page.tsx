import type { Metadata } from "next";
import { getLocale } from "@/shared/lib/i18n/server";
import { LegalPageShell } from "@/shared/components/LegalPageShell";
import { termsContent } from "@/app/terms/content";

export const metadata: Metadata = {
  title: "Terms of Service — Finkith",
};

export default async function TermsPage() {
  const locale = await getLocale();

  return <LegalPageShell {...termsContent[locale]} locale={locale} />;
}

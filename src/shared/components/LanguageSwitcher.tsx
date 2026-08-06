"use client";

import { Select } from "@/shared/components/Select";
import { LOCALES, LOCALE_LABEL, type Locale } from "@/shared/lib/i18n/config";
import { useTranslation } from "@/shared/lib/i18n/context";

export function LanguageSwitcher() {
  const { locale, setLocale } = useTranslation();

  return (
    <Select<Locale>
      value={locale}
      onChange={setLocale}
      options={LOCALES.map((value) => ({ value, label: LOCALE_LABEL[value] }))}
    />
  );
}

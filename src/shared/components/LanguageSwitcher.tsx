"use client";

import { SegmentedControl } from "@/shared/components/SegmentedControl";
import { LOCALES, LOCALE_LABEL, type Locale } from "@/shared/lib/i18n/config";
import { useTranslation } from "@/shared/lib/i18n/context";

export function LanguageSwitcher() {
  const { locale, setLocale } = useTranslation();

  return (
    <SegmentedControl<Locale>
      value={locale}
      onChange={setLocale}
      options={LOCALES.map((value) => ({ value, label: LOCALE_LABEL[value] }))}
    />
  );
}

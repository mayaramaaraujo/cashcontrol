"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { LOCALE_COOKIE, type Locale } from "@/shared/lib/i18n/config";
import { getDictionary, type Dictionary } from "@/shared/lib/i18n/dictionaries";

interface I18nContextValue {
  locale: Locale;
  dict: Dictionary;
  setLocale: (locale: Locale) => void;
}

const I18nContext = createContext<I18nContextValue | null>(null);

interface I18nProviderProps {
  locale: Locale;
  children: ReactNode;
}

export function I18nProvider({ locale, children }: I18nProviderProps) {
  const router = useRouter();

  const value = useMemo<I18nContextValue>(
    () => ({
      locale,
      dict: getDictionary(locale),
      setLocale: (next: Locale) => {
        document.cookie = `${LOCALE_COOKIE}=${next}; path=/; max-age=31536000; SameSite=Lax`;
        router.refresh();
      },
    }),
    [locale, router],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useTranslation() {
  const context = useContext(I18nContext);
  if (!context) throw new Error("useTranslation must be used within an I18nProvider");
  return context;
}

import type { Metadata, Viewport } from "next";
import { Sora, Manrope } from "next/font/google";
import { LOCALE_INTL_TAG } from "@/shared/lib/i18n/config";
import { getLocale } from "@/shared/lib/i18n/server";
import { I18nProvider } from "@/shared/lib/i18n/context";
import "./globals.css";

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "CashControl",
  description: "Track what everyone brings in and what's owed. One shared picture, every month.",
  applicationName: "CashControl",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "CashControl",
  },
};

export const viewport: Viewport = {
  themeColor: "#c264af",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();

  return (
    <html
      lang={LOCALE_INTL_TAG[locale]}
      className={`${sora.variable} ${manrope.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-bg-base text-text-primary">
        <I18nProvider locale={locale}>{children}</I18nProvider>
      </body>
    </html>
  );
}

import type { Metadata, Viewport } from "next";
import { Sora, Manrope } from "next/font/google";
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${sora.variable} ${manrope.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-bg-base text-text-primary">{children}</body>
    </html>
  );
}

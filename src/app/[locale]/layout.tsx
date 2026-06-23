import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { SupabaseProvider } from "@/providers/supabase-provider";
import { QueryProvider } from "@/providers/query-provider";
import { ToastProvider } from "@/components/ui/toast";
import { CustomCursor } from "@/components/landing/cursor";
import { Particles } from "@/components/landing/particles";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Glory Agency (Advertising & Marketing)",
  description: "Premium advertising, marketing, design & development for brands that demand excellence",
  verification: {
    google: "googleeed573973f428635",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
  openGraph: {
    title: "Glory Agency (Advertising & Marketing)",
    description: "Premium advertising, marketing, design & development for brands that demand excellence",
    images: [{
      url: "https://glory-digital.vercel.app/og-image.png",
      width: 1200,
      height: 630,
    }],
    type: "website",
  },
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as "en" | "ar")) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale} dir={locale === "ar" ? "rtl" : "ltr"}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-[#0B0B0B]">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <QueryProvider>
            <SupabaseProvider>
              <ToastProvider>
                <CustomCursor />
                <Particles />
                {children}
              </ToastProvider>
            </SupabaseProvider>
          </QueryProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

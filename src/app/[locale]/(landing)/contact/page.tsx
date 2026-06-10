"use client";

import { useTranslations, useLocale, useMessages } from "next-intl";
import { ContactForm } from "@/components/landing/contact-form";

export default function ContactPage() {
  const t = useTranslations("contact");
  const locale = useLocale();
  const messages = useMessages();
  return (
    <div className="pt-24">
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-4xl font-bold text-white mb-4">{t("title")}</h1>
      </div>
      <ContactForm locale={locale} messages={messages} fullPage />
    </div>
  );
}

"use client";

import { useTranslations } from "next-intl";
import { About } from "@/components/landing/about";

export default function AboutPage() {
  const t = useTranslations("about");
  return (
    <div className="pt-24">
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-4xl font-bold text-white mb-4">{t("page_title")}</h1>
        <p className="text-gray-400 max-w-xl mx-auto">{t("page_desc")}</p>
      </div>
      <About title={t("title")} content={t("content")} visible={true} />
    </div>
  );
}

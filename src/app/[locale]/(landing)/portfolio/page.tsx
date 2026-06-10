"use client";

import { useTranslations } from "next-intl";
import { Portfolio } from "@/components/landing/portfolio";

export default function PortfolioPage() {
  const t = useTranslations("portfolio");
  return (
    <div className="pt-24">
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-4xl font-bold text-white mb-4">{t("page_title")}</h1>
        <p className="text-gray-400 max-w-xl mx-auto">{t("page_desc")}</p>
      </div>
      <Portfolio visible={true} />
    </div>
  );
}

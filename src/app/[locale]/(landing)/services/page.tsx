"use client";

import { useTranslations } from "next-intl";
import { ServicesPodium } from "@/components/landing/podium";

export default function ServicesPage() {
  const t = useTranslations("services");
  return (
    <div className="pt-24">
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-4xl font-bold text-white mb-4">{t("page_title")}</h1>
        <p className="text-gray-400 max-w-xl mx-auto">{t("page_desc")}</p>
      </div>
      <ServicesPodium />
    </div>
  );
}

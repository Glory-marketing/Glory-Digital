import { AIManagerForm } from "@/components/admin/ai-manager-form";
import { getTranslations } from "next-intl/server";

export default async function AIManagerPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "admin" });
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">{t("ai_manager_title")}</h1>
        <p className="text-sm text-gray-500">
          {t("ai_manager_desc")}
        </p>
      </div>

      <AIManagerForm />
    </div>
  );
}

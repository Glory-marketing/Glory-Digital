import { getServices } from "@/server-actions/services-actions";
import { ServicesManager } from "@/components/admin/services-manager/services-manager";
import { getTranslations } from "next-intl/server";

export default async function ServicesAdminPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "admin" });
  const services = await getServices();
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">{t("services_title")}</h1>
        <p className="text-sm text-gray-500">{t("services_desc")}</p>
      </div>
      <ServicesManager services={services} />
    </div>
  );
}

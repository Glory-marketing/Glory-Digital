import { getPortfolioProjects } from "@/server-actions/portfolio";
import { PortfolioManager } from "@/components/admin/portfolio-manager/portfolio-manager";
import { getTranslations } from "next-intl/server";

export default async function PortfolioAdminPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "admin" });
  const projects = await getPortfolioProjects();
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">{t("portfolio_title")}</h1>
        <p className="text-sm text-gray-500">{t("portfolio_desc")}</p>
      </div>
      <PortfolioManager projects={projects} />
    </div>
  );
}

import { DashboardStats } from "@/components/admin/dashboard-stats";
import { getTranslations } from "next-intl/server";

export default async function AdminDashboard({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "admin" });

  return (
    <div className="space-y-8">
      <div className="relative overflow-hidden rounded-2xl border border-white/5 bg-gradient-to-br from-[#121212] via-[#121212] to-[#BF953F]/5 p-8">
        <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-[#BF953F]/10 blur-3xl" />
        <div className="absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-[#B38728]/5 blur-3xl" />
        <h1 className="relative text-3xl font-bold">
          <span className="bg-gradient-to-r from-[#BF953F] via-[#FCF6BA] to-[#B38728] bg-clip-text text-transparent">
            {t("dashboard")}
          </span>
        </h1>
        <p className="relative mt-2 text-sm text-gray-400">{t("welcome")}</p>
      </div>

      <DashboardStats locale={locale} />
    </div>
  );
}

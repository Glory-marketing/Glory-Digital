import { AnalyticsCharts } from "@/components/admin/analytics-charts";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { AnalyticsData } from "@/types";
import { getTranslations } from "next-intl/server";

export default async function AnalyticsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "admin" });
  const supabase = await createServerSupabaseClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = supabase.from("leads") as any;

  const { count: totalLeads } = await db.select("*", {
    count: "exact",
    head: true,
  });

  const thirtyDaysAgo = new Date(
    Date.now() - 30 * 24 * 60 * 60 * 1000
  ).toISOString();

  const { data: leadDays } = await db
    .select("created_at")
    .gte("created_at", thirtyDaysAgo)
    .order("created_at");

  const leadsByDayMap = new Map<string, number>();
  const days = (leadDays as { created_at: string }[] | null) || [];
  days.forEach((l: { created_at: string }) => {
    const day = new Date(l.created_at).toISOString().split("T")[0];
    leadsByDayMap.set(day, (leadsByDayMap.get(day) || 0) + 1);
  });

  const leadsByDay = Array.from(leadsByDayMap.entries()).map(
    ([date, count]) => ({ date, count })
  );

  const { data: services } = await db.select("service");
  const serviceMap = new Map<string, number>();
  (services as { service: string }[] | null || []).forEach(
    (s: { service: string }) => {
      serviceMap.set(s.service, (serviceMap.get(s.service) || 0) + 1);
    }
  );

  const leadsByService = Array.from(serviceMap.entries()).map(
    ([service, count]) => ({ service, count })
  );

  const { data: sources } = await db.select("utm_source");
  const sourceMap = new Map<string, number>();
  (sources as { utm_source: string | null }[] | null || []).forEach(
    (s: { utm_source: string | null }) => {
      const src = s.utm_source || "direct";
      sourceMap.set(src, (sourceMap.get(src) || 0) + 1);
    }
  );

  const leadsBySource = Array.from(sourceMap.entries()).map(
    ([source, count]) => ({ source, count })
  );

  const analyticsData: AnalyticsData = {
    totalLeads: totalLeads || 0,
    conversionRate: 0,
    chatbotConversations: 0,
    analyzerScans: 0,
    leadsByDay,
    leadsByService,
    leadsBySource,
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">{t("analytics_title")}</h1>
        <p className="text-sm text-gray-500">{t("analytics_desc")}</p>
      </div>

      <AnalyticsCharts data={analyticsData} />
    </div>
  );
}

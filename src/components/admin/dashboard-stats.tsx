import { Card } from "@/components/ui/card";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { getTranslations } from "next-intl/server";

export async function DashboardStats({ locale }: { locale: string }) {
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

  const { count: recentLeads } = await db
    .select("*", { count: "exact", head: true })
    .gte("created_at", thirtyDaysAgo);

  const { count: newLeads } = await db
    .select("*", { count: "exact", head: true })
    .eq("status", "new");

  const t = await getTranslations({ locale, namespace: "admin" });

  const stats = [
    { label: t("total_leads"), value: totalLeads || 0 },
    { label: t("leads_30d"), value: recentLeads || 0 },
    { label: t("new_leads"), value: newLeads || 0 },
    { label: t("conversion_rate"), value: "—" },
  ];

  const icons = ["📊", "📈", "⭐", "🎯"];

  return (
    <div className="grid gap-4 md:grid-cols-4">
      {stats.map((stat, i) => (
        <Card key={stat.label} className="group relative overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:border-[#BF953F]/30">
          <div className="absolute -right-6 -top-6 h-16 w-16 rounded-full bg-gradient-to-br from-[#BF953F]/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-400">{stat.label}</p>
              <p className="mt-1 text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">{stat.value}</p>
            </div>
            <span className="text-2xl opacity-50">{icons[i]}</span>
          </div>
        </Card>
      ))}
    </div>
  );
}

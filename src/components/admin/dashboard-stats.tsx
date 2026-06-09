import { Card } from "@/components/ui/card";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function DashboardStats() {
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

  const stats = [
    { label: "Total Leads", value: totalLeads || 0 },
    { label: "Leads (30 days)", value: recentLeads || 0 },
    { label: "New Leads", value: newLeads || 0 },
    { label: "Conversion Rate", value: "—" },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.label}>
          <p className="text-sm text-gray-400">{stat.label}</p>
          <p className="mt-1 text-2xl font-bold text-white">{stat.value}</p>
        </Card>
      ))}
    </div>
  );
}

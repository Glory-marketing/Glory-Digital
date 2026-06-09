import { LeadsTable } from "@/components/admin/leads-table";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui/card";

export default async function LeadsPage() {
  const supabase = await createServerSupabaseClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = supabase.from("leads") as any;

  const { data: leads } = await db
    .select("*")
    .order("created_at", { ascending: false });

  const { count: total } = await db.select("*", {
    count: "exact",
    head: true,
  });

  const { count: newLeads } = await db
    .select("*", { count: "exact", head: true })
    .eq("status", "new");

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Leads</h1>
        <p className="text-sm text-gray-500">Manage incoming leads</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <p className="text-sm text-gray-400">Total</p>
          <p className="mt-1 text-2xl font-bold text-white">{total || 0}</p>
        </Card>
        <Card>
          <p className="text-sm text-gray-400">New</p>
          <p className="mt-1 text-2xl font-bold text-[#BF953F]">
            {newLeads || 0}
          </p>
        </Card>
        <Card>
          <p className="text-sm text-gray-400">Contacted</p>
          <p className="mt-1 text-2xl font-bold text-white">—</p>
        </Card>
      </div>

      <LeadsTable leads={leads || []} />
    </div>
  );
}

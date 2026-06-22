import { createServerSupabaseClient } from "@/lib/supabase/server";
import { getTranslations } from "next-intl/server";
import { ClientsTable } from "@/components/admin/clients-table";
import type { Profile } from "@/types/database";

export default async function ClientsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "admin" });
  const supabase = await createServerSupabaseClient();

  // Get users who are either explicitly Client role OR have client_projects
  const { data: rawClients } = await supabase
    .from("profiles")
    .select("*")
    .or("role.eq.Client,role.eq.Editor")
    .order("created_at", { ascending: false });

  const clients = (rawClients || []) as unknown as Profile[];

  // Also get users who have client_projects to cross-reference
  const { data: projectClientsRaw } = await supabase
    .from("client_projects" as never)
    .select("client_email") as unknown as { data: { client_email: string }[] | null };

  const projectEmails = new Set(projectClientsRaw?.map((p) => p.client_email?.toLowerCase()) || []);

  // Filter: show users who are Client role, OR have Editor role but have associated client projects
  const filteredClients = clients.filter(
    (c) => c.role === "Client" || projectEmails.has(c.email?.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">{t("clients_title")}</h1>
        <p className="text-sm text-gray-500">{t("clients_desc")}</p>
      </div>

      <ClientsTable clients={filteredClients || []} locale={locale} />
    </div>
  );
}

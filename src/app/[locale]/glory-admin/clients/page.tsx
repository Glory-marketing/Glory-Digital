import { createAdminClient } from "@/lib/supabase/admin";
import { getTranslations } from "next-intl/server";
import { ClientsTable } from "@/components/admin/clients-table";
import type { Profile } from "@/types/database";

export const dynamic = "force-dynamic";

export default async function ClientsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "admin" });
  const adminClient = createAdminClient();

  const profDb = adminClient.from("profiles");

  const { data: rawClients } = await profDb
    .select("*")
    .or("role.eq.Client,role.eq.Editor")
    .order("created_at", { ascending: false }) as unknown as { data: Profile[] | null };

  const clients = (rawClients || []) as Profile[];

  const { data: projectClientsRaw } = await adminClient
    .from("client_projects")
    .select("client_email") as unknown as { data: { client_email: string }[] | null };

  const projectEmails = new Set(projectClientsRaw?.map((p) => p.client_email?.toLowerCase()) || []);

  const filteredClients = clients.filter(
    (c) => c.role === "Client" || projectEmails.has(c.email?.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">{t("clients_title")}</h1>
        <p className="text-sm text-gray-500">{t("clients_desc")}</p>
      </div>

      <ClientsTable clients={filteredClients} locale={locale} />
    </div>
  );
}

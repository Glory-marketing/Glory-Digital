import { createServerSupabaseClient } from "@/lib/supabase/server";
import { getTranslations } from "next-intl/server";
import { ClientsTable } from "@/components/admin/clients-table";

export default async function ClientsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "admin" });
  const supabase = await createServerSupabaseClient();

  const { data: clients } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">{t("clients_title")}</h1>
        <p className="text-sm text-gray-500">{t("clients_desc")}</p>
      </div>

      <ClientsTable clients={clients || []} locale={locale} />
    </div>
  );
}

import { VaultForm } from "@/components/admin/vault-form";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";

export default async function VaultPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "admin" });
  const supabase = await createServerSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect(`/${locale}`);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const profile = (await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single()
    .then((r) => r.data)) as { role: string } | null;

  if (profile?.role !== "Super_Admin") {
    redirect(`/${locale}/glory-admin`);
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">{t("vault_title")}</h1>
        <p className="text-sm text-gray-500">
          {t("vault_desc")}
        </p>
      </div>

      <VaultForm />
    </div>
  );
}

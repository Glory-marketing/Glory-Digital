import { PricingForm } from "@/components/admin/pricing-form";
import { PrintingMaterialsForm } from "@/components/admin/printing-materials-form";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";

export default async function PricingPage({
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

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">{t("pricing_title")}</h1>
        <p className="text-sm text-gray-500">{t("pricing_desc")}</p>
      </div>

      <PricingForm />

      <div className="pt-4">
        <h2 className="mb-4 text-xl font-bold text-white">{t("printing_materials")}</h2>
        <PrintingMaterialsForm />
      </div>
    </div>
  );
}

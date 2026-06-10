import { PageBuilderForm } from "@/components/admin/page-builder-form";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { getTranslations } from "next-intl/server";

export default async function PageBuilderPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "admin" });
  const supabase = await createServerSupabaseClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ctDb = supabase.from("content_translations") as any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const pcDb = supabase.from("page_content") as any;

  const { data: sections } = await ctDb.select("*").order("section");
  const { data: visibilities } = await pcDb.select("section, locale, is_visible");

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">{t("page_builder_title")}</h1>
        <p className="text-sm text-gray-500">{t("page_builder_desc")}</p>
      </div>

      <PageBuilderForm
        sections={sections || []}
        visibilities={visibilities || []}
        locale={locale}
      />
    </div>
  );
}

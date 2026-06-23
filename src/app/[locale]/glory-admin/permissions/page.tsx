import { getTranslations } from "next-intl/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { PermissionsManager } from "@/components/admin/permissions-manager";

export const dynamic = "force-dynamic";

export default async function PermissionsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "admin" });
  const adminClient = createAdminClient();

  const { data: permissions } = await adminClient
    .from("permissions")
    .select("*")
    .order("module")
    .order("key") as unknown as { data: any[] | null };

  const { data: rolePermissions } = await adminClient
    .from("role_permissions")
    .select("*") as unknown as { data: any[] | null };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">
            {locale === "ar" ? "إدارة الصلاحيات" : "Permission Manager"}
          </h1>
          <p className="text-sm text-gray-500">
            {locale === "ar"
              ? "تحكم في صلاحيات كل دور في النظام"
              : "Control what each role can access"}
          </p>
        </div>
      </div>

      <PermissionsManager
        permissions={permissions || []}
        rolePermissions={rolePermissions || []}
        locale={locale}
      />
    </div>
  );
}

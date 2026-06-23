import { TeamInvite } from "@/components/admin/team-invite";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getTranslations } from "next-intl/server";
import type { Profile } from "@/types/database";

export const dynamic = "force-dynamic";

export default async function TeamPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "admin" });
  const supabase = await createServerSupabaseClient();
  const adminClient = createAdminClient();

  const { data: { user } } = await supabase.auth.getUser();

  const profDb = adminClient.from("profiles");
  const invDb = adminClient.from("invitations");

  const { data: members } = await profDb
    .select("*")
    .order("created_at", { ascending: false }) as unknown as { data: Profile[] | null };

  const { data: invitations } = await invDb
    .select("*")
    .order("created_at", { ascending: false });

  let userRole: string | null = null;
  if (user) {
    const { data: profile } = await profDb
      .select("role")
      .eq("id", user.id)
      .single() as unknown as { data: { role: string } | null };
    userRole = profile?.role || null;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">{t("team_title")}</h1>
        <p className="text-sm text-gray-500">
          {t("team_desc")}
        </p>
      </div>

      <TeamInvite members={members || []} invitations={invitations || []} userRole={userRole} />
    </div>
  );
}

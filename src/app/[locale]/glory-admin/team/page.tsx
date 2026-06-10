import { TeamInvite } from "@/components/admin/team-invite";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { getTranslations } from "next-intl/server";

export default async function TeamPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "admin" });
  const supabase = await createServerSupabaseClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const profDb = supabase.from("profiles") as any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const invDb = supabase.from("invitations") as any;

  const { data: members } = await profDb
    .select("*")
    .order("created_at", { ascending: false });

  const { data: invitations } = await invDb
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">{t("team_title")}</h1>
        <p className="text-sm text-gray-500">
          {t("team_desc")}
        </p>
      </div>

      <TeamInvite members={members || []} invitations={invitations || []} />
    </div>
  );
}

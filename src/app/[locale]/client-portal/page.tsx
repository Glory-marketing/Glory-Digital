import { createServerSupabaseClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import type { ClientProject } from "@/types/database";
import PortalParticles from "@/components/client-portal/particles-bg";
import DashboardContent from "./dashboard-content";

export const dynamic = "force-dynamic";

export default async function ClientPortalDashboard({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "common" });
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user?.email) {
    redirect(`/${locale}/client-portal/login`);
  }

  const { data: projects } = await supabase
    .from("client_projects" as never)
    .select("*")
    .or(`client_email.eq.${user.email},client_id.eq.${user.id}`)
    .order("created_at", { ascending: false }) as unknown as { data: ClientProject[] | null };

  const stats = {
    total: projects?.length || 0,
    inProgress: projects?.filter((p) => p.status === "in_progress").length || 0,
    revision: projects?.filter((p) => p.status === "revision").length || 0,
    completed: projects?.filter((p) => p.status === "completed" || p.status === "delivered").length || 0,
  };

  const { data: profile } = await supabase
    .from("profiles" as never)
    .select("full_name, avatar_url")
    .eq("id", user.id)
    .single() as unknown as { data: { full_name: string | null; avatar_url: string | null } | null };

  return (
    <div className="relative min-h-screen bg-[#0B0B0B]">
      <PortalParticles />
      <DashboardContent
        locale={locale}
        projects={projects || []}
        stats={stats}
        userName={profile?.full_name || null}
        userEmail={user.email}
        userAvatar={profile?.avatar_url || null}
      />
    </div>
  );
}

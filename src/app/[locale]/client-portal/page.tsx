import { createServerSupabaseClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import type { ClientProject } from "@/types/database";
import PortalParticles from "@/components/client-portal/particles-bg";
import AIChat from "@/components/client-portal/ai-chat";
import ClientDashboardClient from "./client-dashboard-client";

const statusColors: Record<string, string> = {
  pending: "bg-gray-500/20 text-gray-300 border-gray-500/30",
  in_progress: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  revision: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
  completed: "bg-green-500/20 text-green-300 border-green-500/30",
  delivered: "bg-[#BF953F]/20 text-[#FCF6BA] border-[#BF953F]/30",
};

function StatusBadge({ status }: { status: string }) {
  const color = statusColors[status] || "bg-gray-500/20 text-gray-300 border-gray-500/30";
  return (
    <span className={`rounded-full border px-3 py-1 text-xs font-medium ${color}`}>
      {status.replace(/_/g, " ")}
    </span>
  );
}

function StatsCard({ label, value, sub, color }: { label: string; value: number; sub?: string; color: string }) {
  return (
    <div className="rounded-2xl border border-white/5 bg-[#121212] p-5 transition-all hover:border-[#BF953F]/30">
      <p className="text-sm text-gray-500">{label}</p>
      <p className={`mt-1 text-2xl font-bold ${color}`}>{value}</p>
      {sub && <p className="mt-1 text-xs text-gray-600">{sub}</p>}
    </div>
  );
}

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

  // Fetch projects by both client_email and client_id
  const { data: projects } = await supabase
    .from("client_projects" as never)
    .select("*")
    .or(`client_email.eq.${user.email},client_id.eq.${user.id}`)
    .order("created_at", { ascending: false }) as unknown as { data: ClientProject[] | null; error: unknown };

  const stats = {
    total: projects?.length || 0,
    inProgress: projects?.filter((p) => p.status === "in_progress").length || 0,
    revision: projects?.filter((p) => p.status === "revision").length || 0,
    completed: projects?.filter((p) => p.status === "completed" || p.status === "delivered").length || 0,
  };

  return (
    <div className="relative min-h-screen bg-[#0B0B0B]" dir={locale === "ar" ? "rtl" : "ltr"}>
      <PortalParticles />

      <div className="relative z-10 px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          {/* Header */}
          <div className="mb-10">
            <h1 className="bg-gradient-to-r from-[#BF953F] via-[#FCF6BA] to-[#B38728] bg-clip-text text-3xl font-bold text-transparent sm:text-4xl">
              {locale === "ar" ? "لوحة التحكم" : "Dashboard"}
            </h1>
            <p className="mt-2 text-sm text-gray-500">
              {locale === "ar" ? `مرحباً بعودتك، ${user.email}` : `Welcome back, ${user.email}`}
            </p>
          </div>

          {/* Stats Grid */}
          <div className="mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="animate-on-scroll translate-y-4 opacity-0 transition-all duration-500">
              <StatsCard label={locale === "ar" ? "إجمالي المشاريع" : "Total Projects"} value={stats.total} color="text-white" />
            </div>
            <div className="animate-on-scroll translate-y-4 opacity-0 transition-all duration-500 delay-100">
              <StatsCard label={locale === "ar" ? "قيد التنفيذ" : "In Progress"} value={stats.inProgress} color="text-blue-400" />
            </div>
            <div className="animate-on-scroll translate-y-4 opacity-0 transition-all duration-500 delay-200">
              <StatsCard label={locale === "ar" ? "مراجعة" : "In Revision"} value={stats.revision} color="text-yellow-400" />
            </div>
            <div className="animate-on-scroll translate-y-4 opacity-0 transition-all duration-500 delay-300">
              <StatsCard label={locale === "ar" ? "مكتمل" : "Completed"} value={stats.completed} color="text-green-400" />
            </div>
          </div>

          {/* Projects Section */}
          <div className="mb-10">
            <h2 className="mb-4 text-xl font-semibold text-white">
              {locale === "ar" ? "المشاريع" : "Projects"}
            </h2>
            <div className="space-y-4">
              {!projects || projects.length === 0 ? (
                <div className="rounded-2xl border border-white/5 bg-[#121212] p-16 text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/5">
                    <svg className="h-8 w-8 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                  <p className="text-gray-500">
                    {locale === "ar" ? "لا توجد مشاريع بعد" : "No projects yet"}
                  </p>
                  <p className="mt-1 text-xs text-gray-600">
                    {locale === "ar" ? "عند بدء مشروع جديد، سيظهر هنا" : "When a new project is started, it will appear here"}
                  </p>
                </div>
              ) : (
                projects.map((project: ClientProject, i: number) => (
                  <div
                    key={project.id}
                    className="animate-on-scroll group translate-y-4 opacity-0 transition-all duration-500 rounded-2xl border border-white/5 bg-[#121212] p-6 hover:border-[#BF953F]/30 hover:bg-[#151515]"
                    style={{ transitionDelay: `${100 + i * 50}ms` }}
                  >
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#BF953F]/20 to-[#B38728]/20 text-lg">
                            📁
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-white">
                              {project.project_name}
                            </h3>
                            <p className="text-sm text-gray-500">
                              {project.project_type}
                            </p>
                          </div>
                        </div>
                      </div>
                      <StatusBadge status={project.status} />
                    </div>

                    <div className="mt-4 flex flex-wrap gap-6 text-sm">
                      {project.budget && (
                        <div>
                          <span className="text-gray-500">{locale === "ar" ? "الميزانية:" : "Budget:"}</span>{" "}
                          <span className="text-white font-medium">{project.budget}</span>
                        </div>
                      )}
                      <div>
                        <span className="text-gray-500">{locale === "ar" ? "التاريخ:" : "Date:"}</span>{" "}
                        <span className="text-white">
                          {new Date(project.created_at).toLocaleDateString(
                            locale === "ar" ? "ar-EG" : "en-US",
                            { year: "numeric", month: "short", day: "numeric" }
                          )}
                        </span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    {project.status === "in_progress" && (
                      <div className="mt-4">
                        <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/5">
                          <div className="h-full w-2/3 rounded-full bg-gradient-to-r from-[#BF953F] to-[#FCF6BA]" />
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Footer Link */}
          <div className="text-center">
            <a
              href={`/${locale}`}
              className="text-xs text-gray-500 hover:text-[#BF953F] transition-colors"
            >
              {locale === "ar" ? "← العودة للرئيسية" : "← Back to home"}
            </a>
          </div>
        </div>
      </div>

      <AIChat locale={locale} />
      <ClientDashboardClient locale={locale} />
    </div>
  );
}

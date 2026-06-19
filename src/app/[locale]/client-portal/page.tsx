import { createServerSupabaseClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import type { ClientProject } from "@/types/database";

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
    .eq("client_email", user.email)
    .order("created_at", { ascending: false }) as unknown as { data: ClientProject[] | null; error: unknown };

  return (
    <div className="min-h-screen bg-[#0B0B0B] px-4 py-24" dir={locale === "ar" ? "rtl" : "ltr"}>
      <div className="mx-auto max-w-5xl">
        <h1 className="bg-gradient-to-r from-[#BF953F] via-[#FCF6BA] to-[#B38728] bg-clip-text text-3xl font-bold text-transparent">
          {locale === "ar" ? "مشاريعي" : "My Projects"}
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          {locale === "ar" ? `مرحباً، ${user.email}` : `Welcome, ${user.email}`}
        </p>

        <div className="mt-8 space-y-4">
          {!projects || projects.length === 0 ? (
            <div className="rounded-2xl border border-white/5 bg-[#121212] p-12 text-center">
              <p className="text-gray-500">
                {locale === "ar" ? "لا توجد مشاريع بعد" : "No projects yet"}
              </p>
            </div>
          ) : (
            projects.map((project: ClientProject) => (
              <div
                key={project.id}
                className="rounded-2xl border border-white/5 bg-[#121212] p-6 transition-all hover:border-[#BF953F]/30"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white">
                      {project.project_name}
                    </h3>
                    <p className="mt-1 text-sm text-gray-400">
                      {project.project_type}
                    </p>
                  </div>
                  <StatusBadge status={project.status} />
                </div>

                <div className="mt-4 flex flex-wrap gap-6 text-sm">
                  {project.budget && (
                    <div>
                      <span className="text-gray-500">{locale === "ar" ? "الميزانية:" : "Budget:"}</span>{" "}
                      <span className="text-white">{project.budget}</span>
                    </div>
                  )}
                  <div>
                    <span className="text-gray-500">{locale === "ar" ? "التاريخ:" : "Date:"}</span>{" "}
                    <span className="text-white">
                      {new Date(project.created_at).toLocaleDateString(locale === "ar" ? "ar-EG" : "en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="mt-8 text-center">
          <a
            href={`/${locale}`}
            className="text-xs text-gray-500 hover:text-[#BF953F] transition-colors"
          >
            {locale === "ar" ? "العودة للرئيسية" : "Back to home"}
          </a>
        </div>
      </div>
    </div>
  );
}

import { createServerSupabaseClient } from "@/lib/supabase/server";
import { getTranslations } from "next-intl/server";
import type { ClientProject } from "@/types/database";

const STATUSES = ["pending", "in_progress", "revision", "completed", "delivered"];

const STATUS_LABELS: Record<string, { en: string; ar: string }> = {
  pending: { en: "Pending", ar: "قيد الانتظار" },
  in_progress: { en: "In Progress", ar: "قيد التنفيذ" },
  revision: { en: "Revision", ar: "مراجعة" },
  completed: { en: "Completed", ar: "مكتمل" },
  delivered: { en: "Delivered", ar: "تم التسليم" },
};

function formatDate(dateStr: string, locale: string) {
  return new Intl.DateTimeFormat(locale === "ar" ? "ar-EG" : "en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(dateStr));
}

function StatusTimeline({ currentIdx, locale }: { currentIdx: number; locale: string }) {
  return (
    <div className="relative flex items-start justify-between">
      {STATUSES.map((status, i) => {
        const isCompleted = i <= currentIdx;
        const isCurrent = i === currentIdx;
        return (
          <div key={status} className="flex flex-col items-center flex-1">
            <div className="relative z-10 flex flex-col items-center">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full border-2 text-sm font-bold transition-all duration-300 ${
                  isCompleted
                    ? "border-[#BF953F] bg-gradient-to-br from-[#BF953F] to-[#B38728] text-black"
                    : "border-white/20 bg-[#121212] text-gray-500"
                } ${isCurrent && !isCompleted ? "animate-pulse" : ""}`}
              >
                {isCompleted ? "✓" : i + 1}
              </div>
              <span
                className={`mt-2 text-xs font-medium ${
                  isCompleted ? "text-[#FCF6BA]" : "text-gray-500"
                }`}
              >
                {STATUS_LABELS[status]?.[locale === "ar" ? "ar" : "en"] || status}
              </span>
            </div>
            {i < STATUSES.length - 1 && (
              <div
                className={`absolute top-5 h-[2px] transition-all duration-500 ${
                  i < currentIdx ? "bg-gradient-to-r from-[#BF953F] to-[#B38728]" : "bg-white/10"
                }`}
                style={{
                  left: `${(i / (STATUSES.length - 1)) * 100}%`,
                  width: `${100 / (STATUSES.length - 1)}%`,
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

export default async function TrackPage({
  params,
}: {
  params: Promise<{ locale: string; code: string }>;
}) {
  const { locale, code } = await params;
  const t = await getTranslations({ locale, namespace: "common" });

  const supabase = await createServerSupabaseClient();
  const { data: project } = await supabase
    .from("client_projects")
    .select("*")
    .eq("id", code)
    .single() as unknown as { data: ClientProject | null; error: unknown };

  if (!project) {
    return (
      <div className="pt-24">
        <div className="container mx-auto px-4 py-20 text-center">
          <div className="mx-auto max-w-md rounded-2xl border border-white/5 bg-[#121212] p-12">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-[#BF953F]/20 to-[#FCF6BA]/20">
              <span className="text-3xl text-[#FCF6BA]">!</span>
            </div>
            <h2 className="mb-2 text-xl font-semibold text-white">
              {locale === "ar" ? "الطلب غير موجود" : "Order Not Found"}
            </h2>
            <p className="text-gray-400">
              {locale === "ar"
                ? "الطلب الذي تبحث عنه غير موجود أو الرابط غير صالح."
                : "The order you're looking for doesn't exist or the link is invalid."}
            </p>
          </div>
        </div>
      </div>
    );
  }

  const currentIdx = STATUSES.indexOf(project.status);

  return (
    <div className="pt-24">
      <section className="relative overflow-hidden pb-20 pt-10">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0B0B0B] via-[#0B0B0B] to-[#121212]" />
        <div className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-[#BF953F]/10 via-transparent to-[#FCF6BA]/5 blur-3xl" />

        <div className="container relative z-10 mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-2 text-4xl font-bold md:text-5xl">
              <span className="bg-gradient-to-r from-[#BF953F] via-[#FCF6BA] to-[#B38728] bg-clip-text text-transparent">
                {locale === "ar" ? "تتبع الطلب" : "Order Tracking"}
              </span>
            </h1>
            <p className="mb-10 text-gray-400">
              {locale === "ar"
                ? `حالة الطلب: ${project.project_name}`
                : `Status for: ${project.project_name}`}
            </p>
          </div>

          <div className="mx-auto max-w-3xl">
            <div className="mb-8 rounded-2xl border border-white/5 bg-[#121212]/80 p-8 backdrop-blur-xl">
              <StatusTimeline currentIdx={currentIdx} locale={locale} />
            </div>

            <div className="rounded-2xl border border-white/5 bg-[#121212]/80 p-8 backdrop-blur-xl">
              <div
                className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2"
                dir={locale === "ar" ? "rtl" : "ltr"}
              >
                <div>
                  <label className="mb-1 block text-xs font-medium uppercase tracking-wider text-gray-500">
                    {locale === "ar" ? "اسم العميل" : "Client Name"}
                  </label>
                  <p className="text-white">{project.client_name}</p>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium uppercase tracking-wider text-gray-500">
                    {locale === "ar" ? "اسم المشروع" : "Project Name"}
                  </label>
                  <p className="text-white">{project.project_name}</p>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium uppercase tracking-wider text-gray-500">
                    {locale === "ar" ? "نوع المشروع" : "Project Type"}
                  </label>
                  <p className="text-white">{project.project_type}</p>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium uppercase tracking-wider text-gray-500">
                    {locale === "ar" ? "الحالة" : "Status"}
                  </label>
                  <span className="inline-block rounded-full bg-[#BF953F]/10 px-3 py-1 text-xs font-medium text-[#FCF6BA]">
                    {STATUS_LABELS[project.status]?.[locale === "ar" ? "ar" : "en"] || project.status}
                  </span>
                </div>
                {project.budget && (
                  <div>
                    <label className="mb-1 block text-xs font-medium uppercase tracking-wider text-gray-500">
                      {locale === "ar" ? "الميزانية" : "Budget"}
                    </label>
                    <p className="text-white">{project.budget}</p>
                  </div>
                )}
                <div>
                  <label className="mb-1 block text-xs font-medium uppercase tracking-wider text-gray-500">
                    {locale === "ar" ? "تاريخ الإنشاء" : "Created"}
                  </label>
                  <p className="text-white">{formatDate(project.created_at, locale)}</p>
                </div>
              </div>

              {project.notes && (
                <div className="border-t border-white/5 pt-6">
                  <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-gray-500">
                    {locale === "ar" ? "ملاحظات" : "Notes"}
                  </label>
                  <p className="text-sm leading-relaxed text-gray-300">{project.notes}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

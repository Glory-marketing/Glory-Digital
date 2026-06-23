"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AIChat from "@/components/client-portal/ai-chat";
import type { ClientProject } from "@/types/database";

interface DashboardContentProps {
  locale: string;
  projects: ClientProject[];
  stats: { total: number; inProgress: number; revision: number; completed: number };
  userName: string | null;
  userEmail: string;
  userAvatar?: string | null;
}

const statusConfig: Record<string, { label: string; color: string; barColor: string }> = {
  pending:       { label: "Pending",       color: "border-gray-500/30 bg-gray-500/10 text-gray-300",    barColor: "bg-gray-500" },
  in_progress:   { label: "In Progress",   color: "border-blue-500/30 bg-blue-500/10 text-blue-300",   barColor: "bg-blue-500" },
  revision:      { label: "Revision",      color: "border-yellow-500/30 bg-yellow-500/10 text-yellow-300", barColor: "bg-yellow-500" },
  completed:     { label: "Completed",     color: "border-green-500/30 bg-green-500/10 text-green-300", barColor: "bg-green-500" },
  delivered:     { label: "Delivered",     color: "border-[#BF953F]/30 bg-[#BF953F]/10 text-[#FCF6BA]", barColor: "bg-[#BF953F]" },
};

function getProgress(status: string): number {
  const map: Record<string, number> = { pending: 10, in_progress: 50, revision: 70, completed: 95, delivered: 100 };
  return map[status] || 25;
}

export default function DashboardContent({ locale, projects, stats, userName, userEmail }: DashboardContentProps) {
  const [selectedProject, setSelectedProject] = useState<ClientProject | null>(null);
  const [showNewProject, setShowNewProject] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  return (
    <div className="relative z-10 px-4 py-24 sm:px-6 lg:px-8" dir={locale === "ar" ? "rtl" : "ltr"}>
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-10 flex items-start justify-between">
          <div>
            <h1 className="bg-gradient-to-r from-[#BF953F] via-[#FCF6BA] to-[#B38728] bg-clip-text text-3xl font-bold text-transparent sm:text-4xl">
              {locale === "ar" ? "لوحة التحكم" : "Dashboard"}
            </h1>
            <p className="mt-2 text-sm text-gray-500">
              {locale === "ar" ? `مرحباً بعودتك، ${userName || userEmail}` : `Welcome back, ${userName || userEmail}`}
            </p>
          </div>
          <div className="flex gap-3">
            <button onClick={() => setShowProfile(!showProfile)} className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-lg hover:border-[#BF953F]/30 transition-all">
              ⚙️
            </button>
            <button onClick={() => setShowNewProject(true)} className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#BF953F] to-[#B38728] px-4 py-2 text-sm font-semibold text-black hover:brightness-110 transition-all">
              {locale === "ar" ? "+ مشروع جديد" : "+ New Project"}
            </button>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.08 } } }} className="mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: locale === "ar" ? "إجمالي المشاريع" : "Total Projects", value: stats.total, icon: "📊", color: "text-white" },
            { label: locale === "ar" ? "قيد التنفيذ" : "In Progress", value: stats.inProgress, icon: "⚡", color: "text-blue-400" },
            { label: locale === "ar" ? "مراجعة" : "In Revision", value: stats.revision, icon: "🔄", color: "text-yellow-400" },
            { label: locale === "ar" ? "مكتمل" : "Completed", value: stats.completed, icon: "✅", color: "text-green-400" },
          ].map((s) => (
            <motion.div key={s.label} variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} className="group relative overflow-hidden rounded-2xl border border-white/5 bg-[#121212] p-5 transition-all hover:border-[#BF953F]/30">
              <div className="absolute -right-4 -top-4 h-16 w-16 rounded-full bg-[#BF953F]/5 blur-xl transition-all group-hover:bg-[#BF953F]/10" />
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-500">{s.label}</p>
                  <motion.p initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 100 }} className={`mt-1 text-3xl font-bold ${s.color}`}>
                    {s.value}
                  </motion.p>
                </div>
                <span className="text-2xl">{s.icon}</span>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Projects + Activity Side by Side */}
        <div className="mb-10 grid gap-8 lg:grid-cols-3">
          {/* Projects List */}
          <div className="lg:col-span-2">
            <h2 className="mb-4 text-xl font-semibold text-white">
              {locale === "ar" ? "المشاريع" : "Projects"}
            </h2>
            {projects.length === 0 ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-2xl border border-white/5 bg-[#121212] p-16 text-center">
                <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-white/5">
                  <span className="text-4xl">📁</span>
                </div>
                <p className="text-lg text-gray-400">{locale === "ar" ? "لا توجد مشاريع بعد" : "No projects yet"}</p>
                <p className="mt-1 text-sm text-gray-600">{locale === "ar" ? "اطلب مشروع جديد وابدأ رحلة الإبداع" : "Request a new project and start your creative journey"}</p>
                <button onClick={() => setShowNewProject(true)} className="mt-6 rounded-xl bg-gradient-to-r from-[#BF953F] to-[#B38728] px-6 py-3 text-sm font-semibold text-black hover:brightness-110 transition-all">
                  {locale === "ar" ? "اطلب مشروع جديد" : "Request New Project"}
                </button>
              </motion.div>
            ) : (
              <div className="space-y-3">
                {projects.map((project, i) => {
                  const cfg = statusConfig[project.status] || statusConfig.pending;
                  const progress = getProgress(project.status);
                  return (
                    <motion.div
                      key={project.id}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      onClick={() => setSelectedProject(selectedProject?.id === project.id ? null : project)}
                      className="cursor-pointer rounded-2xl border border-white/5 bg-[#121212] p-5 transition-all hover:border-[#BF953F]/30 hover:bg-[#151515]"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#BF953F]/20 to-[#B38728]/20 text-lg">
                            📄
                          </div>
                          <div>
                            <h3 className="font-semibold text-white">{project.project_name}</h3>
                            <p className="text-xs text-gray-500">{project.project_type}</p>
                          </div>
                        </div>
                        <span className={`rounded-full border px-3 py-0.5 text-xs font-medium ${cfg.color}`}>{cfg.label}</span>
                      </div>

                      <div className="mt-3 flex items-center gap-4 text-xs text-gray-500">
                        {project.budget && <span>💰 {project.budget}</span>}
                        <span>📅 {new Date(project.created_at).toLocaleDateString(locale === "ar" ? "ar-EG" : "en-US", { year: "numeric", month: "short", day: "numeric" })}</span>
                      </div>

                      <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-white/5">
                        <motion.div initial={{ width: 0 }} animate={{ width: `${progress}%` }} transition={{ duration: 1, ease: "easeOut" }} className={`h-full rounded-full ${cfg.barColor}`} />
                      </div>

                      <AnimatePresence>
                        {selectedProject?.id === project.id && (
                          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                            <div className="mt-4 border-t border-white/5 pt-4">
                              <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                  <p className="text-xs text-gray-500">{locale === "ar" ? "ملاحظات" : "Notes"}</p>
                                  <p className="text-gray-300">{project.notes || (locale === "ar" ? "لا توجد ملاحظات" : "No notes")}</p>
                                </div>
                                <div>
                                  <p className="text-xs text-gray-500">{locale === "ar" ? "الملفات" : "Files"}</p>
                                  <button className="mt-1 rounded-lg bg-white/5 px-3 py-1.5 text-xs text-[#BF953F] hover:bg-white/10 transition-colors">
                                    {locale === "ar" ? "+ إضافة ملفات" : "+ Upload Files"}
                                  </button>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Activity Feed */}
          <div>
            <h2 className="mb-4 text-xl font-semibold text-white">
              {locale === "ar" ? "آخر النشاطات" : "Recent Activity"}
            </h2>
            <div className="rounded-2xl border border-white/5 bg-[#121212] p-5">
              {projects.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-8">
                  {locale === "ar" ? "لا توجد نشاطات بعد" : "No activity yet"}
                </p>
              ) : (
                <div className="space-y-4">
                  {projects.slice(0, 5).map((project, i) => (
                    <motion.div key={project.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} className="relative flex gap-3">
                      <div className="flex flex-col items-center">
                        <div className={`flex h-7 w-7 items-center justify-center rounded-full text-xs ${statusConfig[project.status]?.barColor || "bg-gray-500"} text-white`}>
                          {i + 1}
                        </div>
                        {i < Math.min(projects.length, 5) - 1 && <div className="mt-1 h-full w-px bg-white/5" />}
                      </div>
                      <div className="pb-4">
                        <p className="text-sm font-medium text-white">{project.project_name}</p>
                        <p className="text-xs text-gray-500">
                          {locale === "ar" ? `تم التحديث إلى ${statusConfig[project.status]?.label || project.status}` : `Updated to ${statusConfig[project.status]?.label || project.status}`}
                        </p>
                        <p className="text-xs text-gray-600 mt-0.5">
                          {new Date(project.updated_at || project.created_at).toLocaleDateString(locale === "ar" ? "ar-EG" : "en-US", { month: "short", day: "numeric" })}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Links */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }} className="flex items-center justify-center gap-6 text-xs text-gray-600">
          <a href={`/${locale}`} className="hover:text-[#BF953F] transition-colors">
            {locale === "ar" ? "← العودة للرئيسية" : "← Back to home"}
          </a>
          <a href={`/${locale}/contact`} className="hover:text-[#BF953F] transition-colors">
            {locale === "ar" ? "اتصل بنا" : "Contact us"}
          </a>
        </motion.div>
      </div>

      {/* New Project Modal */}
      <AnimatePresence>
        {showNewProject && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="w-full max-w-lg rounded-2xl border border-white/10 bg-[#121212] p-8 shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">{locale === "ar" ? "طلب مشروع جديد" : "New Project Request"}</h2>
                <button onClick={() => setShowNewProject(false)} className="text-gray-500 hover:text-white transition-colors">
                  ✕
                </button>
              </div>
              <form action="/api/profile" method="POST" className="space-y-4">
                <input type="hidden" name="locale" value={locale} />
                <div>
                  <label className="mb-1 block text-xs text-gray-500">{locale === "ar" ? "الاسم" : "Name"}</label>
                  <input name="full_name" type="text" defaultValue={userName || ""} className="w-full rounded-xl border border-white/10 bg-black/50 px-4 py-2.5 text-sm text-white outline-none focus:border-[#BF953F]/50 transition-colors" />
                </div>
                <div>
                  <label className="mb-1 block text-xs text-gray-500">{locale === "ar" ? "رقم الهاتف" : "Phone"}</label>
                  <input name="phone" type="tel" className="w-full rounded-xl border border-white/10 bg-black/50 px-4 py-2.5 text-sm text-white outline-none focus:border-[#BF953F]/50 transition-colors" placeholder="+20..." />
                </div>
                <button type="submit" className="w-full rounded-xl bg-gradient-to-r from-[#BF953F] to-[#B38728] px-4 py-2.5 text-sm font-semibold text-black hover:brightness-110 transition-all">
                  {locale === "ar" ? "حفظ التغييرات" : "Save Changes"}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Profile Modal */}
      <AnimatePresence>
        {showProfile && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="w-full max-w-md rounded-2xl border border-white/10 bg-[#121212] p-8 shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">{locale === "ar" ? "الملف الشخصي" : "Profile"}</h2>
                <button onClick={() => setShowProfile(false)} className="text-gray-500 hover:text-white transition-colors">✕</button>
              </div>
              <div className="flex flex-col items-center mb-6">
                <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-[#BF953F] to-[#B38728] text-2xl font-bold text-black">
                  {(userName || userEmail)[0].toUpperCase()}
                </div>
                <p className="text-lg font-semibold text-white">{userName || locale === "ar" ? "مستخدم" : "User"}</p>
                <p className="text-sm text-gray-500">{userEmail}</p>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="mb-1 block text-xs text-gray-500">{locale === "ar" ? "الاسم" : "Name"}</label>
                  <input type="text" defaultValue={userName || ""} className="w-full rounded-xl border border-white/10 bg-black/50 px-4 py-2.5 text-sm text-white outline-none focus:border-[#BF953F]/50 transition-colors" />
                </div>
                <div>
                  <label className="mb-1 block text-xs text-gray-500">{locale === "ar" ? "رقم الهاتف" : "Phone"}</label>
                  <input type="tel" className="w-full rounded-xl border border-white/10 bg-black/50 px-4 py-2.5 text-sm text-white outline-none focus:border-[#BF953F]/50 transition-colors" placeholder="+20..." />
                </div>
                <button className="w-full rounded-xl bg-gradient-to-r from-[#BF953F] to-[#B38728] px-4 py-2.5 text-sm font-semibold text-black hover:brightness-110 transition-all">
                  {locale === "ar" ? "حفظ التغييرات" : "Save Changes"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AIChat locale={locale} />
    </div>
  );
}

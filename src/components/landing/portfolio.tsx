"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useTranslations, useLocale } from "next-intl";
import { WhatsAppQuick } from "@/components/landing/whatsapp-quick";
import { DesignPreview } from "@/components/landing/design-preview";

interface Project {
  id: string;
  title_en: string;
  title_ar: string;
  category: string;
  description_en: string;
  description_ar: string;
  image_url: string;
}

const categoryTranslations: Record<string, string> = {};

export function Portfolio({ visible }: { visible: boolean }) {
  const t = useTranslations("portfolio");
  const locale = useLocale();
  const tc = useTranslations("services");
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    fetch("/api/portfolio")
      .then(r => r.json())
      .then(d => setProjects(d))
      .catch(() => {});
  }, []);

  if (!visible) return null;

  const defaultProjects = projects.length > 0 ? projects : [
    { id: "1", title_en: "Luxury Brand Identity", title_ar: "هوية علامة تجارية فاخرة", category: "Design", description_en: "", description_ar: "", image_url: "" },
    { id: "2", title_en: "E-Commerce Platform", title_ar: "منصة تجارة إلكترونية", category: "Development", description_en: "", description_ar: "", image_url: "" },
    { id: "3", title_en: "Digital Marketing Campaign", title_ar: "حملة تسويق إلكتروني", category: "Marketing", description_en: "", description_ar: "", image_url: "" },
  ];

  const getCategory = (cat: string) => {
    const key = cat.toLowerCase();
    if (key === "design") return tc("design");
    if (key === "development" || key === "coding") return tc("coding");
    if (key === "marketing") return tc("marketing");
    return cat;
  };

  const getTitle = (p: Project) => locale === "ar" ? (p.title_ar || p.title_en) : p.title_en;
  const getDesc = (p: Project) => locale === "ar" ? (p.description_ar || p.description_en) : p.description_en;

  return (
    <section id="portfolio" className="relative py-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-16 text-center"
        >
          <h2 className="text-4xl font-bold text-white">
            {t("title")}
          </h2>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-3">
          {defaultProjects.map((project, i) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group relative overflow-hidden rounded-xl border border-white/5 bg-[#121212] hover:border-[#BF953F]/30 hover:shadow-lg hover:shadow-[#BF953F]/5 transition-all duration-500"
            >
              <div className="absolute inset-0 -z-10 rounded-xl bg-gradient-to-b from-[#BF953F]/5 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              <div className="aspect-video bg-gradient-to-br from-[#BF953F]/10 to-[#B38728]/10 flex items-center justify-center relative overflow-hidden">
                {project.image_url ? (
                  <DesignPreview imageUrl={project.image_url} mockupType="phone" />
                ) : (
                  <span className="text-4xl text-[#BF953F]/30">✦</span>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                  <span className="text-sm text-[#FCF6BA]">{t("view_project")}</span>
                </div>
              </div>
                <div className="p-4">
                <span className="text-xs text-[#BF953F]">{getCategory(project.category)}</span>
                <h3 className="mt-1 text-lg font-semibold text-white group-hover:text-[#FCF6BA] transition-colors">
                  {getTitle(project)}
                </h3>
                {getDesc(project) && (
                  <p className="mt-1 text-xs text-gray-500 line-clamp-2">{getDesc(project)}</p>
                )}
                <div className="mt-3">
                  <WhatsAppQuick serviceName={getTitle(project)} category={project.category} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

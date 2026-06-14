"use client";

import { About } from "@/components/landing/about";
import { useLocale } from "next-intl";

export default function AboutPage() {
  const locale = useLocale();
  return (
    <div>
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0B0B0B] via-[#0B0B0B] to-[#121212]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-br from-[#BF953F]/10 via-transparent to-[#FCF6BA]/5 rounded-full blur-3xl" />

        <div className="container mx-auto px-4 relative z-10 text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
            <span className="bg-gradient-to-r from-[#BF953F] via-[#FCF6BA] to-[#B38728] bg-clip-text text-transparent">
              {locale === "ar" ? "قصتنا" : "Our Story"}
            </span>
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
            {locale === "ar"
              ? "من مطبعة صغيرة إلى وكالة تسويق رقمية متكاملة — رحلة مستمرة من الشغف والإبداع"
              : "From a small print shop to a full digital marketing agency — a continuous journey of passion and creativity"}
          </p>
        </div>
      </section>

      <About visible={true} />
    </div>
  );
}

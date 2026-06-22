"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations, useLocale } from "next-intl";

const WHATSAPP_MARKETING = "201123328964";

interface ServiceOption {
  id: string;
  nameEn: string;
  nameAr: string;
  price: number;
  unitEn: string;
  unitAr: string;
}

const services: ServiceOption[] = [
  { id: "social_post", nameEn: "Social Media Post Design", nameAr: "تصميم بوست سوشيال ميديا", price: 500, unitEn: "post", unitAr: "بوست" },
  { id: "logo", nameEn: "Logo Design", nameAr: "تصميم شعار", price: 3000, unitEn: "logo", unitAr: "شعار" },
  { id: "bcard", nameEn: "Business Card Design", nameAr: "تصميم كارت شخصي", price: 400, unitEn: "design", unitAr: "تصميم" },
  { id: "flyer", nameEn: "Flyer / Brochure Design", nameAr: "تصميم فلير أو بروشور", price: 800, unitEn: "design", unitAr: "تصميم" },
  { id: "rollup", nameEn: "Roll-up Banner", nameAr: "تصميم رول أب", price: 600, unitEn: "design", unitAr: "تصميم" },
  { id: "webpage", nameEn: "Single Web Page", nameAr: "صفحة ويب واحدة", price: 2500, unitEn: "page", unitAr: "صفحة" },
  { id: "website", nameEn: "Full Website (5 pages)", nameAr: "موقع كامل (5 صفحات)", price: 12000, unitEn: "site", unitAr: "موقع" },
  { id: "ecommerce", nameEn: "E-commerce Store", nameAr: "متجر إلكتروني", price: 25000, unitEn: "store", unitAr: "متجر" },
  { id: "seo", nameEn: "SEO Package (Monthly)", nameAr: "باقة SEO (شهري)", price: 3000, unitEn: "month", unitAr: "شهر" },
  { id: "ads_mgmt", nameEn: "Ads Management (Monthly)", nameAr: "إدارة إعلانات (شهري)", price: 5000, unitEn: "month", unitAr: "شهر" },
  { id: "social_mgmt", nameEn: "Social Media Management (Monthly)", nameAr: "إدارة سوشيال ميديا (شهري)", price: 7000, unitEn: "month", unitAr: "شهر" },
  { id: "printing_1000", nameEn: "Flyers Print (1000 pcs)", nameAr: "طباعة فلير (1000 نسخة)", price: 1500, unitEn: "batch", unitAr: "دفعة" },
  { id: "printing_bcard", nameEn: "Business Cards Print (500 pcs)", nameAr: "طباعة كروت شخصية (500)", price: 800, unitEn: "batch", unitAr: "دفعة" },
  { id: "campaign_full", nameEn: "Full Marketing Campaign", nameAr: "حملة تسويقية متكاملة", price: 35000, unitEn: "campaign", unitAr: "حملة" },
];

const categories = [
  { id: "design", en: "Design", ar: "تصميم" },
  { id: "digital", en: "Digital", ar: "رقمي" },
  { id: "marketing", en: "Marketing", ar: "تسويق" },
  { id: "printing", en: "Printing", ar: "طباعة" },
];

function getCategory(svc: ServiceOption): string {
  if (["social_post", "logo", "bcard", "flyer", "rollup"].includes(svc.id)) return "design";
  if (["webpage", "website", "ecommerce"].includes(svc.id)) return "digital";
  if (["seo", "ads_mgmt", "social_mgmt", "campaign_full"].includes(svc.id)) return "marketing";
  return "printing";
}

export default function QuotePage() {
  const locale = useLocale();
  const t = useTranslations("common");
  const [selected, setSelected] = useState<Record<string, number>>({});
  const [activeCategory, setActiveCategory] = useState("design");
  const [sent, setSent] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const toggleService = (id: string) => {
    setSelected(prev => prev[id] ? { ...prev, [id]: 0 } : { ...prev, [id]: 1 });
  };

  const updateQty = (id: string, qty: number) => {
    setSelected(prev => ({ ...prev, [id]: Math.max(1, qty) }));
  };

  const total = Object.entries(selected)
    .filter(([_, qty]) => qty > 0)
    .reduce((sum, [id, qty]) => {
      const svc = services.find(s => s.id === id);
      return sum + (svc?.price || 0) * qty;
    }, 0);

  const filtered = services.filter(s => getCategory(s) === activeCategory);
  const selectedList = Object.entries(selected).filter(([_, q]) => q > 0);

  const handleSend = () => {
    const details = selectedList.map(([id, qty]) => {
      const svc = services.find(s => s.id === id);
      const name = locale === "ar" ? svc?.nameAr : svc?.nameEn;
      const unit = locale === "ar" ? svc?.unitAr : svc?.unitEn;
      return `${name} × ${qty} ${unit}`;
    }).join("%0A");

    const msg = locale === "ar"
      ? `مرحبا وكالة جلوري! أريد عرض سعر: %0A${details}%0Aالإجمالي: ${total} ج.م%0Aالاسم: ${name}%0Aرقم الهاتف: ${phone}`
      : `Hello Glory Agency! I'd like a quote: %0A${details}%0ATotal: ${total} EGP%0AName: ${name}%0APhone: ${phone}`;

    window.open(`https://wa.me/${WHATSAPP_MARKETING}?text=${msg}`, "_blank");
    setSent(true);
  };

  const isRtl = locale === "ar";

  return (
    <div className="min-h-screen pt-24 pb-16" dir={isRtl ? "rtl" : "ltr"}>
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 text-center"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            <span className="bg-gradient-to-r from-[#BF953F] via-[#FCF6BA] to-[#B38728] bg-clip-text text-transparent">
              {locale === "ar" ? "احسب تكلفة مشروعك" : "Project Cost Calculator"}
            </span>
          </h1>
          <p className="text-gray-400 max-w-xl mx-auto">
            {locale === "ar"
              ? "اختار الخدمات اللي محتاجها وعددها، واحصل على عرض سعر فوري عبر واتساب"
              : "Select the services you need and get an instant quote via WhatsApp"}
          </p>
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="flex gap-2 mb-8 flex-wrap">
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                    activeCategory === cat.id
                      ? "bg-gradient-to-r from-[#BF953F] to-[#B38728] text-black"
                      : "bg-white/5 text-gray-400 hover:bg-white/10"
                  }`}
                >
                  {isRtl ? cat.ar : cat.en}
                </button>
              ))}
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {filtered.map(svc => {
                const qty = selected[svc.id] || 0;
                return (
                  <motion.div
                    key={svc.id}
                    layout
                    className={`rounded-xl border p-4 cursor-pointer transition-all ${
                      qty > 0
                        ? "border-[#BF953F]/50 bg-[#BF953F]/5 shadow-lg shadow-[#BF953F]/5"
                        : "border-white/5 bg-[#121212] hover:border-white/10"
                    }`}
                    onClick={() => toggleService(svc.id)}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">
                          {isRtl ? svc.nameAr : svc.nameEn}
                        </p>
                        <p className="text-xs text-[#BF953F] mt-0.5">
                          {svc.price.toLocaleString()} {locale === "ar" ? "ج.م" : "EGP"}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        {qty > 0 && (
                          <div className="flex items-center gap-1" onClick={e => e.stopPropagation()}>
                            <button
                              onClick={() => updateQty(svc.id, qty - 1)}
                              className="h-6 w-6 rounded-full bg-[#BF953F]/20 text-[#FCF6BA] text-xs flex items-center justify-center hover:bg-[#BF953F]/30"
                            >
                              -
                            </button>
                            <span className="text-sm font-medium text-white w-5 text-center">{qty}</span>
                            <button
                              onClick={() => updateQty(svc.id, qty + 1)}
                              className="h-6 w-6 rounded-full bg-[#BF953F]/20 text-[#FCF6BA] text-xs flex items-center justify-center hover:bg-[#BF953F]/30"
                            >
                              +
                            </button>
                          </div>
                        )}
                        <div className={`h-5 w-5 rounded border-2 flex items-center justify-center transition-all ${
                          qty > 0 ? "border-[#BF953F] bg-[#BF953F]" : "border-gray-600"
                        }`}>
                          {qty > 0 && <span className="text-black text-xs font-bold">✓</span>}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-24 rounded-2xl border border-white/5 bg-[#121212] p-6">
              <h3 className="text-lg font-semibold text-white mb-4">
                {locale === "ar" ? "عرض السعر" : "Quote Summary"}
              </h3>

              {selectedList.length === 0 ? (
                <p className="text-sm text-gray-500">
                  {locale === "ar" ? "اختار الخدمات اللي عاوزها" : "Select services above"}
                </p>
              ) : (
                <div className="space-y-3 mb-6">
                  <AnimatePresence>
                    {selectedList.map(([id, qty]) => {
                      const svc = services.find(s => s.id === id)!;
                      const name = isRtl ? svc.nameAr : svc.nameEn;
                      return (
                        <motion.div
                          key={id}
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="flex items-center justify-between text-sm"
                        >
                          <span className="text-gray-300 truncate mr-2">{name} × {qty}</span>
                          <span className="text-[#FCF6BA] font-medium shrink-0">
                            {(svc.price * qty).toLocaleString()} {locale === "ar" ? "ج.م" : "EGP"}
                          </span>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>

                  <div className="border-t border-white/5 pt-3 flex items-center justify-between">
                    <span className="text-white font-semibold">
                      {locale === "ar" ? "الإجمالي" : "Total"}
                    </span>
                    <span className="text-xl font-bold text-[#FCF6BA]">
                      {total.toLocaleString()} {locale === "ar" ? "ج.م" : "EGP"}
                    </span>
                  </div>
                </div>
              )}

              {selectedList.length > 0 && !sent && (
                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder={locale === "ar" ? "الاسم" : "Your Name"}
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full rounded-lg border border-white/10 bg-black/50 px-4 py-2.5 text-sm text-white placeholder-gray-500"
                  />
                  <input
                    type="tel"
                    placeholder={locale === "ar" ? "رقم الهاتف" : "Phone Number"}
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className="w-full rounded-lg border border-white/10 bg-black/50 px-4 py-2.5 text-sm text-white placeholder-gray-500"
                  />
                  <button
                    onClick={handleSend}
                    className="w-full rounded-lg bg-gradient-to-r from-[#BF953F] via-[#FCF6BA] to-[#B38728] px-5 py-3 text-sm font-semibold text-black transition-all hover:brightness-110"
                  >
                    {locale === "ar" ? "أرسل العرض عبر واتساب" : "Send Quote via WhatsApp"}
                  </button>
                </div>
              )}

              {sent && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-4"
                >
                  <div className="text-2xl mb-2">✓</div>
                  <p className="text-sm text-gray-300">
                    {locale === "ar"
                      ? "تم إرسال طلبك عبر واتساب! فريقنا هيتواصل معاك"
                      : "Request sent via WhatsApp! Our team will contact you."}
                  </p>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

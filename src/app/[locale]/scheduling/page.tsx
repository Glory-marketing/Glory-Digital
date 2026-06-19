"use client";

import { useState } from "react";
import { useLocale } from "next-intl";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

const WHATSAPP_NUMBER = "201115191604";

const TIME_SLOTS = [
  { value: "morning", en: "Morning (10 AM - 1 PM)", ar: "الفترة الصباحية (10 ص - 1 م)" },
  { value: "afternoon", en: "Afternoon (1 PM - 5 PM)", ar: "الفترة المسائية (1 م - 5 م)" },
  { value: "evening", en: "Evening (5 PM - 8 PM)", ar: "الفترة المسائية (5 م - 8 م)" },
];

const SERVICE_TYPES = [
  { value: "design", en: "Design", ar: "تصميم" },
  { value: "printing", en: "Printing", ar: "طباعة" },
  { value: "digital_marketing", en: "Digital Marketing", ar: "تسويق إلكتروني" },
  { value: "web", en: "Web", ar: "ويب" },
  { value: "other", en: "Other", ar: "أخرى" },
];

export default function SchedulingPage() {
  const locale = useLocale();
  const isRtl = locale === "ar";

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [preferredDate, setPreferredDate] = useState("");
  const [preferredTime, setPreferredTime] = useState("");
  const [serviceType, setServiceType] = useState("");
  const [notes, setNotes] = useState("");

  function label(en: string, ar: string) {
    return isRtl ? ar : en;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const timeLabel = TIME_SLOTS.find((s) => s.value === preferredTime);
    const serviceLabel = SERVICE_TYPES.find((s) => s.value === serviceType);

    const lines = [
      `*${label("New Booking - Glory Agency", "حجز جديد - وكالة جلوري")}*`,
      `*${label("Name", "الاسم")}:* ${name}`,
      `*${label("Phone", "الهاتف")}:* ${phone}`,
      `*${label("Email", "البريد الإلكتروني")}:* ${email}`,
      `*${label("Preferred Date", "التاريخ المفضل")}:* ${preferredDate}`,
      `*${label("Preferred Time", "الوقت المفضل")}:* ${timeLabel ? (isRtl ? timeLabel.ar : timeLabel.en) : preferredTime}`,
      `*${label("Service Type", "نوع الخدمة")}:* ${serviceLabel ? (isRtl ? serviceLabel.ar : serviceLabel.en) : serviceType}`,
      notes ? `*${label("Notes", "ملاحظات")}:* ${notes}` : "",
    ]
      .filter(Boolean)
      .join("%0A");

    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${lines}`, "_blank");
  }

  return (
    <div className="min-h-screen bg-[#0B0B0B] pt-24">
      <section className="relative overflow-hidden pb-20">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0B0B0B] via-[#0B0B0B] to-[#121212]" />
        <div className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-[#BF953F]/10 via-transparent to-[#FCF6BA]/5 blur-3xl" />

        <div className="container relative z-10 mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-12 text-center"
          >
            <h1 className="mb-2 text-4xl font-bold md:text-5xl">
              <span className="bg-gradient-to-r from-[#BF953F] via-[#FCF6BA] to-[#B38728] bg-clip-text text-transparent">
                {label("Book a Meeting", "احجز موعداً")}
              </span>
            </h1>
            <p className="text-gray-400">
              {label(
                "Schedule a consultation with our team",
                "احجز استشارة مع فريقنا"
              )}
            </p>
          </motion.div>

          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            onSubmit={handleSubmit}
            className="mx-auto max-w-lg space-y-5 rounded-2xl border border-white/5 bg-[#121212]/80 p-8 backdrop-blur-xl"
            dir={isRtl ? "rtl" : "ltr"}
          >
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-300" htmlFor="name">
                {label("Name", "الاسم")} *
              </label>
              <input
                id="name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-black/50 px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:border-[#BF953F] focus:outline-none focus:ring-1 focus:ring-[#BF953F]"
                placeholder={label("Your name", "اسمك")}
              />
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-300" htmlFor="phone">
                {label("Phone", "رقم الهاتف")} *
              </label>
              <input
                id="phone"
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-black/50 px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:border-[#BF953F] focus:outline-none focus:ring-1 focus:ring-[#BF953F]"
                placeholder="+20 100 000 0000"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-300" htmlFor="email">
                {label("Email", "البريد الإلكتروني")} *
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-black/50 px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:border-[#BF953F] focus:outline-none focus:ring-1 focus:ring-[#BF953F]"
                placeholder="email@example.com"
              />
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-300" htmlFor="preferredDate">
                  {label("Preferred Date", "التاريخ المفضل")} *
                </label>
                <input
                  id="preferredDate"
                  type="date"
                  required
                  value={preferredDate}
                  onChange={(e) => setPreferredDate(e.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-black/50 px-4 py-2.5 text-sm text-white focus:border-[#BF953F] focus:outline-none focus:ring-1 focus:ring-[#BF953F] [color-scheme:dark]"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-300" htmlFor="preferredTime">
                  {label("Preferred Time", "الوقت المفضل")} *
                </label>
                <select
                  id="preferredTime"
                  required
                  value={preferredTime}
                  onChange={(e) => setPreferredTime(e.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-black/50 px-4 py-2.5 text-sm text-white focus:border-[#BF953F] focus:outline-none focus:ring-1 focus:ring-[#BF953F]"
                >
                  <option value="">{label("Select time", "اختر الوقت")}</option>
                  {TIME_SLOTS.map((slot) => (
                    <option key={slot.value} value={slot.value}>
                      {isRtl ? slot.ar : slot.en}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-300" htmlFor="serviceType">
                {label("Service Type", "نوع الخدمة")} *
              </label>
              <select
                id="serviceType"
                required
                value={serviceType}
                onChange={(e) => setServiceType(e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-black/50 px-4 py-2.5 text-sm text-white focus:border-[#BF953F] focus:outline-none focus:ring-1 focus:ring-[#BF953F]"
              >
                <option value="">{label("Select service", "اختر الخدمة")}</option>
                {SERVICE_TYPES.map((svc) => (
                  <option key={svc.value} value={svc.value}>
                    {isRtl ? svc.ar : svc.en}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-300" htmlFor="notes">
                {label("Notes", "ملاحظات")}
              </label>
              <textarea
                id="notes"
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-black/50 px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:border-[#BF953F] focus:outline-none focus:ring-1 focus:ring-[#BF953F]"
                placeholder={label("Any additional details...", "أي تفاصيل إضافية...")}
              />
            </div>

            <Button type="submit" className="w-full">
              {label("Book via WhatsApp", "احجز عبر واتساب")}
            </Button>
          </motion.form>
        </div>
      </section>
    </div>
  );
}

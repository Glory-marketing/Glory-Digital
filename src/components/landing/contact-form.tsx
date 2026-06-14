"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { submitLead } from "@/server-actions/leads";
import { useToast } from "@/components/ui/toast";

const WHATSAPP_MARKETING = "20115191604";
const WHATSAPP_PRINTING = "201123328964";

const categoryKeys = ["marketing", "printing", "flyers", "digital", "full"];

const subServices: Record<string, string[]> = {
  marketing: ["marketing_social", "marketing_seo", "marketing_ads", "marketing_email", "marketing_content"],
  printing: ["print_cards", "print_flyers", "print_brochures", "print_rollups", "print_banners", "print_catalogs", "print_stickers"],
  flyers: ["flyer_flyers", "flyer_brochures", "flyer_catalogs", "flyer_leaflets", "flyer_menus"],
  digital: ["digital_web", "digital_mobile", "digital_ecommerce", "digital_uiux", "digital_branding"],
  full: ["full_complete"],
};

export function ContactForm({
  locale,
  messages,
  fullPage,
}: {
  locale: string;
  messages: Record<string, any>;
  fullPage?: boolean;
}) {
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [category, setCategory] = useState("");
  const { toast } = useToast();
  const t = messages.contact;
  const svc = t.services || {};

  function label(key: string): string {
    return svc[key] || key;
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      await submitLead(formData).catch(() => {});
    } catch {
      // silent
    }

    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string || "";
    const cat = formData.get("category") as string;
    const sub = formData.get("sub_service") as string;
    const brief = formData.get("brief") as string || "";
    const catLabel = label(cat);
    const subLabel = sub ? label(sub) : "";

    const printingCats = ["printing", "flyers"];
    const waNumber = printingCats.includes(cat) ? WHATSAPP_PRINTING : WHATSAPP_MARKETING;

    const lines = [
      `*New Lead - Glory For Marketing*`,
      `*Name:* ${name}`,
      `*Email:* ${email}`,
      `*Phone:* ${phone}`,
      `*Category:* ${catLabel}`,
      subLabel ? `*Service:* ${subLabel}` : "",
      `*Message:* ${brief}`,
    ].filter(Boolean).join("%0A");

    window.open(`https://wa.me/${waNumber}?text=${lines}`, "_blank");

    setSuccess(true);
    toast(t.success || (locale === "ar" ? "تم تحويلك للواتساب!" : "Redirecting to WhatsApp..."), "success");
    form.reset();
    setSubmitting(false);
  }

  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="mx-auto max-w-lg rounded-2xl border border-white/5 bg-[#121212] p-12 text-center"
      >
        <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-gradient-to-r from-[#BF953F]/20 to-[#FCF6BA]/20 flex items-center justify-center">
          <span className="text-3xl text-[#FCF6BA]">✦</span>
        </div>
        <h3 className="mb-2 text-xl font-semibold text-white">{t.thank_you || (locale === "ar" ? "شكراً لك!" : "Thank You!")}</h3>
        <p className="text-gray-400">{t.success}</p>
      </motion.div>
    );
  }

  const section = (content: React.ReactNode) =>
    !fullPage ? content : (
      <section id="contact" className="relative pb-24">
        <div className="container mx-auto px-4">{content}</div>
      </section>
    );

  return section(
    <>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="mb-16 text-center"
      >
        <h2 className="text-4xl font-bold text-white">{t.title}</h2>
      </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          onSubmit={handleSubmit}
          className="mx-auto max-w-lg space-y-5 rounded-2xl border border-white/5 bg-[#121212]/80 p-8 backdrop-blur-xl"
        >
          <Input id="name" name="name" label={t.name} placeholder="John Doe" required />
          <Input id="email" name="email" type="email" label={t.email} placeholder="john@example.com" required />
          <Input id="phone" name="phone" type="tel" label={t.phone || (locale === "ar" ? "رقم الهاتف" : "Phone")} placeholder="+20 100 000 0000" />

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-300" htmlFor="category">
              {t.main_category || (locale === "ar" ? "القسم الرئيسي" : "Main Category")}
            </label>
            <select
              id="category"
              name="category"
              required
              value={category}
              onChange={(e) => { setCategory(e.target.value); }}
              className="w-full rounded-lg border border-white/10 bg-black/50 px-4 py-2.5 text-sm text-white focus:border-[#BF953F] focus:outline-none focus:ring-1 focus:ring-[#BF953F]"
            >
              <option value="">{t.select_category || (locale === "ar" ? "-- اختر القسم --" : "-- Select Category --")}</option>
              {categoryKeys.map((k) => (
                <option key={k} value={k}>{svc[k] || k}</option>
              ))}
            </select>
          </div>

          {category && subServices[category] && (
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-300" htmlFor="sub_service">
                {t.required_service || (locale === "ar" ? "الخدمة المطلوبة" : "Required Service")}
              </label>
              <select
                id="sub_service"
                name="sub_service"
                required
                className="w-full rounded-lg border border-white/10 bg-black/50 px-4 py-2.5 text-sm text-white focus:border-[#BF953F] focus:outline-none focus:ring-1 focus:ring-[#BF953F]"
              >
                <option value="">{t.select_service || (locale === "ar" ? "-- اختر الخدمة --" : "-- Select Service --")}</option>
                {subServices[category].map((s) => (
                  <option key={s} value={s}>{svc[s] || s}</option>
                ))}
              </select>
            </div>
          )}

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-300" htmlFor="brief">{t.brief}</label>
            <textarea
              id="brief" name="brief" rows={4}
              className="w-full rounded-lg border border-white/10 bg-black/50 px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:border-[#BF953F] focus:outline-none focus:ring-1 focus:ring-[#BF953F]"
              placeholder="Tell us about your project..."
            />
          </div>

          <Button type="submit" className="w-full" disabled={submitting}>
            {submitting ? (t.sending || "Sending...") : t.submit}
          </Button>
        </motion.form>
      </>
    );
}

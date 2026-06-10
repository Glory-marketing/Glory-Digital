"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { submitLead } from "@/server-actions/leads";
import { useToast } from "@/components/ui/toast";

const WHATSAPP_NUMBER = "201123328964";

const serviceTree: Record<string, { labelKey: string; options: { value: string; labelKey: string }[] }> = {
  marketing: {
    labelKey: "marketing",
    options: [
      { value: "social_media", labelKey: "marketing_social" },
      { value: "seo", labelKey: "marketing_seo" },
      { value: "ads", labelKey: "marketing_ads" },
      { value: "email", labelKey: "marketing_email" },
      { value: "content", labelKey: "marketing_content" },
    ],
  },
  printing: {
    labelKey: "printing",
    options: [
      { value: "cards", labelKey: "print_cards" },
      { value: "flyers", labelKey: "print_flyers" },
      { value: "brochures", labelKey: "print_brochures" },
      { value: "rollups", labelKey: "print_rollups" },
      { value: "banners", labelKey: "print_banners" },
      { value: "catalogs", labelKey: "print_catalogs" },
      { value: "stickers", labelKey: "print_stickers" },
    ],
  },
  flyers: {
    labelKey: "flyers",
    options: [
      { value: "flyers", labelKey: "flyer_flyers" },
      { value: "brochures", labelKey: "flyer_brochures" },
      { value: "catalogs", labelKey: "flyer_catalogs" },
      { value: "leaflets", labelKey: "flyer_leaflets" },
      { value: "menus", labelKey: "flyer_menus" },
    ],
  },
  digital: {
    labelKey: "digital",
    options: [
      { value: "web", labelKey: "digital_web" },
      { value: "mobile", labelKey: "digital_mobile" },
      { value: "ecommerce", labelKey: "digital_ecommerce" },
      { value: "uiux", labelKey: "digital_uiux" },
      { value: "branding", labelKey: "digital_branding" },
    ],
  },
  full: {
    labelKey: "full",
    options: [
      { value: "complete", labelKey: "full_complete" },
    ],
  },
};

export function ContactForm({
  locale,
  messages,
}: {
  locale: string;
  messages: Record<string, any>;
}) {
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [category, setCategory] = useState("");
  const { toast } = useToast();
  const t = messages.contact;
  const isAr = locale === "ar";

  const currentTree = category ? serviceTree[category] : null;

  function getLabel(path: string) {
    const parts = path.split(".");
    let obj = messages;
    for (const p of parts) {
      if (!obj || typeof obj !== "object") return path;
      obj = obj[p];
    }
    return typeof obj === "string" ? obj : path;
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      await submitLead(formData).catch(() => {});
    } catch {}

    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string || "";
    const cat = formData.get("category") as string;
    const sub = formData.get("sub_service") as string || "";
    const brief = formData.get("brief") as string || "";

    const catLabel = cat ? getLabel(`contact.services.${cat}`) : "";
    const subLabel = sub ? getLabel(`contact.services.${cat}_${sub}`) : "";

    const whatsappText =
      `*New Lead - Glory For Marketing*%0A%0A` +
      `*Name:* ${name}%0A` +
      `*Email:* ${email}%0A` +
      `*Phone:* ${phone}%0A%0A` +
      `*Category:* ${catLabel}%0A` +
      `*Service:* ${subLabel}%0A%0A` +
      `*Message:* ${brief || "—"}`;

    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${whatsappText}`, "_blank");

    setSuccess(true);
    toast(isAr ? "تم إرسال الرسالة بنجاح!" : "Message sent successfully!", "success");
    form.reset();
    setCategory("");
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
        <h3 className="mb-2 text-xl font-semibold text-white">{isAr ? "شكراً لك!" : "Thank You!"}</h3>
        <p className="text-gray-400">{t.success}</p>
      </motion.div>
    );
  }

  return (
    <section id="contact" className="relative py-24">
      <div className="container mx-auto px-4">
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

          <Input id="phone" name="phone" type="tel" label={isAr ? "رقم الهاتف" : "Phone"} placeholder="+20 100 000 0000" />

          {/* Category dropdown */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-300">Category</label>
            <select
              name="category"
              required
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-black/50 px-4 py-2.5 text-sm text-white focus:border-[#BF953F] focus:outline-none focus:ring-1 focus:ring-[#BF953F]"
            >
              <option value="">{isAr ? "اختر التصنيف" : "Select category"}</option>
              {Object.keys(serviceTree).map((key) => (
                <option key={key} value={key}>{getLabel(`contact.services.${key}`)}</option>
              ))}
            </select>
          </div>

          {/* Sub-service dropdown */}
          {currentTree && (
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-300">{isAr ? "الخدمة" : "Service"}</label>
              <select
                name="sub_service"
                required
                className="w-full rounded-lg border border-white/10 bg-black/50 px-4 py-2.5 text-sm text-white focus:border-[#BF953F] focus:outline-none focus:ring-1 focus:ring-[#BF953F]"
              >
                <option value="">{isAr ? "اختر الخدمة" : "Select service"}</option>
                {currentTree.options.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {getLabel(`contact.services.${opt.labelKey}`)}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-300" htmlFor="brief">{t.brief}</label>
            <textarea
              id="brief"
              name="brief"
              rows={4}
              className="w-full rounded-lg border border-white/10 bg-black/50 px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:border-[#BF953F] focus:outline-none focus:ring-1 focus:ring-[#BF953F]"
              placeholder={isAr ? "حدثنا عن مشروعك..." : "Tell us about your project..."}
            />
          </div>

          <Button type="submit" className="w-full" disabled={submitting}>
            {submitting ? "Sending..." : t.submit}
          </Button>
        </motion.form>
      </div>
    </section>
  );
}

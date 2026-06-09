"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { submitLead } from "@/server-actions/leads";
import { useToast } from "@/components/ui/toast";

const WHATSAPP_NUMBER = "201115191604";

export function ContactForm({
  locale,
  messages,
}: {
  locale: string;
  messages: Record<string, any>;
}) {
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const { toast } = useToast();
  const t = messages.contact;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      await submitLead(formData);

      const params = new URLSearchParams({
        name: formData.get("name") as string,
        service: formData.get("service") as string,
        budget: formData.get("budget") as string || "Not specified",
        brief: formData.get("brief") as string || "Not provided",
      });

      const whatsappText = `New lead:%0A${params.toString().replace(/&/g, '%0A')}`;
      window.open(
        `https://wa.me/${WHATSAPP_NUMBER}?text=${whatsappText}`,
        "_blank"
      );

      setSuccess(true);
      toast("Message sent successfully!", "success");
      form.reset();
    } catch {
      toast("Failed to send message. Please try again.", "error");
    }
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
        <h3 className="mb-2 text-xl font-semibold text-white">Thank You!</h3>
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
          <h2 className="text-4xl font-bold text-white">
            Let&apos;s Create <span className="bg-gradient-to-r from-[#BF953F] via-[#FCF6BA] to-[#B38728] bg-clip-text text-transparent">Together</span>
          </h2>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          onSubmit={handleSubmit}
          className="mx-auto max-w-lg space-y-5 rounded-2xl border border-white/5 bg-[#121212]/80 p-8 backdrop-blur-xl"
        >
          <Input
            id="name"
            name="name"
            label={t.name}
            placeholder="John Doe"
            required
          />

          <Input
            id="email"
            name="email"
            type="email"
            label={t.email}
            placeholder="john@example.com"
            required
          />

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-300" htmlFor="service">
              {t.service}
            </label>
            <select
              id="service"
              name="service"
              required
              className="w-full rounded-lg border border-white/10 bg-black/50 px-4 py-2.5 text-sm text-white focus:border-[#BF953F] focus:outline-none focus:ring-1 focus:ring-[#BF953F]"
            >
              <option value="marketing">{t.services.marketing}</option>
              <option value="design">{t.services.design}</option>
              <option value="development">{t.services.development}</option>
              <option value="full">{t.services.full}</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-300" htmlFor="budget">
              {t.budget}
            </label>
            <select
              id="budget"
              name="budget"
              className="w-full rounded-lg border border-white/10 bg-black/50 px-4 py-2.5 text-sm text-white focus:border-[#BF953F] focus:outline-none focus:ring-1 focus:ring-[#BF953F]"
            >
              <option value="">Select budget</option>
              <option value="small">{t.budgets.small}</option>
              <option value="medium">{t.budgets.medium}</option>
              <option value="large">{t.budgets.large}</option>
              <option value="enterprise">{t.budgets.enterprise}</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-300" htmlFor="brief">
              {t.brief}
            </label>
            <textarea
              id="brief"
              name="brief"
              rows={4}
              className="w-full rounded-lg border border-white/10 bg-black/50 px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:border-[#BF953F] focus:outline-none focus:ring-1 focus:ring-[#BF953F]"
              placeholder="Tell us about your project..."
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

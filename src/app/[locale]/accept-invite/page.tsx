"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { acceptInvitation } from "@/server-actions/invitations";
import { useToast } from "@/components/ui/toast";
import { useTranslations, useLocale } from "next-intl";

export default function AcceptInvitePage() {
  const t = useTranslations("accept_invite");
  const locale = useLocale();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";
  const { toast } = useToast();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast(t("password_mismatch"), "error");
      return;
    }
    if (password.length < 8) {
      toast(t("password_length"), "error");
      return;
    }

    setSubmitting(true);
    try {
      await acceptInvitation(token, password);
      setSuccess(true);
      toast(t("account_created"), "success");
    } catch (err) {
      toast(
        err instanceof Error ? err.message : t("failed_invite"),
        "error"
      );
    }
    setSubmitting(false);
  };

  if (success) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0B0B0B]">
        <div className="text-center">
          <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-gradient-to-r from-[#BF953F]/20 to-[#FCF6BA]/20 flex items-center justify-center">
            <span className="text-3xl text-[#FCF6BA]">✦</span>
          </div>
          <h1 className="mb-2 text-2xl font-bold text-white">{t("success_title")}</h1>
          <p className="mb-6 text-gray-400">
            {t("success_msg")}
          </p>
          <a href={`/${locale}/glory-admin`}>
            <Button>{t("go_dashboard")}</Button>
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0B0B0B]">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-white">{t("title")}</h1>
          <p className="mt-2 text-gray-400">{t("subtitle")}</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-5 rounded-2xl border border-white/5 bg-[#121212] p-8"
        >
          <Input
            label={t("password")}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={t("password_min")}
            required
          />
          <Input
            label={t("confirm_password")}
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder={t("repeat_password")}
            required
          />
          <Button type="submit" className="w-full" disabled={submitting}>
            {submitting ? t("creating") : t("accept_button")}
          </Button>
        </form>
      </div>
    </div>
  );
}

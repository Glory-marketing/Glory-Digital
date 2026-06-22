"use server";

import { sendInfoEmail, sendAuthEmail } from "@/lib/email";
import { welcomeClientHtml } from "@/emails/welcome-client";

export async function sendWelcomeEmail({
  name,
  email,
  locale,
}: {
  name: string | null;
  email: string;
  locale: "ar" | "en";
}) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://glory.dpdns.org";
  const portalLink = `${appUrl}/${locale}/client-portal`;

  const { error } = await sendInfoEmail(email, 
    locale === "ar" ? "مرحباً بك في Glory Agency 🎉" : "Welcome to Glory Agency 🎉",
    welcomeClientHtml({ name, portalLink, locale })
  );

  if (error) return { success: false, error };
  return { success: true };
}

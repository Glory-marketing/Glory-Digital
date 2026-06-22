import { emailLayout, goldButton } from "./layout";

export function invitationEmailHtml({
  inviteLink,
  role,
  invitedByEmail,
  locale,
}: {
  inviteLink: string;
  role: string;
  invitedByEmail: string;
  locale: "ar" | "en";
}): string {
  const roleLabels: Record<string, string> = {
    Super_Admin: locale === "ar" ? "مشرف عام" : "Super Admin",
    Admin: locale === "ar" ? "مدير" : "Admin",
    Editor: locale === "ar" ? "محرر" : "Editor",
    Client: locale === "ar" ? "عميل" : "Client",
  };

  const content = locale === "ar" ? `
    <div style="text-align:right">
      <p style="font-size:32px;margin:0 0 8px">📩</p>
      <h1 style="color:#FCF6BA;font-size:22px;margin:0 0 8px">دعوة للانضمام إلى Glory Agency</h1>
      <p style="color:#999;font-size:14px;margin:0 0 4px">تمت دعوتك من قبل <strong style="color:#fff">${invitedByEmail}</strong></p>
      <p style="color:#999;font-size:14px;margin:0 0 20px">الدور: <strong style="color:#BF953F">${roleLabels[role] || role}</strong></p>
      <p style="color:#ccc;font-size:14px;line-height:1.8;margin:0 0 8px">مرحباً بك في فريق Glory! نتمنى لك تجربة مميزة.</p>
      <p style="color:#ccc;font-size:14px;line-height:1.8;margin:0 0 24px">اضغط على الزر أدناه لإنشاء حسابك والبدء:</p>
      ${goldButton(inviteLink, "قبول الدعوة ←")}
      <p style="color:#666;font-size:12px;margin:24px 0 0">هذا الرابط صالح لمدة 24 ساعة.</p>
    </div>
  ` : `
    <div>
      <p style="font-size:32px;margin:0 0 8px">📩</p>
      <h1 style="color:#FCF6BA;font-size:22px;margin:0 0 8px">Invitation to Join Glory Agency</h1>
      <p style="color:#999;font-size:14px;margin:0 0 4px">You've been invited by <strong style="color:#fff">${invitedByEmail}</strong></p>
      <p style="color:#999;font-size:14px;margin:0 0 20px">Role: <strong style="color:#BF953F">${roleLabels[role] || role}</strong></p>
      <p style="color:#ccc;font-size:14px;line-height:1.8;margin:0 0 8px">Welcome to the Glory team! We're excited to have you.</p>
      <p style="color:#ccc;font-size:14px;line-height:1.8;margin:0 0 24px">Click the button below to create your account and get started:</p>
      ${goldButton(inviteLink, "Accept Invitation →")}
      <p style="color:#666;font-size:12px;margin:24px 0 0">This link expires in 24 hours.</p>
    </div>
  `;

  return emailLayout(content, locale);
}

import { emailLayout } from "./layout";

export function welcomeClientHtml({
  name,
  portalLink,
  locale,
}: {
  name: string | null;
  portalLink: string;
  locale: "ar" | "en";
}): string {
  const displayName = name || (locale === "ar" ? "عميلنا العزيز" : "Dear Client");

  const content = locale === "ar" ? `
    <div style="text-align:right">
      <p style="font-size:32px;margin:0 0 8px">👋</p>
      <h1 style="color:#FCF6BA;font-size:22px;margin:0 0 8px">مرحباً بك في Glory Agency</h1>
      <p style="color:#ccc;font-size:14px;line-height:1.8;margin:0 0 4px">عزيزي ${displayName}،</p>
      <p style="color:#ccc;font-size:14px;line-height:1.8;margin:0 0 20px">نحن سعداء بانضمامك إلينا! يمكنك متابعة مشاريعك والتواصل معنا من خلال بوابة العميل.</p>
      <p style="color:#ccc;font-size:14px;line-height:1.8;margin:0 0 24px">اضغط على الزر أدناه للدخول إلى بوابتك الخاصة:</p>
      ${goldButton(portalLink, "دخول بوابة العميل ←")}
    </div>
  ` : `
    <div>
      <p style="font-size:32px;margin:0 0 8px">👋</p>
      <h1 style="color:#FCF6BA;font-size:22px;margin:0 0 8px">Welcome to Glory Agency</h1>
      <p style="color:#ccc;font-size:14px;line-height:1.8;margin:0 0 4px">Dear ${displayName},</p>
      <p style="color:#ccc;font-size:14px;line-height:1.8;margin:0 0 20px">We're excited to have you onboard! You can track your projects and communicate with us through your client portal.</p>
      <p style="color:#ccc;font-size:14px;line-height:1.8;margin:0 0 24px">Click the button below to access your portal:</p>
      ${goldButton(portalLink, "Enter Client Portal →")}
    </div>
  `;

  return emailLayout(content, locale);
}

function goldButton(link: string, text: string): string {
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:24px 0">
<tr><td style="background:linear-gradient(135deg,#BF953F,#FCF6BA,#B38728);border-radius:12px;padding:12px 32px;text-align:center">
<a href="${link}" style="color:#0B0B0B;text-decoration:none;font-size:14px;font-weight:600;display:inline-block">${text}</a>
</td></tr>
</table>`;
}

import { emailLayout } from "./layout";

export function leadNotificationHtml({
  name,
  email,
  phone,
  service,
  budget,
  brief,
  locale,
}: {
  name: string;
  email: string;
  phone: string | null;
  service: string;
  budget: string | null;
  brief: string | null;
  locale: "ar" | "en";
}): string {
  const content = locale === "ar" ? `
    <div style="text-align:right">
      <p style="font-size:32px;margin:0 0 8px">🆕</p>
      <h1 style="color:#FCF6BA;font-size:22px;margin:0 0 16px">طلب جديد من موقع Glory</h1>
      <table style="width:100%;color:#ccc;font-size:14px;line-height:2">
        <tr><td style="color:#666;width:100px">الاسم</td><td style="color:#fff">${name}</td></tr>
        <tr><td style="color:#666">البريد</td><td style="color:#fff"><a href="mailto:${email}" style="color:#BF953F">${email}</a></td></tr>
        ${phone ? `<tr><td style="color:#666">الهاتف</td><td style="color:#fff">${phone}</td></tr>` : ""}
        <tr><td style="color:#666">الخدمة</td><td style="color:#fff">${service}</td></tr>
        ${budget ? `<tr><td style="color:#666">الميزانية</td><td style="color:#fff">${budget}</td></tr>` : ""}
        ${brief ? `<tr><td style="color:#666">الملخص</td><td style="color:#fff">${brief}</td></tr>` : ""}
      </table>
    </div>
  ` : `
    <div>
      <p style="font-size:32px;margin:0 0 8px">🆕</p>
      <h1 style="color:#FCF6BA;font-size:22px;margin:0 0 16px">New Lead from Glory Website</h1>
      <table style="width:100%;color:#ccc;font-size:14px;line-height:2">
        <tr><td style="color:#666;width:100px">Name</td><td style="color:#fff">${name}</td></tr>
        <tr><td style="color:#666">Email</td><td style="color:#fff"><a href="mailto:${email}" style="color:#BF953F">${email}</a></td></tr>
        ${phone ? `<tr><td style="color:#666">Phone</td><td style="color:#fff">${phone}</td></tr>` : ""}
        <tr><td style="color:#666">Service</td><td style="color:#fff">${service}</td></tr>
        ${budget ? `<tr><td style="color:#666">Budget</td><td style="color:#fff">${budget}</td></tr>` : ""}
        ${brief ? `<tr><td style="color:#666">Brief</td><td style="color:#fff">${brief}</td></tr>` : ""}
      </table>
    </div>
  `;

  return emailLayout(content, locale);
}

export function emailLayout(content: string, locale: "ar" | "en" = "en"): string {
  const isRtl = locale === "ar";
  const direction = isRtl ? "rtl" : "ltr";
  const align = isRtl ? "right" : "left";

  return `<!DOCTYPE html>
<html dir="${direction}">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background-color:#0B0B0B;font-family:'Segoe UI',Tahoma,sans-serif;direction:${direction}">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#0B0B0B;padding:40px 20px">
<tr><td align="center">
<table role="presentation" width="560" cellpadding="0" cellspacing="0" style="background-color:#121212;border:1px solid rgba(255,255,255,0.05);border-radius:16px;overflow:hidden">
<tr><td style="padding:40px 32px;text-align:${align}">
${content}
</td></tr>
<tr><td style="padding:24px 32px;text-align:center;border-top:1px solid rgba(255,255,255,0.05)">
<p style="margin:0;font-size:12px;color:#666;direction:${direction}">
${isRtl ? "© 2026 Glory Agency. جميع الحقوق محفوظة." : "© 2026 Glory Agency. All rights reserved."}
</p>
<p style="margin:4px 0 0;font-size:12px;color:#555;direction:${direction}">
${isRtl ? "هذا البريد تم إرساله تلقائياً، يرجى عدم الرد عليه." : "This is an automated email, please do not reply."}
</p>
</td></tr>
</table>
</td></tr>
</table>
</body>
</html>`;
}

export function goldButton(link: string, text: string): string {
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:24px 0">
<tr><td style="background:linear-gradient(135deg,#BF953F,#FCF6BA,#B38728);border-radius:12px;padding:12px 32px;text-align:center">
<a href="${link}" style="color:#0B0B0B;text-decoration:none;font-size:14px;font-weight:600;display:inline-block">${text}</a>
</td></tr>
</table>`;
}

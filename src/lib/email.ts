import { Resend } from "resend";

const RESEND_API_KEY = process.env.RESEND_API_KEY || "";
const resend = RESEND_API_KEY ? new Resend(RESEND_API_KEY) : null;

const FROM_NOREPLY = "Glory Agency <no-reply@glory.dpdns.org>";
const FROM_INFO = "Glory Agency <info@glory.dpdns.org>";
const ADMIN_EMAIL = process.env.OWNER_EMAIL || "info@glory.dpdns.org";

interface SendEmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  from?: string;
  replyTo?: string;
}

export async function sendEmail(opts: SendEmailOptions) {
  if (!resend) {
    console.warn("Resend not configured — email not sent", opts.to, opts.subject);
    return { success: false, error: "RESEND_API_KEY not configured" };
  }

  try {
    const { data, error } = await resend.emails.send({
      from: opts.from || FROM_NOREPLY,
      to: Array.isArray(opts.to) ? opts.to : [opts.to],
      subject: opts.subject,
      html: opts.html,
      replyTo: opts.replyTo,
    });

    if (error) {
      console.error("Resend error:", error);
      return { success: false, error: error.message };
    }

    return { success: true, id: data?.id };
  } catch (err) {
    console.error("Email send failed:", err);
    return { success: false, error: err instanceof Error ? err.message : "Unknown error" };
  }
}

export async function sendAuthEmail(to: string, subject: string, html: string) {
  return sendEmail({ to, subject, html, from: FROM_NOREPLY });
}

export async function sendInfoEmail(to: string | string[], subject: string, html: string) {
  return sendEmail({ to, subject, html, from: FROM_INFO, replyTo: FROM_INFO });
}

export async function notifyAdmin(subject: string, html: string) {
  return sendInfoEmail(ADMIN_EMAIL, subject, html);
}

export { FROM_NOREPLY, FROM_INFO, ADMIN_EMAIL };

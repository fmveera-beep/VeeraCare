import { sendGraphMail, isGraphConfigured } from "@/lib/email/graph";
import {
  createSmtpTransporter,
  getSmtpFrom,
  isSmtpConfigured,
} from "@/lib/email/smtp";

export type SendEmailInput = {
  to: string | string[];
  subject: string;
  text: string;
  html: string;
  replyTo?: string;
};

export function isEmailDeliveryConfigured(): boolean {
  return isGraphConfigured() || isSmtpConfigured();
}

export async function sendEmail(input: SendEmailInput): Promise<void> {
  if (isGraphConfigured()) {
    await sendGraphMail(input);
    return;
  }

  if (!isSmtpConfigured()) {
    throw new Error("Email is not configured (Graph or SMTP)");
  }

  const transporter = createSmtpTransporter();
  await transporter.sendMail({
    from: getSmtpFrom(),
    to: input.to,
    subject: input.subject,
    text: input.text,
    html: input.html,
    replyTo: input.replyTo,
  });
}

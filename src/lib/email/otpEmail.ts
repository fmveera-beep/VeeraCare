import { escapeHtml } from "@/lib/email/escapeHtml";
import { getGraphSenderName } from "@/lib/email/graph";

export function buildOtpEmail({
  otpCode,
  appName,
  recipientEmail,
}: {
  otpCode: string;
  appName: string;
  recipientEmail: string;
}) {
  const brand = escapeHtml(appName || getGraphSenderName());
  const code = escapeHtml(otpCode);
  const email = escapeHtml(recipientEmail);

  const subject = `${appName || "VeeraFM"} — your sign-in code`;

  const text = [
    `Your ${appName || "VeeraFM"} sign-in code is: ${otpCode}`,
    "",
    "This code expires in 10 minutes.",
    "If you did not request this, you can ignore this email.",
  ].join("\n");

  const html = `
    <div style="font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial; line-height:1.5; color:#111827">
      <h2 style="margin:0 0 12px">${brand} admin sign-in</h2>
      <p style="margin:0 0 16px">Use this verification code for <strong>${email}</strong>:</p>
      <p style="margin:0 0 20px; font-size:28px; font-weight:700; letter-spacing:4px">${code}</p>
      <p style="margin:0; color:#6b7280; font-size:14px">This code expires in 10 minutes. If you did not request it, ignore this email.</p>
    </div>
  `;

  return { subject, text, html };
}

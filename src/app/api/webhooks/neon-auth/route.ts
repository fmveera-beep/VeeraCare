import { NextRequest, NextResponse } from "next/server";
import { escapeHtml } from "@/lib/email/escapeHtml";
import { buildOtpEmail } from "@/lib/email/otpEmail";
import { sendEmail } from "@/lib/email/send";
import { verifyNeonAuthWebhook } from "@/lib/neon-auth/verifyWebhook";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const rawBody = await request.text();

  try {
    const payload = await verifyNeonAuthWebhook(rawBody, request.headers);
    const { event_type, event_data, user, context } = payload;

    if (event_type === "send.otp") {
      const otpCode = String(event_data?.otp_code ?? "");
      const recipientEmail = user?.email?.trim();

      if (!otpCode || !recipientEmail) {
        return NextResponse.json(
          { error: "Missing OTP code or recipient email" },
          { status: 400 }
        );
      }

      const appName = context?.project_name || "VeeraFM";
      const { subject, text, html } = buildOtpEmail({
        otpCode,
        appName,
        recipientEmail,
      });

      await sendEmail({
        to: recipientEmail,
        subject,
        text,
        html,
      });
    }

    if (event_type === "send.magic_link") {
      const recipientEmail = user?.email?.trim();
      const linkUrl = String(event_data?.link_url ?? "");

      if (!recipientEmail || !linkUrl) {
        return NextResponse.json(
          { error: "Missing magic link or recipient email" },
          { status: 400 }
        );
      }

      const appName = context?.project_name || "VeeraFM";
      const safeAppName = escapeHtml(appName);
      const safeLink = escapeHtml(linkUrl);
      await sendEmail({
        to: recipientEmail,
        subject: `${appName} — sign-in link`,
        text: `Sign in to ${appName}:\n\n${linkUrl}\n\nIf you did not request this, ignore this email.`,
        html: `<p>Sign in to <strong>${safeAppName}</strong>:</p><p><a href="${safeLink}">Continue to sign in</a></p>`,
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[neon-auth webhook]", error);
    const message = error instanceof Error ? error.message : "Webhook handler failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

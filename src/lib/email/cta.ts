import nodemailer from "nodemailer";
import type { CTARequestInput } from "@/lib/validations/cta";

function env(name: string) {
  return process.env[name]?.trim();
}

/** Company owner / ops inbox: all CTA leads (hiring + worker) go here. */
function getOwnerInbox() {
  return (
    env("OWNER_NOTIFY_EMAIL") ||
    env("CTA_NOTIFY_TO") ||
    env("NEXT_PUBLIC_CAREERS_EMAIL")
  );
}

function isSmtpConfigured() {
  return Boolean(
    env("SMTP_HOST") &&
      env("SMTP_PORT") &&
      env("SMTP_USER") &&
      env("SMTP_PASS") &&
      env("SMTP_FROM")
  );
}

function isEmailConfigured() {
  return Boolean(isSmtpConfigured() && getOwnerInbox());
}

export type SendCtaEmailResult =
  | { status: "sent" }
  | { status: "skipped"; reason: "not_configured" }
  | { status: "failed"; error: string };

export async function sendCtaRequestEmail({
  request,
  requestId,
  sourcePath,
}: {
  request: CTARequestInput;
  requestId: string;
  sourcePath?: string | null;
}): Promise<SendCtaEmailResult> {
  if (!isEmailConfigured()) {
    return { status: "skipped", reason: "not_configured" };
  }

  const host = env("SMTP_HOST")!;
  const port = Number(env("SMTP_PORT")!);
  const user = env("SMTP_USER")!;
  const pass = env("SMTP_PASS")!;
  const from = env("SMTP_FROM")!;
  const to = getOwnerInbox()!;

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });

  const isWorker = request.inquiryType === "WORKER";
  const inquiryLabel = isWorker ? "Worker — available for work" : "Employer — needs staff";

  const subject = isWorker
    ? `VeeraCare worker inquiry: ${request.serviceNeeded} — ${request.name}`
    : `VeeraCare staffing request: ${request.serviceNeeded} — ${request.name}`;

  const lines = [
    `Request ID: ${requestId}`,
    sourcePath ? `Source: ${sourcePath}` : null,
    "",
    `Inquiry type: ${inquiryLabel}`,
    `Name: ${request.name}`,
    `Phone: ${request.phone}`,
    `Email: ${request.email}`,
    isWorker ? `Role interest: ${request.serviceNeeded}` : `Service needed: ${request.serviceNeeded}`,
    isWorker && request.availability?.trim()
      ? `Availability: ${request.availability.trim()}`
      : null,
    "",
    "Message:",
    request.message,
  ].filter(Boolean) as string[];

  const text = lines.join("\n");

  const html = `
    <div style="font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial; line-height:1.5">
      <h2 style="margin:0 0 12px">${escapeHtml(
        isWorker ? "New worker availability inquiry" : "New employer staffing inquiry"
      )}</h2>
      <p style="margin:0 0 12px"><strong>Request ID:</strong> ${escapeHtml(requestId)}${
        sourcePath
          ? `<br/><strong>Source:</strong> ${escapeHtml(sourcePath)}`
          : ""
      }</p>
      <table cellpadding="6" cellspacing="0" style="border-collapse:collapse; width:100%; max-width:680px">
        <tr><td style="border:1px solid #e5e7eb"><strong>Inquiry</strong></td><td style="border:1px solid #e5e7eb">${escapeHtml(
          inquiryLabel
        )}</td></tr>
        <tr><td style="border:1px solid #e5e7eb"><strong>Name</strong></td><td style="border:1px solid #e5e7eb">${escapeHtml(
          request.name
        )}</td></tr>
        <tr><td style="border:1px solid #e5e7eb"><strong>Phone</strong></td><td style="border:1px solid #e5e7eb">${escapeHtml(
          request.phone
        )}</td></tr>
        <tr><td style="border:1px solid #e5e7eb"><strong>Email</strong></td><td style="border:1px solid #e5e7eb">${escapeHtml(
          request.email
        )}</td></tr>
        <tr><td style="border:1px solid #e5e7eb"><strong>${escapeHtml(
          isWorker ? "Role interest" : "Service needed"
        )}</strong></td><td style="border:1px solid #e5e7eb">${escapeHtml(
          request.serviceNeeded
        )}</td></tr>
        ${
          isWorker && request.availability?.trim()
            ? `<tr><td style="border:1px solid #e5e7eb"><strong>Availability</strong></td><td style="border:1px solid #e5e7eb">${escapeHtml(
                request.availability.trim()
              )}</td></tr>`
            : ""
        }
      </table>
      <p style="margin:14px 0 6px"><strong>Message</strong></p>
      <div style="white-space:pre-wrap; border:1px solid #e5e7eb; padding:10px; border-radius:8px">${escapeHtml(
        request.message
      )}</div>
    </div>
  `;

  try {
    await transporter.sendMail({
      from,
      to,
      subject,
      text,
      html,
      replyTo: request.email,
    });
    return { status: "sent" };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "SMTP send failed";
    console.error("[sendCtaRequestEmail]", e);
    return { status: "failed", error: msg };
  }
}

function escapeHtml(input: string) {
  return input
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

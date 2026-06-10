import type { CTARequestInput } from "@/lib/validations/cta";
import { escapeHtml } from "@/lib/email/escapeHtml";
import { envTrim } from "@/lib/email/smtp";
import { isEmailDeliveryConfigured, sendEmail } from "@/lib/email/send";

/** Company owner / ops inbox: all CTA leads (hiring + worker) go here. */
function getOwnerInbox() {
  return (
    envTrim("OWNER_NOTIFY_EMAIL") ||
    envTrim("CTA_NOTIFY_TO") ||
    envTrim("NEXT_PUBLIC_CAREERS_EMAIL")
  );
}

function isEmailConfigured() {
  return Boolean(isEmailDeliveryConfigured() && getOwnerInbox());
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

  const to = getOwnerInbox()!;

  const isWorker = request.inquiryType === "WORKER";
  const inquiryLabel = isWorker ? "Worker — available for work" : "Employer — needs staff";

  const subject = isWorker
    ? `VeeraFM worker inquiry: ${request.serviceNeeded} — ${request.name}`
    : `VeeraFM staffing request: ${request.serviceNeeded} — ${request.name}`;

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
    await sendEmail({
      to,
      subject,
      text,
      html,
      replyTo: request.email,
    });
    return { status: "sent" };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Email send failed";
    console.error("[sendCtaRequestEmail]", e);
    return { status: "failed", error: msg };
  }
}

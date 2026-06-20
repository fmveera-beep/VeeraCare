import type { CTARequestInput } from "@/lib/validations/cta";
import { contactPhoneDisplay, careersEmail } from "@/config/site";
import { escapeHtml } from "@/lib/email/escapeHtml";
import { getGraphSenderEmail } from "@/lib/email/graph";
import { envTrim } from "@/lib/email/smtp";
import { isEmailDeliveryConfigured, sendEmail } from "@/lib/email/send";

/** Company owner / ops inbox: all CTA leads (hiring + worker) go here. */
function getOwnerInbox() {
  return (
    envTrim("OWNER_NOTIFY_EMAIL") ||
    envTrim("CTA_NOTIFY_TO") ||
    envTrim("NEXT_PUBLIC_CAREERS_EMAIL") ||
    careersEmail
  );
}

function isEmailConfigured() {
  return Boolean(isEmailDeliveryConfigured() && getOwnerInbox());
}

export type SendCtaEmailsResult =
  | { status: "sent"; confirmationSent: boolean; confirmationError?: string }
  | { status: "skipped"; reason: "not_configured" }
  | { status: "failed"; error: string };

function buildAdminNotification({
  request,
  requestId,
  sourcePath,
}: {
  request: CTARequestInput;
  requestId: string;
  sourcePath?: string | null;
}) {
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

  return { subject, text, html };
}

function buildInquirerConfirmation({
  request,
  requestId,
}: {
  request: CTARequestInput;
  requestId: string;
}) {
  const isWorker = request.inquiryType === "WORKER";
  const adminEmail = getOwnerInbox()!;
  const firstName = request.name.trim().split(/\s+/)[0] || request.name;

  const subject = isWorker
    ? "Thank you — we received your availability inquiry | VeeraFM"
    : "Thank you — we received your staffing request | VeeraFM";

  const intro = isWorker
    ? `Thank you for reaching out to VeeraFM. We have received your availability inquiry and our team will review your profile for suitable opportunities.`
    : `Thank you for contacting VeeraFM. We have received your staffing request and a member of our team will be in touch shortly to discuss your requirements.`;

  const detailLine = isWorker
    ? `Role interest: ${request.serviceNeeded}${
        request.availability?.trim() ? `\nAvailability: ${request.availability.trim()}` : ""
      }`
    : `Service needed: ${request.serviceNeeded}`;

  const text = [
    `Dear ${request.name},`,
    "",
    intro,
    "",
    "Summary of your inquiry:",
    `- Reference: ${requestId}`,
    `- ${detailLine.replace("\n", "\n- ")}`,
    "",
    "What happens next?",
    isWorker
      ? "- We will match your profile with relevant job openings."
      : "- We will review your requirements and contact you to confirm scope, timing, and next steps.",
    "- Typical response time: 1–2 business days.",
    "",
    "If you need to add anything urgently, reply to this email or contact us:",
    `- Email: ${adminEmail}`,
    `- Phone: ${contactPhoneDisplay}`,
    "",
    "Best regards,",
    "VeeraFM Team",
    "Facilities management & staffing",
    "https://www.veerafm.com",
  ].join("\n");

  const html = `
    <div style="font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial; line-height:1.6; color:#111827; max-width:640px">
      <p style="margin:0 0 16px">Dear ${escapeHtml(firstName)},</p>
      <p style="margin:0 0 16px">${escapeHtml(intro)}</p>
      <p style="margin:0 0 8px"><strong>Summary of your inquiry</strong></p>
      <ul style="margin:0 0 16px; padding-left:20px">
        <li><strong>Reference:</strong> ${escapeHtml(requestId)}</li>
        <li><strong>${escapeHtml(isWorker ? "Role interest" : "Service needed")}:</strong> ${escapeHtml(request.serviceNeeded)}</li>
        ${
          isWorker && request.availability?.trim()
            ? `<li><strong>Availability:</strong> ${escapeHtml(request.availability.trim())}</li>`
            : ""
        }
      </ul>
      <p style="margin:0 0 8px"><strong>What happens next?</strong></p>
      <ul style="margin:0 0 16px; padding-left:20px">
        <li>${
          isWorker
            ? "We will match your profile with relevant job openings."
            : "We will review your requirements and contact you to confirm scope, timing, and next steps."
        }</li>
        <li>Typical response time: <strong>1–2 business days</strong>.</li>
      </ul>
      <p style="margin:0 0 16px">If you need to add anything urgently, reply to this email or contact us at
        <a href="mailto:${escapeHtml(adminEmail)}">${escapeHtml(adminEmail)}</a>
        or ${escapeHtml(contactPhoneDisplay)}.</p>
      <p style="margin:0 0 4px">Best regards,</p>
      <p style="margin:0"><strong>VeeraFM Team</strong><br/>Facilities management &amp; staffing<br/>
        <a href="https://www.veerafm.com">www.veerafm.com</a></p>
    </div>
  `;

  return { subject, text, html };
}

/** Sends admin notification + thank-you confirmation to the inquirer. */
export async function sendCtaRequestEmail({
  request,
  requestId,
  sourcePath,
}: {
  request: CTARequestInput;
  requestId: string;
  sourcePath?: string | null;
}): Promise<SendCtaEmailsResult> {
  if (!isEmailConfigured()) {
    return { status: "skipped", reason: "not_configured" };
  }

  const adminInbox = getOwnerInbox()!;
  const adminMail = buildAdminNotification({ request, requestId, sourcePath });

  try {
    await sendEmail({
      to: adminInbox,
      subject: adminMail.subject,
      text: adminMail.text,
      html: adminMail.html,
      replyTo: request.email,
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Admin notification failed";
    console.error("[sendCtaRequestEmail] admin", e);
    return { status: "failed", error: msg };
  }

  const confirmation = buildInquirerConfirmation({ request, requestId });

  try {
    await sendEmail({
      to: request.email,
      subject: confirmation.subject,
      text: confirmation.text,
      html: confirmation.html,
      replyTo: adminInbox || getGraphSenderEmail(),
    });
    return { status: "sent", confirmationSent: true };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Confirmation email failed";
    console.error("[sendCtaRequestEmail] confirmation", e);
    return { status: "sent", confirmationSent: false, confirmationError: msg };
  }
}

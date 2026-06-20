import { contactPhoneDisplay, careersEmail } from "@/config/site";
import { escapeHtml } from "@/lib/email/escapeHtml";
import { getGraphSenderEmail } from "@/lib/email/graph";
import { envTrim } from "@/lib/email/smtp";
import { isEmailDeliveryConfigured, sendEmail } from "@/lib/email/send";

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

export type SendJobApplicationEmailResult =
  | { status: "sent"; confirmationSent: boolean; confirmationError?: string }
  | { status: "skipped"; reason: "not_configured" }
  | { status: "failed"; error: string };

function buildAdminNotification({
  applicationId,
  jobTitle,
  jobSlug,
  name,
  email,
  phone,
  message,
  cvUrl,
  cvFileName,
  sourcePath,
}: {
  applicationId: string;
  jobTitle: string;
  jobSlug: string;
  name: string;
  email: string;
  phone: string;
  message: string | null;
  cvUrl: string | null;
  cvFileName: string | null;
  sourcePath: string | null;
}) {
  const subject = `VeeraFM job application: ${jobTitle} — ${name}`;

  const lines = [
    `Application ID: ${applicationId}`,
    sourcePath ? `Source: ${sourcePath}` : null,
    "",
    `Job: ${jobTitle}`,
    `Job slug: ${jobSlug}`,
    "",
    `Name: ${name}`,
    `Phone: ${phone}`,
    `Email: ${email}`,
    cvUrl ? `CV: ${cvFileName ?? "Download"} — ${cvUrl}` : "CV: Not attached",
    "",
    message ? "Message:" : null,
    message ?? null,
  ].filter((line) => line !== null) as string[];

  const text = lines.join("\n");

  const html = `
    <div style="font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial; line-height:1.5">
      <h2 style="margin:0 0 12px">New job application</h2>
      <p style="margin:0 0 12px"><strong>Application ID:</strong> ${escapeHtml(applicationId)}${
        sourcePath
          ? `<br/><strong>Source:</strong> ${escapeHtml(sourcePath)}`
          : ""
      }</p>
      <table cellpadding="6" cellspacing="0" style="border-collapse:collapse; width:100%; max-width:680px">
        <tr><td style="border:1px solid #e5e7eb"><strong>Job</strong></td><td style="border:1px solid #e5e7eb">${escapeHtml(
          jobTitle
        )}</td></tr>
        <tr><td style="border:1px solid #e5e7eb"><strong>Name</strong></td><td style="border:1px solid #e5e7eb">${escapeHtml(
          name
        )}</td></tr>
        <tr><td style="border:1px solid #e5e7eb"><strong>Phone</strong></td><td style="border:1px solid #e5e7eb">${escapeHtml(
          phone
        )}</td></tr>
        <tr><td style="border:1px solid #e5e7eb"><strong>Email</strong></td><td style="border:1px solid #e5e7eb">${escapeHtml(
          email
        )}</td></tr>
        <tr><td style="border:1px solid #e5e7eb"><strong>CV</strong></td><td style="border:1px solid #e5e7eb">${
          cvUrl
            ? `<a href="${escapeHtml(cvUrl)}">${escapeHtml(cvFileName ?? "Download CV")}</a>`
            : "Not attached"
        }</td></tr>
      </table>
      ${
        message
          ? `<p style="margin:14px 0 6px"><strong>Message</strong></p>
      <div style="white-space:pre-wrap; border:1px solid #e5e7eb; padding:10px; border-radius:8px">${escapeHtml(
        message
      )}</div>`
          : ""
      }
    </div>
  `;

  return { subject, text, html };
}

function buildApplicantConfirmation({
  applicationId,
  jobTitle,
  name,
  cvFileName,
}: {
  applicationId: string;
  jobTitle: string;
  name: string;
  cvFileName: string | null;
}) {
  const adminEmail = getOwnerInbox()!;
  const firstName = name.trim().split(/\s+/)[0] || name;
  const cvNote = cvFileName
    ? `We received your CV (${cvFileName}).`
    : "You did not attach a CV with this application.";

  const subject = `Thank you — we received your application for ${jobTitle} | VeeraFM`;

  const text = [
    `Dear ${name},`,
    "",
    `Thank you for applying to VeeraFM. We have received your application for the ${jobTitle} role.`,
    "",
    "Summary:",
    `- Application reference: ${applicationId}`,
    `- Position: ${jobTitle}`,
    `- ${cvNote}`,
    "",
    "What happens next?",
    "- Our HR team will review your application.",
    "- If your profile matches the role, we will contact you for the next steps.",
    "- Typical response time: 1–2 business days.",
    "",
    "If you need to update your application or have questions, reply to this email or contact us:",
    `- Email: ${adminEmail}`,
    `- Phone: ${contactPhoneDisplay}`,
    "",
    "Best regards,",
    "VeeraFM HR Team",
    "https://www.veerafm.com/careers",
  ].join("\n");

  const html = `
    <div style="font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial; line-height:1.6; color:#111827; max-width:640px">
      <p style="margin:0 0 16px">Dear ${escapeHtml(firstName)},</p>
      <p style="margin:0 0 16px">Thank you for applying to <strong>VeeraFM</strong>. We have received your application for the
        <strong>${escapeHtml(jobTitle)}</strong> role.</p>
      <p style="margin:0 0 8px"><strong>Summary</strong></p>
      <ul style="margin:0 0 16px; padding-left:20px">
        <li><strong>Application reference:</strong> ${escapeHtml(applicationId)}</li>
        <li><strong>Position:</strong> ${escapeHtml(jobTitle)}</li>
        <li>${escapeHtml(cvNote)}</li>
      </ul>
      <p style="margin:0 0 8px"><strong>What happens next?</strong></p>
      <ul style="margin:0 0 16px; padding-left:20px">
        <li>Our HR team will review your application.</li>
        <li>If your profile matches the role, we will contact you for the next steps.</li>
        <li>Typical response time: <strong>1–2 business days</strong>.</li>
      </ul>
      <p style="margin:0 0 16px">If you need to update your application or have questions, reply to this email or contact us at
        <a href="mailto:${escapeHtml(adminEmail)}">${escapeHtml(adminEmail)}</a>
        or ${escapeHtml(contactPhoneDisplay)}.</p>
      <p style="margin:0 0 4px">Best regards,</p>
      <p style="margin:0"><strong>VeeraFM HR Team</strong><br/>
        <a href="https://www.veerafm.com/careers">www.veerafm.com/careers</a></p>
    </div>
  `;

  return { subject, text, html };
}

/** Sends admin notification + thank-you confirmation to the applicant. */
export async function sendJobApplicationEmail({
  applicationId,
  jobTitle,
  jobSlug,
  name,
  email,
  phone,
  message,
  cvUrl,
  cvFileName,
  sourcePath,
}: {
  applicationId: string;
  jobTitle: string;
  jobSlug: string;
  name: string;
  email: string;
  phone: string;
  message: string | null;
  cvUrl: string | null;
  cvFileName: string | null;
  sourcePath: string | null;
}): Promise<SendJobApplicationEmailResult> {
  if (!isEmailConfigured()) {
    return { status: "skipped", reason: "not_configured" };
  }

  const adminInbox = getOwnerInbox()!;
  const adminMail = buildAdminNotification({
    applicationId,
    jobTitle,
    jobSlug,
    name,
    email,
    phone,
    message,
    cvUrl,
    cvFileName,
    sourcePath,
  });

  try {
    await sendEmail({
      to: adminInbox,
      subject: adminMail.subject,
      text: adminMail.text,
      html: adminMail.html,
      replyTo: email,
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Admin notification failed";
    console.error("[sendJobApplicationEmail] admin", e);
    return { status: "failed", error: msg };
  }

  const confirmation = buildApplicantConfirmation({
    applicationId,
    jobTitle,
    name,
    cvFileName,
  });

  try {
    await sendEmail({
      to: email,
      subject: confirmation.subject,
      text: confirmation.text,
      html: confirmation.html,
      replyTo: adminInbox || getGraphSenderEmail(),
    });
    return { status: "sent", confirmationSent: true };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Confirmation email failed";
    console.error("[sendJobApplicationEmail] confirmation", e);
    return { status: "sent", confirmationSent: false, confirmationError: msg };
  }
}

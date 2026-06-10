import { escapeHtml } from "@/lib/email/escapeHtml";
import { envTrim } from "@/lib/email/smtp";
import { isEmailDeliveryConfigured, sendEmail } from "@/lib/email/send";

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

export type SendJobApplicationEmailResult =
  | { status: "sent" }
  | { status: "skipped"; reason: "not_configured" }
  | { status: "failed"; error: string };

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

  const to = getOwnerInbox()!;

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

  try {
    await sendEmail({
      to,
      subject,
      text,
      html,
      replyTo: email,
    });
    return { status: "sent" };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Email send failed";
    console.error("[sendJobApplicationEmail]", e);
    return { status: "failed", error: msg };
  }
}

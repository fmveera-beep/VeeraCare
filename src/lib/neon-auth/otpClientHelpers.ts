/** Normalize Neon/Better Auth client responses when requesting Email OTP. */
export function describeEmailOtpSendFailure(res: {
  error?: { message?: string } | null;
  data?: unknown;
}): string | null {
  const errMsg = res.error?.message?.trim();
  if (errMsg) {
    if (/invalid origin/i.test(errMsg)) {
      return (
        "Invalid origin: add your site URL in Neon Console → Project → Branch → Auth → Domains " +
        "(e.g. https://veera-care-alpha.vercel.app — no trailing slash). " +
        "Redeploy on Vercel after saving. Localhost is separate (Allow localhost for dev)."
      );
    }
    return errMsg;
  }

  const d = res.data as { success?: boolean } | null | undefined;
  if (d && typeof d.success === "boolean" && d.success === false) {
    return (
      "Neon Auth did not send the code. In Neon Console → Branch → Auth: enable sign-in with email and Email OTP. " +
      "If mail still never arrives, add Custom SMTP (your Gmail app password works there too)—see Neon Auth production checklist."
    );
  }

  return null;
}

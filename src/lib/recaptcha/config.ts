function normalizeEnv(value: string | undefined): string {
  if (!value) return "";
  const trimmed = value.trim();
  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1).trim();
  }
  return trimmed;
}

export const recaptchaSiteKey = normalizeEnv(
  process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY
);

export const recaptchaSecretKey = normalizeEnv(
  process.env.RECAPTCHA_SECRET_KEY
);

/** True when the public site key is configured (widget shown in forms). */
export const recaptchaEnabled = recaptchaSiteKey.length > 0;

/** True when the server should verify tokens with Google. */
export const recaptchaServerEnabled = recaptchaSecretKey.length > 0;

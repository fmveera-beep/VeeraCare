export const recaptchaSiteKey =
  process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY?.trim() ?? "";

/** True when the public site key is configured (widget shown in forms). */
export const recaptchaEnabled = recaptchaSiteKey.length > 0;

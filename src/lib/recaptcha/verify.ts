import { recaptchaEnabled } from "@/lib/recaptcha/config";

type VerifyResult = { ok: true } | { ok: false; error: string };

export async function verifyRecaptchaToken(
  token: string | null | undefined
): Promise<VerifyResult> {
  if (!recaptchaEnabled) return { ok: true };

  const secret = process.env.RECAPTCHA_SECRET_KEY?.trim();
  if (!secret) {
    console.error("[recaptcha] NEXT_PUBLIC_RECAPTCHA_SITE_KEY is set but RECAPTCHA_SECRET_KEY is missing.");
    return { ok: false, error: "Captcha verification is not configured." };
  }

  if (!token?.trim()) {
    return { ok: false, error: "Please complete the captcha." };
  }

  const res = await fetch("https://www.google.com/recaptcha/api/siteverify", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ secret, response: token.trim() }),
  });

  const data = (await res.json()) as {
    success?: boolean;
    "error-codes"?: string[];
  };

  if (!data.success) {
    console.warn("[recaptcha] verification failed", data["error-codes"]);
    return { ok: false, error: "Captcha verification failed. Please try again." };
  }

  return { ok: true };
}

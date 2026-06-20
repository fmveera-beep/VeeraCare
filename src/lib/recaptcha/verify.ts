import {
  recaptchaEnabled,
  recaptchaSecretKey,
  recaptchaServerEnabled,
} from "@/lib/recaptcha/config";

type VerifyResult = { ok: true } | { ok: false; error: string };

function clientIp(req?: Request): string | undefined {
  if (!req) return undefined;
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim();
  return req.headers.get("x-real-ip")?.trim() || undefined;
}

function errorMessage(codes: string[] | undefined): string {
  const list = codes ?? [];
  if (list.includes("invalid-input-secret")) {
    return "Captcha is misconfigured on the server. Please contact support.";
  }
  if (list.includes("timeout-or-duplicate")) {
    return "Captcha expired. Please check the box again and submit.";
  }
  if (list.includes("missing-input-response") || list.includes("invalid-input-response")) {
    return "Captcha verification failed. Please check the box again and submit.";
  }
  return "Captcha verification failed. Please try again.";
}

export async function verifyRecaptchaToken(
  token: string | null | undefined,
  req?: Request
): Promise<VerifyResult> {
  if (!recaptchaServerEnabled && !recaptchaEnabled) return { ok: true };

  if (recaptchaEnabled && !recaptchaServerEnabled) {
    console.error(
      "[recaptcha] NEXT_PUBLIC_RECAPTCHA_SITE_KEY is set but RECAPTCHA_SECRET_KEY is missing."
    );
    return { ok: false, error: "Captcha verification is not configured." };
  }

  if (!token?.trim()) {
    return { ok: false, error: "Please complete the captcha." };
  }

  const params: Record<string, string> = {
    secret: recaptchaSecretKey,
    response: token.trim(),
  };
  const ip = clientIp(req);
  if (ip) params.remoteip = ip;

  const res = await fetch("https://www.google.com/recaptcha/api/siteverify", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams(params),
  });

  const data = (await res.json()) as {
    success?: boolean;
    "error-codes"?: string[];
  };

  if (!data.success) {
    console.warn("[recaptcha] verification failed", data["error-codes"]);
    return { ok: false, error: errorMessage(data["error-codes"]) };
  }

  return { ok: true };
}

import { createNeonAuth } from "@neondatabase/auth/next/server";

let authInstance: ReturnType<typeof createNeonAuth> | null = null;

export function tryGetNeonAuth() {
  const baseUrl = process.env.NEON_AUTH_BASE_URL?.trim();
  const secret = process.env.NEON_AUTH_COOKIE_SECRET?.trim();
  if (!baseUrl || !secret || secret.length < 32) return null;
  if (!authInstance) {
    authInstance = createNeonAuth({
      baseUrl,
      cookies: {
        secret,
        sameSite: "lax",
      },
    });
  }
  return authInstance;
}

export function getNeonAuthOrThrow() {
  const auth = tryGetNeonAuth();
  if (!auth) {
    throw new Error(
      "Neon Auth requires NEON_AUTH_BASE_URL and NEON_AUTH_COOKIE_SECRET (32+ characters)."
    );
  }
  return auth;
}

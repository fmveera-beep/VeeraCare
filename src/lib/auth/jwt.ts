import * as jose from "jose";

export const AUTH_COOKIE_NAME = "vc_session";

function getSecretKey(): Uint8Array {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 16) {
    throw new Error(
      "JWT_SECRET is missing or too short. Set a random string (16+ characters)."
    );
  }
  return new TextEncoder().encode(secret);
}

export async function signAuthToken(params: {
  userId: string;
  email: string;
  role: string;
}): Promise<string> {
  const key = getSecretKey();
  return new jose.SignJWT({
    email: params.email,
    role: params.role,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(params.userId)
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(key);
}

export async function verifyAuthToken(token: string): Promise<{
  sub: string;
  email?: string;
  role?: string;
}> {
  const key = getSecretKey();
  const { payload } = await jose.jwtVerify(token, key);
  const sub = typeof payload.sub === "string" ? payload.sub : "";
  const email = typeof payload.email === "string" ? payload.email : undefined;
  const role = typeof payload.role === "string" ? payload.role : undefined;
  return { sub, email, role };
}

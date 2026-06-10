import crypto from "node:crypto";
import { envTrim } from "@/lib/email/smtp";

export type NeonAuthWebhookPayload = {
  event_id: string;
  event_type: string;
  timestamp: string;
  context?: { project_name?: string };
  user?: { email?: string; name?: string | null };
  event_data?: Record<string, unknown>;
};

function getNeonAuthBaseUrl(): string {
  const base = envTrim("NEON_AUTH_BASE_URL");
  if (!base) {
    throw new Error("NEON_AUTH_BASE_URL is not configured");
  }
  return base.replace(/\/$/, "");
}

export async function verifyNeonAuthWebhook(
  rawBody: string,
  headers: Headers
): Promise<NeonAuthWebhookPayload> {
  const signature = headers.get("x-neon-signature");
  const kid = headers.get("x-neon-signature-kid");
  const timestamp = headers.get("x-neon-timestamp");

  if (!signature || !kid || !timestamp) {
    throw new Error("Missing Neon webhook signature headers");
  }

  const jwksRes = await fetch(`${getNeonAuthBaseUrl()}/.well-known/jwks.json`);
  if (!jwksRes.ok) {
    throw new Error("Failed to fetch Neon Auth JWKS");
  }

  const jwks = (await jwksRes.json()) as {
    keys: Array<{ kid: string } & crypto.JsonWebKey>;
  };
  const jwk = jwks.keys.find((k) => k.kid === kid);
  if (!jwk) {
    throw new Error(`JWKS key ${kid} not found`);
  }

  const publicKey = crypto.createPublicKey({ key: jwk, format: "jwk" });

  const [headerB64, emptyPayload, signatureB64] = signature.split(".");
  if (emptyPayload !== "") {
    throw new Error("Expected detached JWS format");
  }

  const payloadB64 = Buffer.from(rawBody, "utf8").toString("base64url");
  const signaturePayload = `${timestamp}.${payloadB64}`;
  const signaturePayloadB64 = Buffer.from(signaturePayload, "utf8").toString(
    "base64url"
  );
  const signingInput = `${headerB64}.${signaturePayloadB64}`;

  const isValid = crypto.verify(
    null,
    Buffer.from(signingInput),
    publicKey,
    Buffer.from(signatureB64, "base64url")
  );

  if (!isValid) {
    throw new Error("Invalid Neon webhook signature");
  }

  const ageMs = Date.now() - Number.parseInt(timestamp, 10);
  if (ageMs > 5 * 60 * 1000) {
    throw new Error("Neon webhook timestamp too old");
  }

  return JSON.parse(rawBody) as NeonAuthWebhookPayload;
}

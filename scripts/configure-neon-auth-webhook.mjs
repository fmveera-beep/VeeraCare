/**
 * Enable Neon Auth webhooks for Graph-based OTP delivery.
 *
 * Requires NEON_API_KEY or neonctl login.
 * Set NEON_AUTH_WEBHOOK_URL (default: NEXT_PUBLIC_SITE_URL + /api/webhooks/neon-auth)
 *
 * Usage:
 *   node scripts/configure-neon-auth-webhook.mjs
 */

import { readFileSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { homedir } from "node:os";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

const DEFAULT_PROJECT_ID = "small-mud-45428015";
const DEFAULT_BRANCH_ID = "br-dawn-forest-aqft7rdg";
const API_BASE = "https://console.neon.tech/api/v2";

function loadEnv() {
  const envPath = resolve(root, ".env");
  if (!existsSync(envPath)) return {};
  const out = {};
  for (const line of readFileSync(envPath, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let val = trimmed.slice(eq + 1).trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    out[key] = val;
  }
  return out;
}

function getApiKey(env) {
  if (env.NEON_API_KEY) return env.NEON_API_KEY;
  const credPath = resolve(homedir(), ".config", "neonctl", "credentials.json");
  if (!existsSync(credPath)) return null;
  const creds = JSON.parse(readFileSync(credPath, "utf8"));
  return creds.access_token || null;
}

async function main() {
  const env = loadEnv();
  const apiKey = getApiKey(env);
  if (!apiKey) {
    console.error("Missing NEON_API_KEY and neonctl credentials.");
    process.exit(1);
  }

  const projectId = env.NEON_PROJECT_ID || DEFAULT_PROJECT_ID;
  const branchId = env.NEON_BRANCH_ID || DEFAULT_BRANCH_ID;
  const siteUrl = (env.NEON_AUTH_WEBHOOK_URL || env.NEXT_PUBLIC_SITE_URL || "").replace(
    /\/$/,
    ""
  );

  if (!siteUrl) {
    console.error("Set NEXT_PUBLIC_SITE_URL or NEON_AUTH_WEBHOOK_URL in .env");
    process.exit(1);
  }

  const webhookUrl = siteUrl.includes("/api/webhooks/neon-auth")
    ? siteUrl
    : `${siteUrl}/api/webhooks/neon-auth`;

  const body = {
    enabled: true,
    webhook_url: webhookUrl,
    enabled_events: ["send.otp", "send.magic_link"],
    timeout_seconds: 8,
  };

  const res = await fetch(
    `${API_BASE}/projects/${projectId}/branches/${branchId}/auth/webhooks`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    }
  );

  const text = await res.text();
  let data;
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    data = { raw: text };
  }

  if (!res.ok) {
    console.error(data.message || text || res.statusText);
    process.exit(1);
  }

  console.log("Neon Auth webhook configured:", data);
  console.log("\nEnsure Azure Graph env vars are set on Vercel:");
  console.log("  AZURE_TENANT_ID, AZURE_CLIENT_ID, AZURE_CLIENT_SECRET, GRAPH_SENDER_EMAIL");
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});

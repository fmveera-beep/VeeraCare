/**
 * Configure Neon Auth custom SMTP from local .env.
 *
 * Providers: resend (default), m365, gmail
 *
 * Resend (recommended for admin@veerafm.com sender):
 *   RESEND_API_KEY=re_...
 *   NEON_AUTH_SMTP_FROM="VeeraFM <admin@veerafm.com>"
 *
 * Requires NEON_API_KEY (Neon Console) or neonctl login.
 *
 * Usage:
 *   node scripts/configure-neon-auth-smtp.mjs --provider resend --test admin@veerafm.com
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

function parseSmtpFrom(from, fallbackEmail = "admin@veerafm.com") {
  const match = from?.match(/^(.+?)\s*<([^>]+)>$/);
  if (match) return { sender_name: match[1].trim(), sender_email: match[2].trim() };
  if (from?.includes("@")) return { sender_name: "VeeraFM", sender_email: from.trim() };
  return { sender_name: "VeeraFM", sender_email: fallbackEmail };
}

function pickProvider(env, providerArg) {
  if (providerArg) return providerArg.toLowerCase();
  if (env.RESEND_API_KEY?.startsWith("re_")) return "resend";
  if (env.NEON_AUTH_SMTP_HOST?.includes("resend")) return "resend";
  if (env.NEON_AUTH_SMTP_HOST?.includes("office365")) return "m365";
  if (env.SMTP_HOST?.includes("gmail")) return "gmail";
  return "resend";
}

function resolveNeonAuthSmtp(env, provider) {
  const sender_name_override = env.NEON_AUTH_SENDER_NAME || "VeeraFM";

  if (provider === "resend") {
    const password = env.RESEND_API_KEY || env.NEON_AUTH_SMTP_PASS;
    const { sender_email, sender_name: parsedName } = parseSmtpFrom(
      env.NEON_AUTH_SMTP_FROM || "VeeraFM <admin@veerafm.com>"
    );
    return {
      label: "Resend",
      host: env.NEON_AUTH_SMTP_HOST?.trim() || "smtp.resend.com",
      port: Number(env.NEON_AUTH_SMTP_PORT || 587),
      username: "resend",
      password,
      sender_email,
      sender_name: sender_name_override || parsedName,
    };
  }

  if (provider === "m365") {
    const host = env.NEON_AUTH_SMTP_HOST?.trim() || "smtp.office365.com";
    const port = Number(env.NEON_AUTH_SMTP_PORT || 587);
    const username = env.NEON_AUTH_SMTP_USER?.trim();
    const password = env.NEON_AUTH_SMTP_PASS?.replace(/\s+/g, "");
    const fromRaw =
      env.NEON_AUTH_SMTP_FROM?.trim() ||
      (username ? `VeeraFM <${username}>` : "");
    const { sender_email, sender_name: parsedName } = parseSmtpFrom(fromRaw);
    return {
      label: "Microsoft 365",
      host,
      port,
      username,
      password,
      sender_email,
      sender_name: sender_name_override || parsedName,
    };
  }

  if (provider === "gmail") {
    const host = env.SMTP_HOST?.trim();
    const port = Number(env.SMTP_PORT || 587);
    const username = env.SMTP_USER?.trim();
    const password = env.SMTP_PASS?.replace(/\s+/g, "");
    const { sender_email, sender_name: parsedName } = parseSmtpFrom(env.SMTP_FROM);
    return {
      label: "Gmail",
      host,
      port,
      username,
      password,
      sender_email,
      sender_name: sender_name_override || parsedName,
    };
  }

  return null;
}

function getApiKey(env) {
  if (env.NEON_API_KEY) return env.NEON_API_KEY;
  const credPath = resolve(homedir(), ".config", "neonctl", "credentials.json");
  if (!existsSync(credPath)) return null;
  const creds = JSON.parse(readFileSync(credPath, "utf8"));
  if (creds.expires_at && Date.now() > creds.expires_at - 60_000) {
    console.warn("neonctl token may be expired; set NEON_API_KEY or run: npx neonctl auth");
  }
  return creds.access_token || null;
}

async function neonFetch(path, { method = "GET", body, apiKey }) {
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  let data;
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    data = { raw: text };
  }
  if (!res.ok) {
    throw new Error(data.message || text || res.statusText);
  }
  return data;
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

  const providerIdx = process.argv.indexOf("--provider");
  const providerArg =
    providerIdx !== -1 ? process.argv[providerIdx + 1] : undefined;
  const provider = pickProvider(env, providerArg);

  const resolved = resolveNeonAuthSmtp(env, provider);
  if (!resolved) {
    console.error("Unknown provider. Use --provider resend|m365|gmail");
    process.exit(1);
  }

  const { label, host, port, username, password, sender_email, sender_name } = resolved;

  if (!host || !username || !password || !sender_email) {
    const missing = [
      !host && "host",
      !username && "username",
      !password && "password",
      !sender_email && "sender_email",
    ].filter(Boolean);
    console.error(`Missing Neon Auth SMTP (${label}): ${missing.join(", ")}`);
    if (label === "Resend") {
      console.error("Add RESEND_API_KEY=re_... to .env (from resend.com/api-keys)");
    }
    process.exit(1);
  }

  const smtp = {
    type: "standard",
    host,
    port,
    username,
    password,
    sender_email,
    sender_name,
  };

  const base = `/projects/${projectId}/branches/${branchId}/auth`;

  console.log(
    `Updating Neon Auth SMTP [${label}] (${host}:${port}, from ${sender_email})...`
  );
  const updated = await neonFetch(`${base}/email_provider`, {
    method: "PATCH",
    body: smtp,
    apiKey,
  });
  console.log("Email provider updated:", {
    type: updated.type,
    host: updated.host,
    port: updated.port,
    sender_email: updated.sender_email,
    sender_name: updated.sender_name,
  });

  const testArgIdx = process.argv.indexOf("--test");
  const testEmail =
    testArgIdx !== -1 ? process.argv[testArgIdx + 1] : env.NEON_AUTH_TEST_EMAIL;

  if (testEmail) {
    console.log(`Sending test email to ${testEmail}...`);
    const result = await neonFetch(`${base}/send_test_email`, {
      method: "POST",
      body: { ...smtp, recipient_email: testEmail },
      apiKey,
    });
    console.log(result.success ? "Test email sent successfully." : `Failed: ${result.error_message}`);
    if (!result.success) process.exit(1);
  }
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});

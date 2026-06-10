/**
 * Send a local SMTP test message.
 *
 * Usage:
 *   node scripts/test-smtp.mjs resend admin@veerafm.com
 *   node scripts/test-smtp.mjs m365 admin@veerafm.com
 *   node scripts/test-smtp.mjs gmail razeev2727@gmail.com
 */

import nodemailer from "nodemailer";
import { readFileSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

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

function parseFrom(from, fallbackEmail) {
  const match = from?.match(/^(.+?)\s*<([^>]+)>$/);
  if (match) return { name: match[1].trim(), email: match[2].trim() };
  return { name: "VeeraFM", email: fallbackEmail };
}

async function main() {
  const provider = (process.argv[2] || "resend").toLowerCase();
  const to = process.argv[3] || "admin@veerafm.com";
  const env = loadEnv();

  let host, port, user, pass, fromRaw;
  if (provider === "resend") {
    host = env.NEON_AUTH_SMTP_HOST || env.SMTP_HOST || "smtp.resend.com";
    port = Number(env.NEON_AUTH_SMTP_PORT || env.SMTP_PORT || 587);
    user = "resend";
    pass = env.RESEND_API_KEY || env.NEON_AUTH_SMTP_PASS || env.SMTP_PASS;
    fromRaw = env.NEON_AUTH_SMTP_FROM || env.SMTP_FROM || "VeeraFM <admin@veerafm.com>";
  } else if (provider === "m365" || provider === "office365") {
    host = env.NEON_AUTH_SMTP_HOST || "smtp.office365.com";
    port = Number(env.NEON_AUTH_SMTP_PORT || 587);
    user = env.NEON_AUTH_SMTP_USER;
    pass = env.NEON_AUTH_SMTP_PASS?.replace(/\s+/g, "");
    fromRaw = env.NEON_AUTH_SMTP_FROM;
  } else {
    host = env.SMTP_HOST;
    port = Number(env.SMTP_PORT || 587);
    user = env.SMTP_USER;
    pass = env.SMTP_PASS?.replace(/\s+/g, "");
    fromRaw = env.SMTP_FROM;
  }

  if (!host || !user || !pass) {
    console.error(`Missing SMTP credentials for ${provider}`);
    if (provider === "resend") {
      console.error("Set RESEND_API_KEY=re_... in .env");
    }
    process.exit(1);
  }

  const from = parseFrom(fromRaw, user === "resend" ? "admin@veerafm.com" : user);
  const transport = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });

  console.log(`Sending test via ${host}:${port} as ${from.email} → ${to}...`);
  await transport.sendMail({
    from: `${from.name} <${from.email}>`,
    to,
    subject: `VeeraFM SMTP test (${provider})`,
    text: `SMTP test from ${provider} at ${new Date().toISOString()}`,
  });
  console.log("Sent successfully.");
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});

import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const env = {};
for (const line of readFileSync(resolve(root, ".env"), "utf8").split("\n")) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith("#")) continue;
  const eq = trimmed.indexOf("=");
  if (eq === -1) continue;
  let val = trimmed.slice(eq + 1).trim();
  if (
    (val.startsWith('"') && val.endsWith('"')) ||
    (val.startsWith("'") && val.endsWith("'"))
  ) {
    val = val.slice(1, -1);
  }
  env[trimmed.slice(0, eq).trim()] = val;
}

const tenant = env.GRAPH_TENANT_ID || env.AZURE_TENANT_ID;
const client = env.GRAPH_CLIENT_ID || env.AZURE_CLIENT_ID;
const secret = env.GRAPH_CLIENT_SECRET || env.AZURE_CLIENT_SECRET;
const sender = env.GRAPH_SENDER_EMAIL;
const to = process.argv[2] || "admin@veerafm.com";

const tokenRes = await fetch(
  `https://login.microsoftonline.com/${tenant}/oauth2/v2.0/token`,
  {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: client,
      client_secret: secret,
      scope: "https://graph.microsoft.com/.default",
      grant_type: "client_credentials",
    }),
  }
);

const tokenData = await tokenRes.json();
if (!tokenData.access_token) {
  console.error("Token failed:", tokenData);
  process.exit(1);
}
console.log("Token OK");

const mailRes = await fetch(
  `https://graph.microsoft.com/v1.0/users/${encodeURIComponent(sender)}/sendMail`,
  {
    method: "POST",
    headers: {
      Authorization: `Bearer ${tokenData.access_token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message: {
        subject: "VeeraFM Graph test",
        body: {
          contentType: "Text",
          content: `Graph send test at ${new Date().toISOString()}`,
        },
        toRecipients: [{ emailAddress: { address: to } }],
      },
      saveToSentItems: true,
    }),
  }
);

const mailText = await mailRes.text();
if (mailRes.ok) {
  console.log(`Email sent from ${sender} → ${to}`);
} else {
  console.error(`Send failed (${mailRes.status}):`, mailText);
  process.exit(1);
}

import { envTrim } from "@/lib/email/smtp";

const GRAPH_SCOPE = "https://graph.microsoft.com/.default";
const GRAPH_BASE = "https://graph.microsoft.com/v1.0";

type TokenCache = {
  accessToken: string;
  expiresAt: number;
};

let tokenCache: TokenCache | null = null;

export function isGraphConfigured(): boolean {
  return Boolean(
    envTrim("AZURE_TENANT_ID") &&
      envTrim("AZURE_CLIENT_ID") &&
      envTrim("AZURE_CLIENT_SECRET") &&
      getGraphSenderEmail()
  );
}

export function getGraphSenderEmail(): string {
  return (
    envTrim("GRAPH_SENDER_EMAIL") ||
    parseEmailFrom(envTrim("SMTP_FROM")) ||
    "admin@veerafm.com"
  );
}

export function getGraphSenderName(): string {
  return envTrim("GRAPH_SENDER_NAME") || parseNameFrom(envTrim("SMTP_FROM")) || "VeeraFM";
}

function parseEmailFrom(from?: string): string | null {
  const match = from?.match(/<([^>]+)>/);
  if (match) return match[1].trim();
  return from?.includes("@") ? from.trim() : null;
}

function parseNameFrom(from?: string): string | null {
  const match = from?.match(/^(.+?)\s*</);
  return match ? match[1].trim() : null;
}

async function getGraphAccessToken(): Promise<string> {
  if (tokenCache && Date.now() < tokenCache.expiresAt - 60_000) {
    return tokenCache.accessToken;
  }

  const tenantId = envTrim("AZURE_TENANT_ID")!;
  const clientId = envTrim("AZURE_CLIENT_ID")!;
  const clientSecret = envTrim("AZURE_CLIENT_SECRET")!;

  const body = new URLSearchParams({
    client_id: clientId,
    client_secret: clientSecret,
    scope: GRAPH_SCOPE,
    grant_type: "client_credentials",
  });

  const res = await fetch(
    `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`,
    {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
    }
  );

  const data = (await res.json()) as {
    access_token?: string;
    expires_in?: number;
    error?: string;
    error_description?: string;
  };

  if (!res.ok || !data.access_token) {
    throw new Error(
      data.error_description || data.error || "Failed to obtain Graph access token"
    );
  }

  tokenCache = {
    accessToken: data.access_token,
    expiresAt: Date.now() + (data.expires_in ?? 3600) * 1000,
  };

  return data.access_token;
}

export type GraphSendMailInput = {
  to: string | string[];
  subject: string;
  text: string;
  html: string;
  replyTo?: string;
};

export async function sendGraphMail(input: GraphSendMailInput): Promise<void> {
  const senderEmail = getGraphSenderEmail();
  const senderName = getGraphSenderName();
  const token = await getGraphAccessToken();

  const toAddresses = (Array.isArray(input.to) ? input.to : [input.to]).map(
    (address) => ({
      emailAddress: { address },
    })
  );

  const message: Record<string, unknown> = {
    subject: input.subject,
    body: {
      contentType: "HTML",
      content: input.html || input.text.replace(/\n/g, "<br/>"),
    },
    from: {
      emailAddress: {
        name: senderName,
        address: senderEmail,
      },
    },
    toRecipients: toAddresses,
  };

  if (input.replyTo) {
    message.replyTo = [{ emailAddress: { address: input.replyTo } }];
  }

  const res = await fetch(
    `${GRAPH_BASE}/users/${encodeURIComponent(senderEmail)}/sendMail`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message, saveToSentItems: true }),
    }
  );

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Graph sendMail failed (${res.status}): ${errText}`);
  }
}

function stripQuotes(s: string) {
  return s.replace(/^\ufeff/, "").replace(/^["']|["']$/g, "").trim();
}

function splitEmails(csv: string): string[] {
  return csv
    .split(",")
    .map((s) => stripQuotes(s.trim()).toLowerCase())
    .filter(Boolean);
}

/**
 * Comma-separated CMS admins maintained in source. Always merged with
 * `process.env.ADMIN_EMAIL` (so Vercel/local env can add more without redeploy).
 *
 * Edit this string when you want repo-controlled allowlist changes.
 */
export const SOURCE_ADMIN_EMAILS = "razeev2727@gmail.com";

const FALLBACK_WHEN_ALL_EMPTY = "razeev2727@gmail.com";

/** Combined allowlist: SOURCE_ADMIN_EMAILS ∪ ADMIN_EMAIL env ∪ fallback. */
export function parseAdminEmailList(): string[] {
  const merged: string[] = [];
  if (SOURCE_ADMIN_EMAILS.trim()) {
    merged.push(...splitEmails(SOURCE_ADMIN_EMAILS));
  }
  if (process.env.ADMIN_EMAIL?.trim()) {
    merged.push(...splitEmails(process.env.ADMIN_EMAIL));
  }
  const uniq = Array.from(new Set(merged));
  return uniq.length > 0 ? uniq : splitEmails(FALLBACK_WHEN_ALL_EMPTY);
}

export function allowedAdminEmailSet(): ReadonlySet<string> {
  return new Set(parseAdminEmailList());
}

export function isAllowedAdminEmail(email: string): boolean {
  const normalized = email.trim().toLowerCase();
  return allowedAdminEmailSet().has(normalized);
}

/**
 * Canonical production URL for sitemap, robots, and Open Graph metadataBase.
 * Set NEXT_PUBLIC_SITE_URL on Vercel to the client's live domain (https://www.veerafm.com).
 */
export function getSiteUrl(): string {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (configured) {
    return configured.replace(/\/$/, "");
  }

  const vercel = process.env.VERCEL_URL?.trim();
  if (vercel) {
    const host = vercel.replace(/^https?:\/\//, "");
    return `https://${host}`;
  }

  return "http://localhost:3000";
}

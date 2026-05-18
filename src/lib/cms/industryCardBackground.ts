/**
 * Homepage industry cards used Tailwind gradient utilities from the CMS.
 * Those classes are easy to break (JIT scanning, typos, extra whitespace).
 * We paint the same gradients with CSS variables from globals.css instead.
 */
const DEFAULT =
  "linear-gradient(to bottom right, var(--brand-navy), var(--brand), var(--brand-light))";

const BY_TAILWIND_LIKE_KEY: Record<string, string> = {
  "from-brand-navy via-brand to-brand-light":
    "linear-gradient(to bottom right, var(--brand-navy), var(--brand), var(--brand-light))",
  "from-brand-navy via-brand-mid to-brand-light":
    "linear-gradient(to bottom right, var(--brand-navy), var(--brand-mid), var(--brand-light))",
  "from-brand-navy via-brand to-brand-pale":
    "linear-gradient(to bottom right, var(--brand-navy), var(--brand), var(--brand-pale))",
  "from-brand via-brand-mid to-brand-pale":
    "linear-gradient(to bottom right, var(--brand), var(--brand-mid), var(--brand-pale))",
};

export function normalizeIndustryGradientKey(raw: string) {
  return raw.trim().replace(/\s+/g, " ");
}

export function industryCardBackgroundImage(raw: string): string {
  const key = normalizeIndustryGradientKey(raw);
  return BY_TAILWIND_LIKE_KEY[key] ?? DEFAULT;
}

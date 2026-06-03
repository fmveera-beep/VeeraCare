/** Brand name used in `<title>`, Open Graph, and meta descriptions for search indexing. */
export const SEO_SITE_NAME = "VeeraFM";

export function seoPageTitle(pageTitle: string): string {
  return `${pageTitle} | ${SEO_SITE_NAME}`;
}

export const SEO_DEFAULT_DESCRIPTION =
  "VeeraFM provides reliable staffing and onsite workforce solutions through direct hire and managed supply—covering housemaids, skilled technicians, construction crews, event staff, and security personnel for facilities that must stay clean, compliant, and fully operational.";

/** Section `id` anchors on `/services` (must match services page section ids). */
export const serviceCategoryAnchors: Record<string, string> = {
  "Domestic & Care": "domestic-care",
  "Cleaning & Facilities": "cleaning-facilities",
  Construction: "construction",
  "Events & Hospitality": "events-hospitality",
  Security: "security",
  "Corporate Support": "corporate-support",
};

export function servicePageHref(category: string) {
  const anchor = serviceCategoryAnchors[category];
  return anchor ? `/services#${anchor}` : "/services";
}

/** URL-safe id for a service card on `/services` (matches ServiceCard `id`). */
export function serviceSlug(title: string) {
  return title
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Footer / deep links: always the services route, optional hash for a specific card. */
export function serviceDetailHref(title: string) {
  const slug = serviceSlug(title);
  return slug ? `/services#${slug}` : "/services";
}

import type { Metadata } from "next";

/** Relative path canonical — resolved with `metadataBase` in root layout. */
export function seoCanonical(path: string): Pick<Metadata, "alternates"> {
  const normalized =
    path === "/" || path === ""
      ? "/"
      : `/${path.replace(/^\/+/, "").replace(/\/+$/, "")}`;

  return {
    alternates: {
      canonical: normalized,
    },
  };
}

"use client";

import { useMemo, useState } from "react";
import { RemoteImage } from "@/components/media/RemoteImage";
import { cn } from "@/lib/utils";

export type ServiceCardDetails = {
  description: string;
  image: string;
  /** Reliable backup if primary image 5xx/404s */
  fallbackImage: string;
  imageAlt: string;
  badges: readonly string[];
};

export function ServiceCard({
  title,
  details,
  id,
}: {
  title: string;
  details: ServiceCardDetails;
  /** Anchor target for `/services#…` links from the footer. */
  id?: string;
}) {
  const [src, setSrc] = useState(details.image);

  const imgProps = useMemo(
    () => ({
      src,
      alt: details.imageAlt,
      fill: true as const,
      className:
        "object-cover transition-transform duration-700 ease-out group-hover:scale-105",
      sizes: "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw",
      onError: () => {
        setSrc((current) =>
          current === details.fallbackImage ? current : details.fallbackImage
        );
      },
    }),
    [details.fallbackImage, details.imageAlt, src]
  );

  return (
    <article
      id={id}
      className={cn(
        "group relative scroll-mt-28 overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-lg transition-all duration-300 md:scroll-mt-32",
        "hover:border-brand/35 hover:shadow-2xl hover:shadow-brand/15 motion-safe:hover:-translate-y-1"
      )}
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden">
        <RemoteImage {...imgProps} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
      </div>

      <div className="p-5 md:p-6">
        <h3 className="text-lg font-bold uppercase tracking-tight text-neutral-950 md:text-xl">
          {title}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-neutral-600">
          {details.description}
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          {details.badges.map((b) => (
            <span
              key={b}
              className="inline-flex items-center rounded-full border border-neutral-200 bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-neutral-800"
            >
              {b}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}


"use client";

import Image, { type ImageProps } from "next/image";

function isRemoteUrl(src: ImageProps["src"]): src is string {
  return typeof src === "string" && /^https?:\/\//i.test(src);
}

/**
 * Like next/image, but skips the optimization pipeline for absolute http(s) URLs by default.
 * Server-side fetching of Unsplash/CDN URLs often fails or flakes locally; the browser loads these reliably.
 */
export function RemoteImage({
  src,
  unoptimized,
  alt = "",
  ...rest
}: ImageProps) {
  const skipOptimizer =
    unoptimized !== undefined ? unoptimized : isRemoteUrl(src);

  return (
    <Image src={src} alt={alt} {...rest} unoptimized={skipOptimizer} />
  );
}

"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import veeraLogoPrimary from "@/assets/veera-logo-primary-transparent.png";
import veeraLogoWhite from "@/assets/veera-logo-white-transparent.png";

type VeeraLogoProps = {
  className?: string;
  /** Navbar / compact header */
  variant?: "nav" | "lockup" | "compact";
  /** `light` = white mark for dark backgrounds (e.g. footer). */
  tone?: "dark" | "light";
};

/** Desktop header lockup — wide; use `compact` on mobile in Navbar/Footer. */
const navSize =
  "h-12 w-[min(100%,28rem)] sm:h-14 sm:w-[min(100%,32rem)] md:h-[4.5rem] md:w-[460px] lg:w-[480px]";

const lockupSize =
  "h-14 w-[min(calc(100vw-2rem),360px)] sm:h-16 sm:w-[400px] md:h-[4.5rem] md:w-[460px]";

/** Fits admin cards and tight headers without overflowing parent */
const compactSize =
  "h-9 w-full max-w-[9.5rem] sm:h-10 sm:max-w-[11.5rem] md:h-11 md:max-w-[13rem]";

export function VeeraLogo({
  className,
  variant = "nav",
  tone = "dark",
}: VeeraLogoProps) {
  const showLockup = variant === "lockup";
  const showCompact = variant === "compact";

  const sizeClass = showLockup
    ? lockupSize
    : showCompact
      ? compactSize
      : navSize;

  const lightOnDark = tone === "light";
  const src = lightOnDark ? veeraLogoWhite : veeraLogoPrimary;

  return (
    <span
      className={cn(
        "relative block shrink-0",
        sizeClass,
        className
      )}
      aria-label="VeeraFM — Facilities Management LLC"
    >
      <Image
        src={src}
        alt="VeeraFM — Facilities Management LLC"
        fill
        priority={showLockup || variant === "nav"}
        className="object-contain object-left"
        sizes={
          showLockup
            ? "(max-width: 768px) 90vw, 440px"
            : showCompact
              ? "(max-width: 400px) 85vw, 280px"
              : "(max-width: 768px) 90vw, 480px"
        }
      />
    </span>
  );
}

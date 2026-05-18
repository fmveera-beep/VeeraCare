"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import veeraLogoPng from "@/assets/veera-logo-transparent.png";

type VeeraLogoProps = {
  className?: string;
  /** Navbar / compact header */
  variant?: "nav" | "lockup" | "compact";
  /** Reserved for future light-on-dark asset variants */
  tone?: "dark" | "light";
};

/** Large horizontal lockup — same visual weight on mobile and desktop. */
const navSize =
  "h-12 w-[min(calc(100vw-10.5rem),320px)] sm:h-[52px] sm:w-[min(calc(100vw-11rem),360px)] md:h-14 md:w-[min(100%,420px)] lg:w-[440px]";

const lockupSize =
  "h-14 w-[min(calc(100vw-2rem),360px)] sm:h-16 sm:w-[400px] md:h-[4.5rem] md:w-[460px]";

/** Fits admin cards and tight headers without overflowing parent */
const compactSize =
  "h-9 w-full max-w-[240px] sm:h-10 sm:max-w-[260px] md:h-11 md:max-w-[280px]";

export function VeeraLogo({
  className,
  variant = "nav",
}: VeeraLogoProps) {
  const showLockup = variant === "lockup";
  const showCompact = variant === "compact";

  const sizeClass = showLockup
    ? lockupSize
    : showCompact
      ? compactSize
      : navSize;

  return (
    <span
      className={cn(
        "relative block shrink-0",
        sizeClass,
        className
      )}
      aria-label="Veera Care Facilities Management LLC"
    >
      <Image
        src={veeraLogoPng}
        alt="Veera Care Facilities Management LLC"
        fill
        priority={showLockup}
        className="object-contain object-left"
        sizes={
          showLockup
            ? "(max-width: 768px) 90vw, 440px"
            : showCompact
              ? "(max-width: 400px) 85vw, 280px"
              : "(max-width: 768px) 90vw, 440px"
        }
      />
    </span>
  );
}

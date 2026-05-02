"use client";

import { useId } from "react";
import { cn } from "@/lib/utils";

type VeeraLogoProps = {
  className?: string;
  /** Navbar / compact header */
  variant?: "nav" | "lockup";
  /** Dark logo on light backgrounds, or light logo on dark (footer) */
  tone?: "dark" | "light";
};

/**
 * Vector lockup aligned to Veera Care brand blues (#4A69FF → #001F61).
 * Drop `public/veera-logo.png` and swap this component for next/image if you prefer the raster asset.
 */
export function VeeraLogo({
  className,
  variant = "nav",
  tone = "dark",
}: VeeraLogoProps) {
  const rawId = useId().replace(/[^a-zA-Z0-9]/g, "");
  const gradId = `veera-grad-${rawId}`;

  const gradStart = tone === "light" ? "#B8C9FF" : "#4A69FF";
  const gradEnd = tone === "light" ? "#FFFFFF" : "#001F61";
  const iconFill = tone === "light" ? "#FFFFFF" : "#001F61";
  const subFill = tone === "light" ? "rgba(255,255,255,0.82)" : "#001F61";
  const tagFill = tone === "light" ? "rgba(255,255,255,0.65)" : "#2a4a9e";

  const showLockup = variant === "lockup";

  return (
    <svg
      viewBox={showLockup ? "0 0 320 72" : "0 0 220 44"}
      className={cn("block h-9 w-auto md:h-10", className)}
      role="img"
      aria-label="Veera Care Facilities Management LLC"
    >
      <defs>
        <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={gradStart} />
          <stop offset="100%" stopColor={gradEnd} />
        </linearGradient>
      </defs>

      {/* Stylized mark — three upward strokes */}
      <g
        transform={showLockup ? "translate(0,10)" : "translate(0,2)"}
        fill="none"
        stroke={iconFill}
        strokeWidth="3.75"
        strokeLinecap="round"
        opacity={tone === "light" ? 0.98 : 1}
      >
        <path d="M6 31 Q9 17 11 13" />
        <path d="M13 31 Q17 15 21 11" />
        <path d="M21 31 Q26 13 33 9" />
      </g>

      <text
        x={showLockup ? 48 : 46}
        y={showLockup ? 34 : 30}
        fill={`url(#${gradId})`}
        style={{
          fontFamily: "ui-sans-serif, system-ui, -apple-system, Segoe UI, sans-serif",
          fontWeight: 700,
          fontSize: showLockup ? 28 : 26,
          letterSpacing: "-0.02em",
        }}
      >
        veera
      </text>

      {showLockup ? (
        <>
          <text
            x={48}
            y={48}
            fill={subFill}
            style={{
              fontFamily: "ui-sans-serif, system-ui, sans-serif",
              fontWeight: 500,
              fontSize: 10,
              letterSpacing: "0.04em",
            }}
          >
            Care Facilities Management LLC
          </text>
          <text
            x={48}
            y={62}
            fill={tagFill}
            style={{
              fontFamily: "Georgia, ui-serif, serif",
              fontWeight: 400,
              fontSize: 9,
              fontStyle: "italic",
            }}
          >
            We Realise you Ambitions
          </text>
        </>
      ) : null}
    </svg>
  );
}

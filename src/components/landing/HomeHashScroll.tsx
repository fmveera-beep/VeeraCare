"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

function scrollToCurrentHash() {
  const raw = window.location.hash;
  if (!raw || raw.length < 2) return;
  const el = document.getElementById(decodeURIComponent(raw.slice(1)));
  if (!el) return;
  const instant = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  el.scrollIntoView({ behavior: instant ? "auto" : "smooth", block: "start" });
}

/** Scroll to `#section` after navigating to `/#section` from another route or footer. */
export function HomeHashScroll() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname !== "/") return;

    const run = () => {
      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(scrollToCurrentHash);
      });
    };
    run();
    window.addEventListener("hashchange", run);
    return () => window.removeEventListener("hashchange", run);
  }, [pathname]);

  return null;
}

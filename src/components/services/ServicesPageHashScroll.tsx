"use client";

import { useEffect } from "react";

function scrollToHash() {
  const raw = window.location.hash;
  if (!raw || raw.length < 2) return;
  const id = decodeURIComponent(raw.slice(1));
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

/** Scroll to `#service-id` after client navigation to `/services`. */
export function ServicesPageHashScroll() {
  useEffect(() => {
    scrollToHash();
    window.addEventListener("hashchange", scrollToHash);
    return () => window.removeEventListener("hashchange", scrollToHash);
  }, []);

  return null;
}

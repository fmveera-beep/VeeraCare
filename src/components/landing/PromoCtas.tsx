"use client";

import type { MouseEvent } from "react";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function smoothScrollToHash(href: string, e: MouseEvent<HTMLAnchorElement>) {
  if (!href.startsWith("#")) return;
  const id = href.slice(1);
  if (!id) return;
  const el = document.getElementById(id);
  if (!el) return;
  e.preventDefault();
  const instant = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  el.scrollIntoView({
    behavior: instant ? "auto" : "smooth",
    block: "start",
  });
  window.history.pushState(null, "", href);
}

/** Navbar / hero — primary CTA to the contact / request flow */
export function GetAccessSolid({
  href = "/contact",
  className,
}: {
  href?: string;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "group inline-flex items-center gap-2.5 bg-brand px-4 py-2.5 text-[11px] font-bold uppercase tracking-[0.18em] text-white shadow-md shadow-brand/25 transition-all duration-300 ease-out hover:bg-brand/92 hover:shadow-xl hover:shadow-brand/35 motion-safe:hover:-translate-y-0.5 motion-safe:active:translate-y-0",
        className
      )}
    >
      Contact
      <span className="flex h-8 w-8 items-center justify-center border border-white/35 bg-white/15 transition-all duration-300 group-hover:border-white/55 group-hover:bg-white/25">
        <ArrowUpRight
          className="h-4 w-4 text-white transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
          strokeWidth={2}
        />
      </span>
    </Link>
  );
}

/** Dark sections — primary brand button, white arrow tile */
export function LearnMoreBrand({
  href = "#contact",
  className,
}: {
  href?: string;
  className?: string;
}) {
  return (
    <a
      href={href}
      onClick={(e) => smoothScrollToHash(href, e)}
      className={cn(
        "group inline-flex items-center gap-2.5 bg-brand px-6 py-3 text-[11px] font-bold uppercase tracking-[0.2em] text-white shadow-lg shadow-black/25 transition-all duration-300 ease-out hover:bg-brand/90 hover:shadow-xl hover:shadow-black/30 motion-safe:hover:-translate-y-0.5 motion-safe:active:translate-y-0",
        className
      )}
    >
      Learn More
      <span className="flex h-8 w-8 items-center justify-center bg-white transition-transform duration-300 group-hover:translate-x-0.5">
        <ArrowRight
          className="h-4 w-4 text-brand transition-transform duration-300 group-hover:translate-x-0.5"
          strokeWidth={2}
        />
      </span>
    </a>
  );
}

/** Career banner — white button */
export function ExploreOpeningsButton({
  href = "/careers",
  className,
}: {
  href?: string;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "group inline-flex items-center gap-2.5 bg-white px-6 py-3 text-[11px] font-bold uppercase tracking-[0.2em] text-black shadow-md transition-all duration-300 ease-out hover:bg-white hover:shadow-xl hover:shadow-black/15 motion-safe:hover:-translate-y-0.5 motion-safe:active:translate-y-0",
        className
      )}
    >
      Explore openings
      <span className="flex h-8 w-8 items-center justify-center bg-brand transition-all duration-300 group-hover:bg-brand-navy group-hover:shadow-md">
        <ArrowUpRight
          className="h-4 w-4 text-white transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
          strokeWidth={2}
        />
      </span>
    </Link>
  );
}

/** Services row — primary + ghost pair */
export function ServicesDualActions({ className }: { className?: string }) {
  return (
    <div className={cn("flex flex-wrap items-center justify-center gap-4", className)}>
      <Link
        href="#services"
        className="group inline-flex items-center gap-2.5 bg-brand px-6 py-3 text-[11px] font-bold uppercase tracking-[0.18em] text-white shadow-md transition-all duration-300 ease-out hover:bg-brand/90 hover:shadow-lg hover:shadow-brand/30 motion-safe:hover:-translate-y-0.5"
      >
        See all services
        <span className="flex h-8 w-8 items-center justify-center bg-white transition-transform duration-300 group-hover:translate-x-0.5">
          <ArrowRight
            className="h-4 w-4 text-brand transition-transform duration-300 group-hover:translate-x-0.5"
            strokeWidth={2}
          />
        </span>
      </Link>
    </div>
  );
}

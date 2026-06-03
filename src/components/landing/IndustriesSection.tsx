"use client";

import type { MouseEvent } from "react";
import { useState } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  Building2,
  ChevronLeft,
  ChevronRight,
  HardHat,
  HeartPulse,
  Home,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Reveal } from "@/components/motion/Reveal";
import { smoothScrollToHash } from "@/components/landing/PromoCtas";
import { industryCardBackgroundImage } from "@/lib/cms/industryCardBackground";
import { useEffect } from "react";

function scrollToContact(e: MouseEvent<HTMLAnchorElement>) {
  smoothScrollToHash("#contact", e);
}

const fallbackIndustries = [
  {
    key: "healthcare",
    title: "Healthcare Facilities",
    gradient: "from-brand-navy via-brand to-brand-light",
    icon: HeartPulse,
    body:
      "Clinical support, environmental services (EVS), infection prevention aides, and facility maintenance with audit ready workflows.",
    jobs: [
      "Clinical support and patient assistance",
      "EVS / infection prevention aides",
      "Facility maintenance coverage",
      "Supply and transport support",
      "Front desk and visitor coordination",
    ],
  },
  {
    key: "construction",
    title: "Construction & Manpower",
    gradient: "from-brand-navy via-brand-mid to-brand-light",
    icon: HardHat,
    body:
      "Skilled trades support, site helpers, heavy machinery operators, and safety certified labor for building and infrastructure projects.",
    jobs: [
      "Skilled trades support",
      "Site helpers and material handling",
      "Heavy machinery operators",
      "Safety certified labor",
      "Site cleanup and logistics support",
    ],
  },
  {
    key: "manufacturing",
    title: "Domestic & Residential Care",
    gradient: "from-brand-navy via-brand to-brand-pale",
    icon: Home,
    body:
      "Managed domestic staffing for homes—trusted housemaids and professional cleaners with consistent schedules and quality oversight.",
    jobs: [
      "Housemaids for day-to-day home support",
      "Professional house cleaning and deep cleans",
      "Move-in / move-out cleaning coverage",
      "Supervised teams with checklists",
      "Recurring schedules you can count on",
    ],
  },
  {
    key: "facilities",
    title: "Facilities & Workplaces",
    gradient: "from-brand via-brand-mid to-brand-pale",
    icon: Building2,
    body:
      "Janitorial, day porters, grounds maintenance, and event setup for commercial and corporate spaces.",
    jobs: [
      "Janitorial & day porters",
      "Grounds & light maintenance",
      "Event setup / swing shift coverage",
      "Supervisors & quality spotchecks",
      "Porters and move support",
    ],
  },
];

type Industry = {
  key: string;
  title: string;
  gradient: string;
  iconName?: string;
  icon: any;
  body: string;
  jobs: string[];
};

const DESKTOP_PAGE_SIZE = 4;

const industryCardLayout =
  "flex h-[26rem] max-h-[85vh] flex-col overflow-hidden rounded-2xl p-6 text-white shadow-md lg:h-[26rem] lg:max-h-none";

const industryScrollRegion =
  "mt-3 min-h-0 flex-1 overflow-y-auto overscroll-y-contain pr-1 touch-pan-y [scrollbar-color:rgba(255,255,255,0.35)_transparent] [scrollbar-width:thin] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-white/35";

const industryCardHover =
  "motion-safe:transition-[transform,box-shadow] motion-safe:duration-300 motion-safe:ease-[cubic-bezier(0.22,1,0.36,1)] motion-safe:hover:-translate-y-2 motion-safe:hover:shadow-[0_24px_60px_-12px_rgba(26,52,120,0.45)] motion-safe:hover:ring-2 motion-safe:hover:ring-white/25 motion-reduce:hover:translate-y-0";

function IndustryDeckCard({ item }: { item: Industry }) {
  const Icon = item.icon;
  return (
    <article
      className={`group/industry ${industryCardLayout} ${industryCardHover}`}
      style={{ backgroundImage: industryCardBackgroundImage(item.gradient) }}
    >
      <div className="flex shrink-0 items-start justify-between gap-3">
        <Icon
          className="h-7 w-7 shrink-0 transition-transform duration-200 group-hover/industry:scale-110"
          strokeWidth={1.35}
        />
        <Link
          href="#contact"
          aria-label={`Explore ${item.title}`}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-white/35 bg-white/10 text-white backdrop-blur-sm transition-all duration-200 hover:scale-110 hover:bg-white/25 motion-safe:active:scale-95"
        >
          <ArrowUpRight
            className="h-4 w-4 transition-transform duration-200 group-hover/industry:-translate-y-0.5 group-hover/industry:translate-x-0.5"
            strokeWidth={2}
          />
        </Link>
      </div>
      <h3 className="mt-6 line-clamp-2 shrink-0 text-2xl font-bold leading-tight tracking-tight md:text-[1.65rem] md:leading-snug">
        {item.title}
      </h3>
      <div className={industryScrollRegion}>
        <p className="text-sm leading-relaxed text-white/90">{item.body}</p>
        <ul className="mt-4 list-inside list-disc space-y-1.5 pb-1 text-[13px] leading-snug text-white/95">
          {item.jobs.map((role) => (
            <li key={role}>{role}</li>
          ))}
        </ul>
      </div>
      <a
        href="#contact"
        onClick={scrollToContact}
        aria-label={`Apply for ${item.title} — go to contact form`}
        className="mt-3 inline-flex w-full shrink-0 items-center justify-center rounded-md bg-white px-4 py-3 text-sm font-bold uppercase tracking-wide text-brand shadow-sm transition-all duration-200 hover:bg-white/95 hover:shadow-md motion-safe:active:scale-[0.99]"
      >
        Apply
      </a>
    </article>
  );
}

function IndustryMobileCard({ item }: { item: Industry }) {
  const Icon = item.icon;
  return (
    <article
      className={`group/ind-m ${industryCardLayout} ${industryCardHover}`}
      style={{ backgroundImage: industryCardBackgroundImage(item.gradient) }}
    >
      <div className="flex shrink-0 items-start justify-between gap-3">
        <Icon
          className="h-7 w-7 shrink-0 motion-safe:transition-transform motion-safe:duration-200 motion-safe:group-hover/ind-m:scale-110"
          strokeWidth={1.35}
        />
        <Link
          href="#contact"
          aria-label={`Talk to us about ${item.title}`}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-white/35 bg-white/10 transition-all duration-200 hover:scale-110 hover:bg-white/25 motion-safe:active:scale-95"
        >
          <ArrowUpRight
            className="h-4 w-4 transition-transform duration-200 group-hover/ind-m:-translate-y-0.5 group-hover/ind-m:translate-x-0.5"
            strokeWidth={2}
          />
        </Link>
      </div>
      <h3 className="mt-6 line-clamp-2 shrink-0 text-2xl font-bold leading-tight">{item.title}</h3>
      <div className={industryScrollRegion}>
        <p className="text-sm leading-relaxed text-white/90">{item.body}</p>
        <ul className="mt-4 list-inside list-disc space-y-1.5 pb-1 text-[13px] leading-snug text-white/95">
          {item.jobs.map((role) => (
            <li key={role}>{role}</li>
          ))}
        </ul>
      </div>
      <a
        href="#contact"
        onClick={scrollToContact}
        aria-label={`Apply for ${item.title} — go to contact form`}
        className="mt-auto inline-flex w-full shrink-0 items-center justify-center rounded-md bg-white px-4 py-3 pt-6 text-sm font-bold uppercase tracking-wide text-brand shadow-sm transition-all duration-200 hover:bg-white/95 hover:shadow-md motion-safe:active:scale-[0.99]"
      >
        Apply
      </a>
    </article>
  );
}

function LogoBars({ className }: { className?: string }) {
  const heights = [8, 14, 11, 17, 10];
  return (
    <div className={`flex items-end gap-[3px] ${className ?? ""}`} aria-hidden>
      {heights.map((h, i) => (
        <span
          key={i}
          style={{ height: h }}
          className="w-[5px] rounded-[1px] bg-brand"
        />
      ))}
    </div>
  );
}

export function IndustriesSection() {
  const [industries, setIndustries] = useState<Industry[]>(fallbackIndustries as any);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const totalSlides = industries.length;
  const pageLabel = String(carouselIndex + 1).padStart(2, "0");
  const activeIndustry = industries[carouselIndex % industries.length];
  const desktopSlice = Array.from({ length: DESKTOP_PAGE_SIZE }, (_, i) =>
    industries[(carouselIndex + i) % industries.length]
  );

  useEffect(() => {
    const iconMap: Record<string, any> = {
      HeartPulse,
      HardHat,
      Home,
      Building2,
    };
    fetch("/api/public/industries", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((data: { items: any[] }) => {
        if (!Array.isArray(data.items) || data.items.length === 0) return;
        const next = data.items.map((it) => ({
          key: String(it.key),
          title: String(it.title),
          gradient: String(it.gradient),
          iconName: String(it.iconName ?? "Building2"),
          icon: iconMap[String(it.iconName ?? "Building2").trim()] ?? Building2,
          body: String(it.body),
          jobs: Array.isArray(it.jobs)
            ? it.jobs.map((x: unknown) => String(x))
            : [],
        }));
        setIndustries(next);
        setCarouselIndex(0);
      })
      .catch(() => {});
  }, []);

  return (
    <section
      id="industries"
      className="border-b border-neutral-200 bg-white pb-14 pt-6 md:pb-20 md:pt-8"
    >
      <div className="mx-auto max-w-[1320px] px-4 md:px-8">
        <Reveal blur>
          <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
            <LogoBars className="shrink-0" />
            <h2 className="max-w-4xl text-xl font-bold uppercase leading-snug tracking-tight text-black md:text-2xl lg:text-[1.65rem] lg:leading-tight">
              We serve clients across a{" "}
              <span className="text-brand">wide range of industries:</span>
            </h2>
          </div>
        </Reveal>

        <div className="relative mt-10 md:mt-14">
          <div className="relative hidden min-h-[26rem] overflow-hidden py-3 lg:block">
            <AnimatePresence initial={false} mode="wait">
              <motion.div
                key={carouselIndex}
                role="group"
                aria-label={`Four industries starting at position ${carouselIndex + 1} of ${totalSlides}`}
                initial={{ opacity: 0, x: 36 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -36 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="grid gap-5 lg:grid-cols-4"
              >
                {desktopSlice.map((item, slot) => (
                  <div key={`${carouselIndex}-${slot}-${item.key}`}>
                    <IndustryDeckCard item={item} />
                  </div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="lg:hidden">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={activeIndustry.key}
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }}
                transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              >
                <IndustryMobileCard item={activeIndustry} />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-between gap-4 md:mt-12">
          <div className="flex flex-wrap items-center gap-3 text-[13px] font-medium tracking-wide text-neutral-500">
            <span className="flex max-w-[min(100%,14rem)] flex-wrap gap-1.5" aria-hidden>
              {industries.map((ind, i) => (
                <span
                  key={ind.key}
                  className={`h-2 w-2 shrink-0 rounded-full ${i === carouselIndex % industries.length ? "bg-brand" : "bg-neutral-300"}`}
                />
              ))}
            </span>
            <span className="tabular-nums text-neutral-800">
              {pageLabel} / {String(totalSlides).padStart(2, "0")}
            </span>
            <span className="text-neutral-500">· use arrows to browse</span>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              aria-label="Previous industry"
              className="group/car-prev flex h-10 w-10 items-center justify-center rounded-[4px] border border-black text-black transition-all duration-200 hover:border-brand hover:bg-neutral-100 hover:text-brand motion-safe:active:scale-95"
              onClick={() =>
                setCarouselIndex((s) => (s - 1 + totalSlides) % totalSlides)
              }
            >
              <ChevronLeft
                className="h-5 w-5 transition-transform duration-200 group-hover/car-prev:-translate-x-0.5"
                strokeWidth={1.5}
              />
            </button>
            <button
              type="button"
              aria-label="Next industry"
              className="group/car-next flex h-10 w-10 items-center justify-center rounded-[4px] border border-black text-black transition-all duration-200 hover:border-brand hover:bg-neutral-100 hover:text-brand motion-safe:active:scale-95"
              onClick={() => setCarouselIndex((s) => (s + 1) % totalSlides)}
            >
              <ChevronRight
                className="h-5 w-5 transition-transform duration-200 group-hover/car-next:translate-x-0.5"
                strokeWidth={1.5}
              />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

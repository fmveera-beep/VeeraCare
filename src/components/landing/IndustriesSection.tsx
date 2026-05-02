"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  Building2,
  Briefcase,
  ChevronLeft,
  ChevronRight,
  Cpu,
  Factory,
  GraduationCap,
  HeartPulse,
  Store,
  Truck,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Reveal } from "@/components/motion/Reveal";
import { careersEmail } from "@/config/site";

function applyMailtoHref(industryTitle: string) {
  const subject = encodeURIComponent(`Job application – ${industryTitle}`);
  const body = encodeURIComponent(
    `Hello VeeraCare,\r\n\r\nI would like to apply for opportunities in ${industryTitle}.\r\n\r\nPlease find my CV attached to this email.\r\n\r\nThank you,\r\n`
  );
  return `mailto:${careersEmail}?subject=${subject}&body=${body}`;
}

const industries = [
  {
    key: "technology",
    title: "Technology",
    gradient: "from-brand-navy via-[#2d4ea8] to-brand",
    icon: Cpu,
    body:
      "Software developers, IT support, and technical specialists—contract, contract-to-hire, or direct hire for offices and innovation teams.",
    jobs: [
      "Full-stack & front-end developers",
      "IT support & service desk",
      "QA, DevOps, and cloud admins",
      "Data & business analysts",
      "Technical project coordinators",
    ],
  },
  {
    key: "healthcare",
    title: "Healthcare",
    gradient: "from-brand via-[#5f7cff] to-[#a9bcff]",
    icon: HeartPulse,
    body:
      "Clinical staff, health IT, environmental services, and support roles—with credentialing and audit-ready workflows.",
    jobs: [
      "Nurses, MAs, and patient access",
      "Health IT & EHR support",
      "EVS / infection-prevention aides",
      "Lab & imaging assistants",
      "Revenue cycle & scheduling support",
    ],
  },
  {
    key: "manufacturing",
    title: "Manufacturing",
    gradient: "from-brand-navy via-brand to-[#7c94ff]",
    icon: Factory,
    body:
      "Line operators, logistics, maintenance helpers, and skilled trades alongside engineering support.",
    jobs: [
      "Machine operators & assemblers",
      "Warehouse & material handlers",
      "Maintenance technicians",
      "Quality & safety inspectors",
      "Production leads & team trainers",
    ],
  },
  {
    key: "facilities",
    title: "Facilities & workplaces",
    gradient: "from-brand via-[#5f7cff] to-[#d6deff]",
    icon: Building2,
    body:
      "Janitorial, porters, grounds, security-aware reception, and general maintenance—supervised routes with dependable coverage.",
    jobs: [
      "Janitorial & day porters",
      "Grounds & light maintenance",
      "Front desk & visitor management",
      "Event setup / swing-shift coverage",
      "Supervisors & quality spot-checks",
    ],
  },
  {
    key: "retail",
    title: "Retail & hospitality",
    gradient: "from-[#1a3a8f] via-brand to-[#9eb6ff]",
    icon: Store,
    body:
      "Customer-facing teams for stores, hotels, and venues—consistent staffing for peaks, nights, and weekends.",
    jobs: [
      "Sales associates & cashiers",
      "Stockers & receiving clerks",
      "Guest services & concierge",
      "Banquet / catering support",
      "Loss-prevention aware floor staff",
    ],
  },
  {
    key: "education",
    title: "Education & public sector",
    gradient: "from-brand-navy via-[#3558c9] to-brand",
    icon: GraduationCap,
    body:
      "Support staff for schools, colleges, and civic sites—background-check friendly roles with reliable attendance.",
    jobs: [
      "Classroom & teacher aides",
      "Custodial for campuses",
      "Administrative & registrar support",
      "After-school and athletics aides",
      "Municipal clerks & front-window staff",
    ],
  },
  {
    key: "logistics",
    title: "Logistics & distribution",
    gradient: "from-brand via-brand-navy to-[#6b84ff]",
    icon: Truck,
    body:
      "Drivers’ helpers, loaders, and DC associates—fast onboarding for seasonal ramps and new lanes.",
    jobs: [
      "Pickers, packers, and loaders",
      "Forklift & reach-truck (certified)",
      "Last-mile helpers & route support",
      "Inventory cycle counters",
      "DOT-aware dispatch assistants",
    ],
  },
  {
    key: "professional",
    title: "Professional & financial",
    gradient: "from-brand via-brand-navy to-[#b4c5ff]",
    icon: Briefcase,
    body:
      "Office operations for banks, insurers, and corporate HQ—contract and contract-to-hire bench strength.",
    jobs: [
      "Customer service & call center",
      "Loan processing & underwriting aides",
      "HR coordinators & onboarding",
      "Accounting clerks & AP/AR",
      "Executive assistants & admins",
    ],
  },
];

type Industry = (typeof industries)[number];

const DESKTOP_PAGE_SIZE = 4;

const industryCardShell =
  "flex h-[26rem] max-h-[85vh] flex-col overflow-hidden rounded-2xl bg-gradient-to-br p-6 text-white shadow-md lg:h-[26rem] lg:max-h-none";

const industryScrollRegion =
  "mt-3 min-h-0 flex-1 overflow-y-auto overscroll-y-contain pr-1 touch-pan-y [scrollbar-color:rgba(255,255,255,0.35)_transparent] [scrollbar-width:thin] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-white/35";

const industryCardHover =
  "motion-safe:transition-[transform,box-shadow] motion-safe:duration-300 motion-safe:ease-[cubic-bezier(0.22,1,0.36,1)] motion-safe:hover:-translate-y-2 motion-safe:hover:shadow-[0_24px_60px_-12px_rgba(0,31,97,0.45)] motion-safe:hover:ring-2 motion-safe:hover:ring-white/25 motion-reduce:hover:translate-y-0";

function industryShellClasses(gradient: string) {
  return `${industryCardShell} ${gradient}`;
}

function IndustryDeckCard({ item }: { item: Industry }) {
  return (
    <article
      className={`group/industry ${industryShellClasses(item.gradient)} ${industryCardHover}`}
    >
      <div className="flex shrink-0 items-start justify-between gap-3">
        <item.icon
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
        href={applyMailtoHref(item.title)}
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
      className={`group/ind-m ${industryShellClasses(item.gradient)} ${industryCardHover}`}
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
        href={applyMailtoHref(item.title)}
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
  const [carouselIndex, setCarouselIndex] = useState(0);
  const totalSlides = industries.length;
  const pageLabel = String(carouselIndex + 1).padStart(2, "0");
  const activeIndustry = industries[carouselIndex % industries.length];
  const desktopSlice = Array.from({ length: DESKTOP_PAGE_SIZE }, (_, i) =>
    industries[(carouselIndex + i) % industries.length]
  );

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

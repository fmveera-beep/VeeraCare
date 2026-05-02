"use client";

import type { ReactNode } from "react";
import { RemoteImage as Image } from "@/components/media/RemoteImage";
import Link from "next/link";
import {
  ArrowUpRight,
  Briefcase,
  Clock,
  FileText,
  GraduationCap,
  KeyRound,
  Settings,
  UsersRound,
} from "lucide-react";
import { motion } from "framer-motion";
import { Reveal } from "@/components/motion/Reveal";
import { ServicesDualActions } from "@/components/landing/PromoCtas";
import { landingImages } from "@/config/media";
import { staggerContainer, staggerItem } from "@/lib/motion-variants";

type Card = {
  title: string;
  body: string;
  icons: ReactNode;
  image: string;
};

const cards: Card[] = [
  {
    title: "Contract staffing",
    body: "Flexible talent for projects and peaks—with safety, and attendance rigor for onsite roles.",
    icons: (
      <>
        <FileText className="h-5 w-5" strokeWidth={1.35} />
      </>
    ),
    image: landingImages.services[0],
  },
  {
    title: "Direct hire & embedded teams",
    body: "Permanent placements and blended pods that share milestones, acceptance criteria, and transparent reporting.",
    icons: <UsersRound className="h-5 w-5" strokeWidth={1.35} />,
    image: landingImages.services[1],
  },
  {
    title: "Workforce intelligence",
    body: "Forecast labor demand, route coverage, and SLA risk—with dashboards your ops leaders actually use.",
    icons: <Briefcase className="h-5 w-5" strokeWidth={1.35} />,
    image: landingImages.services[2],
  },
  {
    title: "Managed services",
    body: "Run recurring operations: help desks, engineering pools, janitorial roster, and routing site coverage—with documented SLAs and accountable leads.",
    icons: (
      <span className="flex gap-1">
        <KeyRound className="h-5 w-5" strokeWidth={1.35} />
        <Settings className="h-5 w-5" strokeWidth={1.35} />
      </span>
    ),
    image: landingImages.services[3],
  },
  {
    title: "Employer of record",
    body: "Payroll, benefits, and compliance for distributed or onsite teams while your managers retain day-to-day direction—from coders to custodial staff.",
    icons: <Clock className="h-5 w-5" strokeWidth={1.35} />,
    image: landingImages.services[4],
  },
  {
    title: "Hire · Train · Deploy",
    body: "Upskill cohorts for safety-critical or technical tasks—developer certifications, maintenance licensure, or standardized cleaning protocols.",
    icons: <GraduationCap className="h-5 w-5" strokeWidth={1.35} />,
    image: landingImages.services[5],
  },
];

export function WhatWeDo() {
  return (
    <section id="services" className="border-b border-neutral-200 bg-white py-16 md:py-24">
      <div className="mx-auto max-w-[1320px] px-4 md:px-8">
        <Reveal blur>
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-brand">Solutions</p>
          <h2 className="mt-4 text-3xl font-bold uppercase tracking-tight text-black md:text-4xl">
            What we deliver
          </h2>
          <p className="mt-4 max-w-2xl text-lg text-neutral-700">
            Facilities programs and staffing models designed for hybrid technical teams and onsite
            crews—under one governance model.
          </p>
        </Reveal>

        <motion.div
          className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
        >
          {cards.map((card) => (
            <motion.article
              key={card.title}
              variants={staggerItem}
              whileHover={{ y: -6 }}
              transition={{ duration: 0.28 }}
              className="group/card flex flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm transition-all duration-300 hover:border-brand/25 hover:shadow-2xl hover:shadow-brand/10 hover:ring-2 hover:ring-brand/10"
            >
              <div className="flex items-start justify-between gap-3 p-6 pb-2">
                <div className="flex items-center gap-2 text-neutral-500 transition-colors duration-300 group-hover/card:text-brand [&_svg]:transition-colors">
                  {card.icons}
                </div>
                <Link
                  href="#contact"
                  aria-label={`Learn about ${card.title}`}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand/10 text-brand shadow-sm transition-all duration-300 hover:scale-110 hover:bg-brand hover:text-white hover:shadow-md"
                >
                  <ArrowUpRight
                    className="h-4 w-4 transition-transform duration-300 group-hover/card:-translate-y-0.5 group-hover/card:translate-x-0.5"
                    strokeWidth={2}
                  />
                </Link>
              </div>
              <div className="px-6 pb-4">
                <h3 className="text-lg font-bold text-black">{card.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-neutral-600">{card.body}</p>
              </div>
              <div className="relative mt-auto aspect-[16/10] w-full">
                <Image
                  src={card.image}
                  alt=""
                  fill
                  className="object-cover transition-transform duration-500 group-hover/card:scale-[1.03]"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
            </motion.article>
          ))}
        </motion.div>

        <Reveal delay={0.12}>
          <ServicesDualActions className="mt-14" />
        </Reveal>
      </div>
    </section>
  );
}

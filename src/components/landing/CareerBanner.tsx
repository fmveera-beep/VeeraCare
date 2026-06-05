"use client";

import { RemoteImage as Image } from "@/components/media/RemoteImage";
import { motion } from "framer-motion";
import { ExploreOpeningsButton } from "@/components/landing/PromoCtas";
import { WaveDivider } from "@/components/landing/WaveDivider";
import { landingImages } from "@/config/media";
import { ArrowUpRight } from "lucide-react";

export function CareerBanner() {
  return (
    <>
      <section id="membership" className="relative bg-brand pb-4 pt-16 text-white md:pb-2 md:pt-20">
        <div className="pointer-events-none absolute inset-0 opacity-30">
          <div className="absolute right-0 top-0 h-64 w-64 rounded-full bg-white/20 blur-3xl" />
        </div>

        <div className="relative mx-auto grid max-w-[1320px] items-center gap-10 px-4 md:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] md:gap-14 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45 }}
          >
            <p className="inline-flex flex-wrap items-center gap-2 rounded-full bg-black/20 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] backdrop-blur-sm">
              <span className="rounded-full bg-white px-2 py-0.5 text-[9px] font-bold text-brand">
                New
              </span>
              Jobs for onsite operations →
            </p>
            <h2 className="mt-6 text-3xl font-bold uppercase leading-[1.05] tracking-tight md:text-4xl lg:text-[2.75rem]">
              Meaningful work at every skill level
            </h2>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-white/92 md:text-lg">
              Join VeeraFM for placements across skilled onsite roles: technicians, construction
              crews, janitorial teams, porters, and maintenance assignments—with transparent pay
              practices, safety expectations, and steady schedules where routes allow.
            </p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center">
              <ExploreOpeningsButton href="/careers" />
              <a
                href="/careers"
                className="group inline-flex items-center gap-2.5 border border-white/40 bg-transparent px-6 py-3 text-[11px] font-bold uppercase tracking-[0.2em] text-white shadow-md transition-all duration-300 ease-out hover:border-white/70 hover:bg-white/10 hover:shadow-xl hover:shadow-black/15 motion-safe:hover:-translate-y-0.5"
              >
                Browse all jobs
                <span className="flex h-8 w-8 items-center justify-center bg-white/15 transition-all duration-300 group-hover:bg-white/25 group-hover:shadow-md">
                  <ArrowUpRight
                    className="h-4 w-4 text-white transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    strokeWidth={2}
                  />
                </span>
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative mx-auto aspect-[3/4] w-full max-w-sm overflow-hidden rounded-2xl border border-white/25 shadow-2xl md:mx-0 md:max-w-none"
          >
            <Image
              src="/images/sections/career-portrait.png"
              alt="Handshake between professionals"
              fill
              className="object-cover object-top"
              sizes="(max-width: 768px) 70vw, 38vw"
            />
          </motion.div>
        </div>

        <WaveDivider />
      </section>
    </>
  );
}

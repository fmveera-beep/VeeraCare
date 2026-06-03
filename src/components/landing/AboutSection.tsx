"use client";

import { RemoteImage as Image } from "@/components/media/RemoteImage";
import { Users } from "lucide-react";
import { motion } from "framer-motion";
import { LearnMoreBrand } from "@/components/landing/PromoCtas";
import { landingImages } from "@/config/media";

export function AboutSection() {
  return (
    <section id="about" className="border-b border-neutral-900 bg-neutral-950 py-16 text-white md:py-24">
      <div className="mx-auto max-w-[1320px] px-4 md:px-8">
        <div className="grid items-start gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-2 grid-rows-2 gap-3 md:gap-4"
          >
            <div className="relative min-h-[11rem] overflow-hidden rounded-2xl border border-white/10 md:min-h-[13rem]">
              <Image
                src="/images/sections/about-feature.png"
                alt="Onsite facilities workforce"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 45vw, 22vw"
              />
            </div>
            <div className="relative row-span-2 min-h-[14rem] overflow-hidden rounded-2xl border border-white/10 md:min-h-[24rem]">
              <Image
                src={landingImages.aboutServer}
                alt="Onsite workforce and jobsite operations"
                fill
                className="object-cover object-center"
                sizes="(max-width: 1024px) 45vw, 28vw"
              />
            </div>
            <div className="flex flex-col justify-between rounded-2xl bg-brand p-5 shadow-lg shadow-brand/30 md:p-6">
              <p className="text-4xl font-bold tracking-tight md:text-5xl">95%</p>
              <p className="mt-4 max-w-[11rem] text-xs font-semibold uppercase leading-snug tracking-wide text-white/95 md:text-sm">
                Worker retention on contract
              </p>
              <Users className="mt-4 h-8 w-8 text-white/80" strokeWidth={1.25} />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, delay: 0.08 }}
          >
            <p className="inline-flex flex-wrap items-center gap-2 rounded-full border border-white/20 bg-white/5 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-white/90">
              <span className="rounded-full bg-brand px-2 py-0.5 text-[9px] text-white">New</span>
              Facilities · staffing · nationwide
            </p>
            <h2 className="mt-6 text-3xl font-bold uppercase leading-tight tracking-tight md:text-[2.25rem]">
              About VeeraFM
            </h2>
            <div className="mt-6 space-y-5 text-base leading-relaxed text-white/80 md:text-lg">
              <p>
                VeeraFM delivers facilities management support and staffing for employers who need
                dependable onsite teams: skilled technicians, construction and manpower crews,
                janitors, porters, and maintenance staff.
              </p>
              <p>
                From short term coverage to employer of record programs, we align schedules, safety
                expectations, and compliance so your buildings stay operational and your workforce
                stays accountable.
              </p>
            </div>
            <div className="mt-10">
              <LearnMoreBrand href="#services" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

"use client";

import { RemoteImage as Image } from "@/components/media/RemoteImage";
import { motion } from "framer-motion";
import { LearnMoreBrand } from "@/components/landing/PromoCtas";
import { landingImages } from "@/config/media";

export function DEISection() {
  return (
    <section className="border-b border-neutral-200 bg-white py-16 md:py-24">
      <div className="mx-auto max-w-[1320px] px-4 md:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-16">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45 }}
            className="relative"
          >
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-neutral-200 shadow-xl md:aspect-[3/4]">
              <Image
                src={landingImages.deiSticky}
                alt="Inclusive workplace workshop"
                fill
                className="object-cover object-center"
                sizes="(max-width: 1024px) 100vw, 48vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
            </div>
            <div className="absolute bottom-5 left-5 right-5 max-w-md rounded-xl border border-white/60 bg-white p-4 shadow-lg md:bottom-8 md:left-8 md:p-5">
              <div className="flex gap-3">
                <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-brand" />
                <p className="text-sm font-medium leading-relaxed text-neutral-800">
                  Full pipelines from the front desk to the shop floor—we track fill-quality, safety
                  incidents, and retention across skilled and essential roles alike.
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: 0.06 }}
          >
            <p className="inline-flex flex-wrap items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-neutral-700">
              <span className="rounded-full bg-brand px-2 py-0.5 text-[9px] font-bold text-white">
                New
              </span>
              Inclusion across every role →
            </p>
            <h2 className="mt-6 text-3xl font-bold uppercase leading-tight tracking-tight md:text-[2.35rem]">
              <span className="text-brand">Diversity,</span>{" "}
              <span className="text-neutral-900">equity &amp; inclusion</span>
            </h2>
            <div className="mt-6 space-y-5 text-base leading-relaxed text-neutral-700 md:text-lg">
              <p>
                Respect matters for software engineers and for janitorial crews alike. VeeraCare
                applies consistent sourcing standards, safety orientation, and escalation paths so
                every worker is valued on site.
              </p>
              <p>
                Employers receive clear roster visibility, diversity metrics by job family, and
                supervisor-ready reporting—without sacrificing speed on daily fills.
              </p>
            </div>
            <div className="mt-10">
              <LearnMoreBrand href="#faq" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

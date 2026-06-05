"use client";

import { RemoteImage as Image } from "@/components/media/RemoteImage";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { GetAccessSolid } from "@/components/landing/PromoCtas";
import { landingImages } from "@/config/media";

const ease = [0.22, 1, 0.36, 1] as const;

export function Hero() {
  return (
    <section
      id="top"
      className="relative overflow-hidden border-b border-neutral-200 bg-white pb-6 pt-8 md:pb-10 md:pt-12"
    >
      <div className="relative mx-auto grid max-w-[1320px] gap-12 px-4 md:grid-cols-2 md:items-center md:gap-16 md:px-8">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease }}
            className="inline-flex flex-wrap items-center gap-2 rounded-full border border-neutral-200 bg-white px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-neutral-800 shadow-sm"
          >
            <span className="rounded-full bg-brand px-2 py-0.5 text-[9px] tracking-normal text-white">
              New
            </span>
            <span className="text-neutral-700">
              Facilities management · staffing · quality workforce +
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.52, delay: 0.06, ease }}
            className="mt-6 break-words text-[clamp(1.75rem,6vw,3rem)] font-bold uppercase leading-[1.05] tracking-tight"
          >
            <span className="text-brand">Staffing every skill</span>
            <br />
            <span className="text-neutral-900">from the ground up</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.52, delay: 0.12, ease }}
            className="mt-6 max-w-xl text-base leading-relaxed text-neutral-700 md:text-lg"
          >
            VeeraFM connects employers with highly skilled technical labor and essential onsite
            talent including specialized technicians, construction crews, janitors, porters, and
            maintenance staff so your facilities stay compliant, clean, and fully operational.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.52, delay: 0.18, ease }}
            className="mt-8 flex flex-col gap-6 sm:flex-row sm:items-center"
          >
            <GetAccessSolid />
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2">
                {landingImages.trustAvatars.map((src, i) => (
                  <div
                    key={src}
                    className="relative h-10 w-10 overflow-hidden rounded-full border-2 border-white shadow-sm"
                    style={{ zIndex: 3 - i }}
                  >
                    <Image src={src} alt="" fill className="object-cover" sizes="40px" />
                  </div>
                ))}
              </div>
              <p className="max-w-[14rem] text-sm font-medium leading-snug text-neutral-600">
                Trusted for skilled onsite teams and facilities coverage alike.
              </p>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.08, ease }}
          className="relative mx-auto w-full max-w-lg md:max-w-none"
        >
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[1.75rem] border border-neutral-200 shadow-2xl shadow-neutral-900/15 md:aspect-[3/4]">
            <Image
              src="/images/sections/hero-portrait.png"
              alt="Reception professional at a front desk"
              fill
              className="object-cover object-center"
              sizes="(max-width: 768px) 90vw, 45vw"
              priority
            />
          </div>

          <Link
            href="#industries"
            className="group/hero-link mt-6 hidden text-[11px] font-semibold uppercase tracking-[0.18em] text-brand underline-offset-4 transition-all duration-300 hover:gap-1.5 hover:text-brand-navy hover:underline md:inline-flex md:items-center md:gap-1"
          >
            View industries
            <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover/hero-link:-translate-y-0.5 group-hover/hero-link:translate-x-0.5" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

"use client";

import { useState } from "react";
import { RemoteImage as Image } from "@/components/media/RemoteImage";
import { Play } from "lucide-react";
import { motion } from "framer-motion";
import { Reveal } from "@/components/motion/Reveal";
import { CountUp } from "@/components/motion/CountUp";
import { IntroVideoModal } from "@/components/landing/IntroVideoModal";
import { LearnMoreBrand } from "@/components/landing/PromoCtas";
import { landingImages } from "@/config/media";

const stats = [
  {
    line1: (
      <>
        $<CountUp end={70} suffix="+" className="tabular-nums" />
      </>
    ),
    line2: "Million in client payroll facilitated",
  },
  {
    line1: (
      <>
        <CountUp end={536} suffix="+" className="tabular-nums" />
      </>
    ),
    line2: "Workers assigned across skilled & essential roles annually",
  },
  {
    line1: (
      <>
        <CountUp end={48} suffix="+" className="tabular-nums" />
      </>
    ),
    line2: "Employers & facilities partners served",
  },
  {
    line1: (
      <>
        <CountUp end={47} className="tabular-nums" />
        <span className="text-white">h</span>
      </>
    ),
    line2: "Median time to first qualified matches",
  },
  {
    line1: (
      <>
        <CountUp end={32} suffix="%" className="tabular-nums" />
      </>
    ),
    line2: "Avg. savings vs. fragmented staffing vendors",
  },
  {
    line1: (
      <>
        <CountUp end={90} suffix="%" className="tabular-nums" />
      </>
    ),
    line2: "On-time safety, credential & compliance checks",
  },
];

export function ByTheNumbers() {
  const [videoOpen, setVideoOpen] = useState(false);

  return (
    <>
      <section id="numbers" className="relative overflow-hidden border-b border-neutral-900 bg-neutral-950 py-16 text-white md:py-24">
        <div className="pointer-events-none absolute inset-0 opacity-[0.12]">
          <div className="absolute left-0 top-0 h-[70%] w-[55%] rounded-full bg-brand blur-[120px]" />
        </div>

        <div className="relative mx-auto max-w-[1320px] px-4 md:px-8">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)_minmax(0,1.1fr)] lg:items-start lg:gap-10">
            <Reveal blur>
              <p className="inline-flex flex-wrap items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em]">
                <span className="rounded-full bg-brand px-2 py-0.5 text-[9px] text-white">New</span>
                Facilities &amp; staffing intelligence
              </p>
              <h2 className="mt-6 text-4xl font-bold uppercase leading-[0.95] tracking-tight md:text-5xl lg:text-[3.25rem]">
                By the
                <br />
                <span className="text-brand">numbers</span>
              </h2>
              <p className="mt-6 max-w-md text-base leading-relaxed text-white/75 md:text-lg">
                Results across offices, industrial sites, healthcare environments, and
                public-facing facilities—from technical placements to janitorial and maintenance
                coverage.
              </p>
              <div className="mt-10">
                <LearnMoreBrand href="#contact" />
              </div>
            </Reveal>

            <Reveal delay={0.06}>
              <motion.button
                type="button"
                onClick={() => setVideoOpen(true)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="group/v relative mx-auto aspect-[3/5] w-full max-w-[320px] overflow-hidden rounded-2xl border border-white/15 transition-all duration-300 hover:border-brand/40 hover:shadow-xl hover:shadow-brand/20 lg:max-w-none"
              >
                <Image
                  src={landingImages.videoThumb}
                  alt=""
                  fill
                  className="object-cover transition-transform duration-700 group-hover/v:scale-105"
                  sizes="(max-width: 1024px) 80vw, 28vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 flex flex-col items-center gap-4 p-6 text-center">
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/85">
                    Watch our introduction
                  </p>
                  <span className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-brand bg-black/30 text-white backdrop-blur-sm transition-transform group-hover/v:scale-110">
                    <Play className="ml-0.5 h-6 w-6" fill="currentColor" />
                  </span>
                </div>
              </motion.button>
            </Reveal>

            <div className="grid grid-cols-2 overflow-hidden rounded-2xl border border-white/10">
              {stats.map((s, i) => (
                <Reveal key={i} delay={0.04 * i}>
                  <div
                    className={`p-6 md:p-8 ${i < 4 ? "border-b border-white/10" : ""} ${i % 2 === 0 ? "border-r border-white/10" : ""}`}
                  >
                    <p className="text-3xl font-bold tabular-nums md:text-4xl">{s.line1}</p>
                    <p className="mt-2 text-[13px] leading-snug text-white/65 md:text-sm">{s.line2}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>
      <IntroVideoModal open={videoOpen} onClose={() => setVideoOpen(false)} />
    </>
  );
}

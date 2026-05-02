"use client";

import { RemoteImage as Image } from "@/components/media/RemoteImage";
import { motion } from "framer-motion";
import { Quote, Star } from "lucide-react";
import { landingImages } from "@/config/media";

const reviews = [
  {
    quote:
      "VeeraCare tightened our facilities program and filled technical roles in the same breath—finally one throat to choke.",
    name: "Dir. Operations",
    org: "National retailer",
    avatar: landingImages.reviews[0],
  },
  {
    quote:
      "Audit trails for training and routes were non-negotiable. Their team showed up with checklists on day one.",
    name: "VP HR",
    org: "Healthcare network",
    avatar: landingImages.reviews[1],
  },
  {
    quote:
      "One partner for desks and buildings—routing, coverage, and SLA reporting we can actually defend in audits.",
    name: "Head of Workplace",
    org: "Tech services firm",
    avatar: landingImages.trustAvatars[2],
  },
] as const;

export function ReviewsBand() {
  return (
    <section
      id="reviews"
      className="border-b border-neutral-200 bg-[#f9f9f9] px-4 pb-10 pt-14 md:px-8 md:pb-14 md:pt-16"
    >
      <div className="mx-auto max-w-[1320px]">
        <p className="text-center text-[11px] font-bold uppercase tracking-[0.22em] text-brand">
          Customer reviews
        </p>
        <h2 className="mt-4 text-center text-2xl font-bold uppercase leading-tight tracking-tight text-neutral-900 md:text-3xl">
          What leaders say
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-center text-sm text-neutral-600 md:text-base">
          Facilities, HR, and operations teams partner with VeeraCare for unified staffing and
          onsite programs.
        </p>

        <div className="mt-10 grid gap-6 md:grid-cols-3 md:gap-8">
          {reviews.map((r, i) => (
            <motion.article
              key={r.name}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06, duration: 0.4 }}
              className="group/rev flex flex-col rounded-2xl border border-neutral-800 bg-[#1a1a1a] p-6 shadow-lg transition-all duration-300 motion-safe:hover:-translate-y-1 hover:border-brand/30 hover:shadow-2xl hover:shadow-brand/10 md:p-8"
            >
              <div className="flex min-h-[9rem] flex-col items-center justify-center gap-4 rounded-2xl bg-[#f5f0e8] px-4 py-8 transition-transform duration-300 group-hover/rev:scale-[1.02]">
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full border-2 border-white shadow-md ring-2 ring-brand/25">
                  <Image src={r.avatar} alt="" fill className="object-cover" sizes="64px" />
                </div>
                <div className="flex justify-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, s) => (
                    <Star
                      key={s}
                      className="h-4 w-4 fill-brand text-brand"
                      strokeWidth={0}
                      aria-hidden
                    />
                  ))}
                </div>
              </div>

              <blockquote className="mt-6 flex-1">
                <p className="text-sm font-medium leading-relaxed text-white/90 md:text-[15px]">
                  “{r.quote}”
                </p>
              </blockquote>

              <div className="mt-6 border-t border-white/10 pt-6">
                <p className="text-lg font-bold text-white">{r.name}</p>
                <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/55">
                  {r.org}
                </p>
              </div>

              <Quote className="mt-6 h-6 w-6 text-white/30" aria-hidden />
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

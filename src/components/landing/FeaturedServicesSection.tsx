"use client";

import {
  CalendarRange,
  HardHat,
  Home,
  Shield,
  Sparkles,
  Wrench,
} from "lucide-react";
import { motion } from "framer-motion";
import { RemoteImage as Image } from "@/components/media/RemoteImage";
import { Reveal } from "@/components/motion/Reveal";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

/** Reference photography (Unsplash / Pexels) — illustrates each expertise area */
const expertise = [
  {
    label: "Housemaids & Domestic Care",
    icon: Home,
    image:
      "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1200&q=82",
  },
  {
    label: "Professional House Cleaners",
    icon: Sparkles,
    image:
      "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1200&q=82",
  },
  {
    label: "Skilled Technicians",
    icon: Wrench,
    image:
      "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=1200&q=82",
  },
  {
    label: "Construction Workforce",
    icon: HardHat,
    image:
      "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1200&q=82",
  },
  {
    label: "Event Staff",
    icon: CalendarRange,
    image:
      "/images/services/event-staff.png",
  },
  {
    label: "Security Personnel",
    icon: Shield,
    image:
      "https://images.pexels.com/photos/34585117/pexels-photo-34585117.jpeg?auto=compress&cs=tinysrgb&w=1200",
  },
] as const;

const models = [
  {
    title: "Managed Staffing (We Hire & Supply)",
    body:
      "We directly employ, train, and manage dedicated professionals. We handle all the employment details and supply you with reliable staff for your immediate needs.",
  },
  {
    title: "Direct Recruitment (Connecting Talent)",
    body:
      "Acting as your recruitment partner, we help hospitals, clinics, and businesses find vetted, capable individuals ready to work—bridging the gap between talent and opportunity.",
  },
] as const;

const ease = [0.22, 1, 0.36, 1] as const;

export function FeaturedServicesSection() {
  return (
    <section
      id="featured-services"
      className="relative overflow-hidden border-b border-brand/15 bg-gradient-to-b from-peach via-white to-brand-tint py-14 md:py-20"
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(64,88,176,0.14),transparent)]"
        aria-hidden
      />
      <div className="relative mx-auto max-w-[1320px] px-4 md:px-8">
        <Reveal blur>
          <h2 className="text-center text-[clamp(1.75rem,4vw,2.75rem)] font-bold uppercase leading-[1.08] tracking-tight text-neutral-950">
            Our Core Services &amp; Staffing Solutions
          </h2>
          <p className="mx-auto mt-5 max-w-3xl text-center text-base leading-relaxed text-neutral-700 md:text-lg">
            Empowering the unemployed with meaningful jobs while providing reliable, managed care and
            staffing for your home or business.
          </p>
        </Reveal>

        <Reveal delay={0.06}>
          <div className="mt-16 rounded-3xl border-2 border-brand/25 bg-white/90 p-7 shadow-2xl shadow-brand/15 backdrop-blur-sm md:mt-20 md:p-12 lg:p-14">
            <h3 className="text-center text-3xl font-bold uppercase tracking-tight text-neutral-900 md:text-4xl lg:text-[2.5rem] lg:leading-tight">
              Our Expertise
            </h3>

            <div className="mt-10 grid gap-6 sm:grid-cols-2 sm:gap-7 lg:grid-cols-3 lg:gap-8 lg:mt-14">
              {expertise.map((item, i) => (
                <motion.article
                  key={item.label}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ delay: i * 0.06, duration: 0.45, ease }}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-neutral-200/90 bg-white shadow-lg transition-all duration-300 hover:border-brand/40 hover:shadow-2xl hover:shadow-brand/15"
                >
                  <div className="relative aspect-[4/3] w-full min-h-[200px] overflow-hidden sm:min-h-[220px] md:aspect-[5/4] md:min-h-[260px] lg:min-h-[280px]">
                    <Image
                      src={item.image}
                      alt={item.label}
                      fill
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
                    <span className="absolute left-4 top-4 flex h-12 w-12 items-center justify-center rounded-xl bg-white/95 text-brand shadow-md backdrop-blur-sm transition-transform duration-300 group-hover:scale-110 md:h-14 md:w-14">
                      <item.icon
                        className="h-6 w-6 md:h-7 md:w-7"
                        strokeWidth={1.5}
                        aria-hidden
                      />
                    </span>
                    <div className="absolute inset-x-0 bottom-0 p-4 md:p-5">
                      <p className="text-lg font-bold uppercase leading-snug tracking-tight text-white drop-shadow md:text-xl">
                        {item.label}
                      </p>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/services"
                className={cn(
                  "group inline-flex items-center gap-2.5 bg-brand px-6 py-3 text-[11px] font-bold uppercase tracking-[0.18em] text-white shadow-md transition-all duration-300 ease-out hover:bg-brand/90 hover:shadow-lg hover:shadow-brand/30 motion-safe:hover:-translate-y-0.5"
                )}
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
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <h3 className="mt-16 text-center text-xl font-bold uppercase tracking-wide text-neutral-900 md:text-2xl">
            How We Work With You
          </h3>
          <div className="mt-8 grid gap-6 md:grid-cols-2 md:gap-8">
            {models.map((m, i) => (
              <motion.article
                key={m.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.45, ease }}
                className="relative overflow-hidden rounded-2xl border-2 border-brand/25 bg-white p-6 shadow-2xl shadow-brand/15 ring-1 ring-brand/10 md:p-9"
              >
                <div
                  className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-brand/10 blur-2xl"
                  aria-hidden
                />
                <h4 className="relative text-lg font-bold leading-snug text-neutral-950 md:text-xl">
                  {i + 1}. {m.title}
                </h4>
                <p className="relative mt-4 text-sm leading-relaxed text-neutral-700 md:text-base">
                  {m.body}
                </p>
              </motion.article>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

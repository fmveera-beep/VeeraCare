"use client";

import {
  ClipboardCheck,
  RefreshCw,
  ShieldCheck,
  UserCheck,
} from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";
import { cn } from "@/lib/utils";

const points = [
  {
    icon: ShieldCheck,
    title: "100% Background Checked",
    body: "Every worker undergoes strict identity and background verification before joining our team.",
  },
  {
    icon: UserCheck,
    title: "Trained & Vetted Pros",
    body: "We strictly assess the skills and experience of our staff to ensure high quality service.",
  },
  {
    icon: RefreshCw,
    title: "Seamless Replacements",
    body: "If a worker is unavailable or isn't the right fit, we provide immediate replacements.",
  },
  {
    icon: ClipboardCheck,
    title: "Fully Managed Compliance",
    body: "We handle the employment details, liability, and payroll so you don't have to.",
  },
] as const;

type SecurityPointsProps = {
  className?: string;
};

export function SecurityPoints({ className }: SecurityPointsProps) {
  return (
    <section
      className={cn(
        "relative border-b border-neutral-200 bg-gradient-to-b from-[#f8faff] via-white to-white",
        className
      )}
      aria-labelledby="trust-safety-heading"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_90%_60%_at_50%_-10%,rgba(74,92,168,0.08),transparent)]" />

      <div className="relative mx-auto max-w-[1320px] px-4 py-12 md:px-8 md:py-16 lg:py-20">
        <Reveal blur>
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-brand">
              Trust &amp; safety
            </p>
            <h2
              id="trust-safety-heading"
              className="mt-3 text-[clamp(1.5rem,3.5vw,2.25rem)] font-bold uppercase leading-[1.12] tracking-tight text-neutral-950"
            >
              Security you can count on
            </h2>
            <p className="mt-4 text-base leading-relaxed text-neutral-700 md:text-lg">
              Clear vetting, skilled placements, and managed employment so your facility or home stays
              covered with confidence.
            </p>
          </div>
        </Reveal>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8 md:mt-14">
          {points.map((item, i) => {
            const Icon = item.icon;
            return (
              <Reveal key={item.title} delay={i * 0.06} y={16}>
                <div
                  className={cn(
                    "flex h-full flex-col rounded-2xl border border-neutral-200 bg-white/90 p-6 shadow-lg shadow-brand/5",
                    "transition-all duration-300 motion-safe:hover:-translate-y-0.5 motion-safe:hover:border-brand/30 motion-safe:hover:shadow-xl motion-safe:hover:shadow-brand/10"
                  )}
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-brand/20 bg-brand/10 text-brand">
                    <Icon className="h-6 w-6" strokeWidth={1.5} aria-hidden />
                  </div>
                  <h3 className="mt-5 text-sm font-bold uppercase leading-snug tracking-tight text-neutral-950 md:text-base">
                    {item.title}
                  </h3>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-neutral-600">{item.body}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

import type { Metadata } from "next";
import { PreHeader } from "@/components/landing/PreHeader";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { CTAForm } from "@/components/cta/CTAForm";
import { Reveal } from "@/components/motion/Reveal";
import { RemoteImage } from "@/components/media/RemoteImage";

import { seoCanonical } from "@/lib/seo/canonical";

export const metadata: Metadata = {
  ...seoCanonical("/solutions/direct-hire"),
  title: "Direct Hire",
  description:
    "VeeraFM direct hire delivers structured screening and reliable matching for skilled onsite roles—technicians, maintenance, janitorial teams, porters, and construction manpower—so hospitals, clinics, startups, and worksites can hire with confidence and reduce churn.",
  openGraph: {
    title: "Direct Hire — Skilled Onsite Talent Recruitment",
    description:
      "Structured screening and matching for skilled onsite hires across facilities, care settings, and active worksites.",
    type: "website",
    siteName: "VeeraFM",
    images: [
      {
        url: "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=1200&q=80",
        width: 1200,
        height: 630,
        alt: "Skilled onsite technician at work",
      },
    ],
  },
};

export default function DirectHirePage() {
  return (
    <>
      <PreHeader />
      <Navbar />
      <main>
        <section className="relative overflow-hidden border-b border-neutral-200 bg-black">
          <div className="absolute inset-0">
            <RemoteImage
              src="https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=2000&q=82"
              alt="Skilled onsite technician at work"
              fill
              className="object-cover opacity-80"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/55 to-black/85" />
          </div>
          <div className="relative mx-auto max-w-[1320px] px-4 py-16 md:px-8 md:py-24">
            <Reveal blur>
              <h1 className="max-w-4xl text-[clamp(2.1rem,4.4vw,3.6rem)] font-bold uppercase leading-[1.05] tracking-tight text-white">
                Direct Hire
              </h1>
              <p className="mt-6 max-w-3xl text-base leading-relaxed text-white/85 md:text-lg">
                We act as your recruitment partner screening, verifying, and matching dependable
                onsite candidates so your organization can hire with confidence and reduce churn.
              </p>
            </Reveal>
          </div>
        </section>

        <section className="bg-white py-14 md:py-20">
          <div className="mx-auto max-w-[1100px] px-4 md:px-8">
            <div className="grid gap-8 md:grid-cols-2 md:gap-10">
              <Reveal y={24}>
                <div className="rounded-2xl border border-neutral-200 bg-white p-7 shadow-lg shadow-brand/10">
                  <h2 className="text-xl font-bold uppercase tracking-tight text-neutral-950 md:text-2xl">
                    Structured screening & matching
                  </h2>
                  <p className="mt-3 text-base leading-relaxed text-neutral-700">
                    We evaluate candidates for role fit, attitude, and reliability then shortlist
                    profiles that match your work environment, shift needs, and onsite expectations.
                  </p>
                </div>
              </Reveal>

              <Reveal delay={0.06} y={24}>
                <div className="rounded-2xl border border-neutral-200 bg-white p-7 shadow-lg shadow-brand/10">
                  <h2 className="text-xl font-bold uppercase tracking-tight text-neutral-950 md:text-2xl">
                    Reduced hiring risk
                  </h2>
                  <p className="mt-3 text-base leading-relaxed text-neutral-700">
                    Direct hire should feel predictable. We verify backgrounds where applicable,
                    confirm availability, and set clear job expectations before interviews so your
                    time is spent only on serious candidates.
                  </p>
                </div>
              </Reveal>
            </div>

            <div className="mt-8 grid gap-8 md:mt-10 md:grid-cols-2 md:gap-10">
              <Reveal y={24}>
                <div className="rounded-2xl border border-neutral-200 bg-white p-7 shadow-lg shadow-brand/10">
                  <h2 className="text-xl font-bold uppercase tracking-tight text-neutral-950 md:text-2xl">
                    Built for care & facilities
                  </h2>
                  <p className="mt-3 text-base leading-relaxed text-neutral-700">
                    We understand roles that require trust, discipline, and consistency. Our process
                    prioritizes candidates who can work respectfully in care settings, facilities,
                    and active worksites while following your standards.
                  </p>
                </div>
              </Reveal>

              <Reveal delay={0.06} y={24}>
                <div className="rounded-2xl border border-neutral-200 bg-white p-7 shadow-lg shadow-brand/10">
                  <h2 className="text-xl font-bold uppercase tracking-tight text-neutral-950 md:text-2xl">
                    Bridging talent & opportunity
                  </h2>
                  <p className="mt-3 text-base leading-relaxed text-neutral-700">
                    Our work connects unemployed individuals to stable jobs. When organizations hire
                    through VeeraFM, they gain reliable onsite workers—and the community gains
                    meaningful employment opportunities.
                  </p>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        <CTAForm className="bg-gradient-to-b from-white to-[#f6f8ff]" />

        <Footer />
      </main>
    </>
  );
}


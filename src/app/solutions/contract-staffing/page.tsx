import type { Metadata } from "next";
import { PreHeader } from "@/components/landing/PreHeader";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { CTAForm } from "@/components/cta/CTAForm";
import { Reveal } from "@/components/motion/Reveal";
import { RemoteImage } from "@/components/media/RemoteImage";

import { seoCanonical } from "@/lib/seo/canonical";

export const metadata: Metadata = {
  ...seoCanonical("/solutions/contract-staffing"),
  title: "Contract Staffing",
  description:
    "VeeraFM contract staffing provides managed onsite workforce supply—hire, train, and deploy technicians, construction manpower, janitorial teams, porters, and maintenance staff with clear supervision, coverage continuity, and compliance-ready standards.",
  openGraph: {
    title: "Contract Staffing — Managed Onsite Workforce Supply",
    description:
      "Hire, train, and deploy managed onsite teams with reliable coverage and supervision for hospitals, clinics, startups, and construction sites.",
    type: "website",
    siteName: "VeeraFM",
    images: [
      {
        url: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1200&q=80",
        width: 1200,
        height: 630,
        alt: "Construction workforce on an active site",
      },
    ],
  },
};

export default function ContractStaffingPage() {
  return (
    <>
      <PreHeader />
      <Navbar />
      <main>
        <section className="relative overflow-hidden border-b border-neutral-200 bg-black">
          <div className="absolute inset-0">
            <RemoteImage
              src="https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=2000&q=82"
              alt="Construction workforce on an active site"
              fill
              className="object-cover opacity-80"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/55 to-black/85" />
          </div>
          <div className="relative mx-auto max-w-[1320px] px-4 py-16 md:px-8 md:py-24">
            <Reveal blur>
              <h1 className="max-w-4xl text-[clamp(2.1rem,4.4vw,3.6rem)] font-bold uppercase leading-[1.05] tracking-tight text-white">
                Contract Staffing
              </h1>
              <p className="mt-6 max-w-3xl text-base leading-relaxed text-white/85 md:text-lg">
                We hire, train, and manage the workforce then supply reliable onsite staff to your
                facility or worksite with clear supervision and strong accountability.
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
                    We handle employment details
                  </h2>
                  <p className="mt-3 text-base leading-relaxed text-neutral-700">
                    From sourcing and verification to onboarding and attendance tracking, VeeraFM
                    manages the employment responsibilities. This keeps your operation staffed
                    without adding hiring overhead to your internal team.
                  </p>
                </div>
              </Reveal>

              <Reveal delay={0.06} y={24}>
                <div className="rounded-2xl border border-neutral-200 bg-white p-7 shadow-lg shadow-brand/10">
                  <h2 className="text-xl font-bold uppercase tracking-tight text-neutral-950 md:text-2xl">
                    Managed supervision on the ground
                  </h2>
                  <p className="mt-3 text-base leading-relaxed text-neutral-700">
                    Our model prioritizes reliable coverage and consistent onsite standards. We set
                    expectations, brief staff on your requirements, and coordinate replacements when
                    needed so you stay covered during busy shifts and urgent needs.
                  </p>
                </div>
              </Reveal>
            </div>

            <div className="mt-8 grid gap-8 md:mt-10 md:grid-cols-2 md:gap-10">
              <Reveal y={24}>
                <div className="rounded-2xl border border-neutral-200 bg-white p-7 shadow-lg shadow-brand/10">
                  <h2 className="text-xl font-bold uppercase tracking-tight text-neutral-950 md:text-2xl">
                    Reliable staffing for facilities
                  </h2>
                  <p className="mt-3 text-base leading-relaxed text-neutral-700">
                    We support hospitals, clinics, workplaces, and active sites where punctuality,
                    safety, and professionalism matter. You get staff who arrive ready to work with
                    clear roles and day-to-day coordination.
                  </p>
                </div>
              </Reveal>

              <Reveal delay={0.06} y={24}>
                <div className="rounded-2xl border border-neutral-200 bg-white p-7 shadow-lg shadow-brand/10">
                  <h2 className="text-xl font-bold uppercase tracking-tight text-neutral-950 md:text-2xl">
                    Meaningful jobs, steady outcomes
                  </h2>
                  <p className="mt-3 text-base leading-relaxed text-neutral-700">
                    Every placement creates stable income for hardworking people. We focus on
                    long-term employability through training, discipline, and real work experience
                    across technical labor and facilities staffing categories.
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


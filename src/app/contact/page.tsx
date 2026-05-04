import { PreHeader } from "@/components/landing/PreHeader";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { CTAForm } from "@/components/cta/CTAForm";
import { Reveal } from "@/components/motion/Reveal";

export default function ContactPage() {
  return (
    <>
      <PreHeader />
      <Navbar />
      <main>
        <section className="border-b border-neutral-200 bg-gradient-to-b from-peach via-white to-[#f6f8ff] py-14 md:py-20">
          <div className="mx-auto max-w-[1320px] px-4 md:px-8">
            <Reveal blur>
              <h1 className="text-center text-[clamp(2.1rem,4.4vw,3.4rem)] font-bold uppercase leading-[1.06] tracking-tight text-neutral-950">
                Contact VeeraCare
              </h1>
              <p className="mx-auto mt-5 max-w-3xl text-center text-base leading-relaxed text-neutral-700 md:text-lg">
                Hiring managed staff for your home or facility—or looking for work with VeeraCare?
                Use the form below to tell us who you are and what you need; we&apos;ll route your
                inquiry to the right team.
              </p>
            </Reveal>
          </div>
        </section>

        <CTAForm className="bg-white" />

        <Footer />
      </main>
    </>
  );
}


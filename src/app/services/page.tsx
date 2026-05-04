import Link from "next/link";
import { PreHeader } from "@/components/landing/PreHeader";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { CTAForm } from "@/components/cta/CTAForm";
import { SecurityPoints } from "@/components/landing/SecurityPoints";
import { Reveal } from "@/components/motion/Reveal";
import { RemoteImage } from "@/components/media/RemoteImage";
import { cn } from "@/lib/utils";

const services = [
  {
    title: "Housemaid",
    description:
      "Trained domestic staff you can trust—managed and supported for consistent care at home.",
    image:
      "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1400&q=82",
  },
  {
    title: "House Cleaner",
    description:
      "Professional cleaning teams for homes and facilities—reliable schedules and strong supervision.",
    image:
      "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1400&q=82",
  },
  {
    title: "Technician",
    description:
      "Skilled technicians for repairs and maintenance—screened, punctual, and accountable.",
    image:
      "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=1400&q=82",
  },
  {
    title: "Construction",
    description:
      "Dependable workforce for site support—helping teams stay productive and on time.",
    image:
      "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1400&q=82",
  },
  {
    title: "Event",
    description:
      "On-ground event staff for setup, support, and guest flow—briefed, uniform-ready, and managed.",
    image:
      "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1400&q=82",
  },
  {
    title: "Security Personnel",
    description:
      "Disciplined security staff for venues and facilities—trained, supervised, and responsive.",
    image:
      "https://images.pexels.com/photos/34585117/pexels-photo-34585117.jpeg?auto=compress&cs=tinysrgb&w=1400",
  },
] as const;

export default function ServicesPage() {
  return (
    <>
      <PreHeader />
      <Navbar />
      <main>
        <section className="relative overflow-hidden border-b border-neutral-200 bg-gradient-to-b from-peach via-white to-[#f6f8ff] py-14 md:py-20">
          <div
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(74,105,255,0.16),transparent)]"
            aria-hidden
          />
          <div className="relative mx-auto max-w-[1320px] px-4 md:px-8">
            <Reveal blur>
              <h1 className="text-center text-[clamp(2.1rem,4.4vw,3.5rem)] font-bold uppercase leading-[1.06] tracking-tight text-neutral-950">
                Services
              </h1>
              <p className="mx-auto mt-5 max-w-3xl text-center text-base leading-relaxed text-neutral-700 md:text-lg">
                VeeraCare supplies reliable workers for homes, care settings, and management
                facilities—creating meaningful jobs while keeping your operations fully staffed.
              </p>
            </Reveal>

            <Reveal delay={0.06}>
              <div className="mx-auto mt-10 flex max-w-3xl flex-wrap items-center justify-center gap-4 md:mt-12">
                <Link
                  href="/solutions/contract-staffing"
                  className="group inline-flex items-center gap-2 rounded-[4px] border border-neutral-300 bg-white px-5 py-3 text-[11px] font-bold uppercase tracking-[0.18em] text-black transition-all duration-300 hover:border-brand hover:text-brand hover:shadow-md motion-safe:hover:-translate-y-0.5"
                >
                  Contract staffing
                  <span className="h-1.5 w-1.5 rounded-full bg-brand opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                </Link>
                <Link
                  href="/solutions/direct-hire"
                  className="group inline-flex items-center gap-2 rounded-[4px] border border-neutral-300 bg-white px-5 py-3 text-[11px] font-bold uppercase tracking-[0.18em] text-black transition-all duration-300 hover:border-brand hover:text-brand hover:shadow-md motion-safe:hover:-translate-y-0.5"
                >
                  Direct hire
                  <span className="h-1.5 w-1.5 rounded-full bg-brand opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                </Link>
              </div>
            </Reveal>
          </div>
        </section>

        <SecurityPoints />

        <section className="bg-white py-14 md:py-20">
          <div className="mx-auto max-w-[1320px] px-4 md:px-8">
            <Reveal>
              <h2 className="text-center text-3xl font-bold uppercase tracking-tight text-neutral-950 md:text-4xl">
                Core worker categories
              </h2>
              <p className="mx-auto mt-4 max-w-3xl text-center text-base leading-relaxed text-neutral-700 md:text-lg">
                Each role is recruited, verified, and supported—so you get consistent attendance,
                clear supervision, and staff who respect your standards.
              </p>
            </Reveal>

            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8 md:mt-14">
              {services.map((s, i) => (
                <Reveal key={s.title} delay={i * 0.06} y={18}>
                  <article
                  className={cn(
                    "group relative overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-lg transition-all duration-300 hover:border-brand/40 hover:shadow-2xl hover:shadow-brand/15",
                    "motion-safe:hover:-translate-y-1"
                  )}
                >
                  <div className="relative aspect-[4/3] w-full overflow-hidden">
                    <RemoteImage
                      src={s.image}
                      alt={s.title}
                      fill
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
                  </div>

                  <div className="absolute inset-x-0 bottom-0 p-5 md:p-6">
                    <h3 className="text-lg font-bold uppercase tracking-tight text-white md:text-xl">
                      {s.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-white/85">
                      {s.description}
                    </p>
                  </div>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <CTAForm className="bg-gradient-to-b from-white to-[#f6f8ff]" />

        <Footer />
      </main>
    </>
  );
}


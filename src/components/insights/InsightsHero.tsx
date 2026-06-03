import { Reveal } from "@/components/motion/Reveal";

export function InsightsHero() {
  return (
    <section className="relative overflow-hidden border-b border-neutral-200 bg-neutral-950 text-white">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_55%_at_50%_-15%,rgba(64,88,176,0.35),transparent)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07] [background-image:linear-gradient(to_right,rgba(255,255,255,0.14)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.14)_1px,transparent_1px)] [background-size:64px_64px]"
        aria-hidden
      />
      <div className="relative mx-auto max-w-[1320px] px-4 py-16 md:px-8 md:py-24">
        <Reveal blur>
          <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-brand-pale">
            VeeraFM Insights
          </p>
          <h1 className="mt-4 max-w-3xl break-words text-[clamp(1.65rem,6vw,3.25rem)] font-bold uppercase leading-[1.06] tracking-tight">
            Corporate perspectives on staffing &amp; facilities
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/75 md:text-lg">
            Practical guidance for startups and growing operators—workforce strategy,
            facilities discipline, and the operational habits that build trust at scale.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

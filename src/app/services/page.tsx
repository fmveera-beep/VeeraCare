import type { Metadata } from "next";
import Link from "next/link";
import { PreHeader } from "@/components/landing/PreHeader";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { CTAForm } from "@/components/cta/CTAForm";
import { Reveal } from "@/components/motion/Reveal";
import { cn } from "@/lib/utils";
import { serviceNeededGroups, type ServiceNeeded } from "@/lib/validations/cta";
import { ServiceCard, type ServiceCardDetails } from "@/components/services/ServiceCard";
import { ServicesPageHashScroll } from "@/components/services/ServicesPageHashScroll";
import { prisma } from "@/lib/prisma";
import { seedServices, toServiceCardDetails } from "@/lib/cms/seed";
import { serviceSlug } from "@/lib/cms/serviceSectionAnchors";
import { SEO_SITE_NAME, seoPageTitle } from "@/lib/seo/brand";
import { seoCanonical } from "@/lib/seo/canonical";

/** DB-backed page — must not run Prisma at build time (e.g. Vercel without DATABASE_URL during `next build`). */
export const dynamic = "force-dynamic";

/** Stable CDN URLs — avoid source.unsplash.com (frequent 5xx). */
const roleDetails: Record<
  ServiceNeeded,
  ServiceCardDetails
> = {
  Housemaid: {
    description: "Trusted domestic support managed for consistency, discretion, and respectful care at home.",
    image:
      "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1600&q=80",
    fallbackImage:
      "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1600&q=80",
    imageAlt: "Domestic housekeeping and home care",
    badges: ["Residential", "Managed", "Verified"],
  },
  "Nanny/Babysitter": {
    description: "Reliable childcare coverage screened caregivers aligned to your household routines and schedules.",
    image:
      "https://images.unsplash.com/photo-1651688729724-bafbf0935462?auto=format&fit=crop&w=1600&q=80",
    fallbackImage:
      "https://images.unsplash.com/photo-1651688729724-bafbf0935462?auto=format&fit=crop&w=1600&q=80",
    imageAlt: "Childcare and babysitting",
    badges: ["Childcare", "Flexible hours", "Household fit"],
  },
  "Elderly Caretaker": {
    description: "Compassionate assistance for seniors patient, dependable support with dignity and clear reporting.",
    image:
      "https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&w=1600&q=80",
    fallbackImage:
      "https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&w=1600&q=80",
    imageAlt: "Senior care and elderly assistance",
    badges: ["Care", "Dependable", "Supervised"],
  },
  "Personal Cook": {
    description: "Household and small team cooking menus, hygiene standards, and predictable meal coverage.",
    image:
      "https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=1600&q=80",
    fallbackImage:
      "https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=1600&q=80",
    imageAlt: "Cook preparing food in a kitchen",
    badges: ["Household", "Hygiene", "Schedules"],
  },
  "Private Driver": {
    description: "Professional driving support punctual chauffeurs screened for safety and professionalism.",
    image:
      "/images/services/private-driver.png",
    fallbackImage:
      "/images/services/private-driver.png",
    imageAlt: "Professional driving on the road",
    badges: ["Chauffeur", "Safety", "Discretion"],
  },
  "Deep Cleaning": {
    description: "Intensive turnover and detailed cleans high-touch standards for homes and facility zones.",
    image:
      "/images/services/deep-cleaning.png",
    fallbackImage:
      "/images/services/deep-cleaning.png",
    imageAlt: "Deep cleaning of interior spaces",
    badges: ["Turnover", "Detail-oriented", "SLA-ready"],
  },
  "Janitorial Staff": {
    description: "Daily facility upkeep and porter style support consistent attendance and supervision.",
    image:
      "/images/services/janitorial-staff.png",
    fallbackImage:
      "/images/services/janitorial-staff.png",
    imageAlt: "Janitorial cleaning in a facility",
    badges: ["Facilities", "Day/night", "Accountable"],
  },
  Plumber: {
    description: "Onsite plumbing labor and trade adjacent support under your direction and safety protocols.",
    image:
      "https://images.unsplash.com/photo-1749532125405-70950966b0e5?auto=format&fit=crop&w=1600&q=80",
    fallbackImage:
      "https://images.unsplash.com/photo-1749532125405-70950966b0e5?auto=format&fit=crop&w=1600&q=80",
    imageAlt: "Plumber repairing pipes and fixtures in a bathroom",
    badges: ["Trades support", "Onsite", "Compliance-aware"],
  },
  Electrician: {
    description: "Electrical support crews screened for credentials alignment dependable coverage for sites and facilities.",
    image:
      "https://images.unsplash.com/photo-1621905251918-48416bd8575a?auto=format&fit=crop&w=1600&q=80",
    fallbackImage:
      "https://images.unsplash.com/photo-1621905251918-48416bd8575a?auto=format&fit=crop&w=1600&q=80",
    imageAlt: "Electrician working with wiring",
    badges: ["Electrical", "Safety-first", "Experienced"],
  },
  "Gardener/Landscaper": {
    description: "Groundskeeping and landscaping labor seasonal upkeep, curb appeal, and outdoor maintenance.",
    image:
      "https://images.pexels.com/photos/169523/pexels-photo-169523.jpeg?auto=compress&cs=tinysrgb&w=1600",
    fallbackImage:
      "https://images.pexels.com/photos/169523/pexels-photo-169523.jpeg?auto=compress&cs=tinysrgb&w=1600",
    imageAlt: "Landscaping and gardening",
    badges: ["Outdoors", "Seasonal", "Hands-on"],
  },
  "General Laborer": {
    description: "Site ready manpower for moving materials, prep work, and general onsite assistance.",
    image:
      "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1600&q=80",
    fallbackImage:
      "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1600&q=80",
    imageAlt: "Construction workers on a building site",
    badges: ["Manpower", "Site-ready", "Briefed crews"],
  },
  Mason: {
    description: "Masonry support aligned to your foreman brick/block labor with trades discipline.",
    image:
      "https://images.pexels.com/photos/8961399/pexels-photo-8961399.jpeg?auto=compress&cs=tinysrgb&w=1600",
    fallbackImage:
      "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1600&q=80",
    imageAlt: "Brick masonry construction",
    badges: ["Masonry", "Structural", "Worksite"],
  },
  Carpenter: {
    description: "Carpentry helpers and skilled woodworkers for fabrication, fit out, and onsite carpentry tasks.",
    image:
      "https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=1600&q=80",
    fallbackImage:
      "https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=1600&q=80",
    imageAlt: "Carpenter woodworking",
    badges: ["Wood trades", "Fit-out", "Precision"],
  },
  Painter: {
    description: "Painting crews for interiors and facades prep, finish standards, and clean worksite habits.",
    image:
      "/images/services/painter.png",
    fallbackImage:
      "/images/services/painter.png",
    imageAlt: "Painter applying paint",
    badges: ["Finish quality", "Prep & coat", "Site-safe"],
  },
  "Waitstaff/Catering": {
    description: "Front-of-house and banquet style service—guest-ready presentation and coordinated teamwork.",
    image:
      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1600&q=80",
    fallbackImage:
      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1600&q=80",
    imageAlt: "Restaurant service and dining",
    badges: ["Hospitality", "Banquets", "Guest-ready"],
  },
  Bartender: {
    description: "Bar coverage for events and venues hygiene, pace, and professional guest interaction.",
    image:
      "https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&w=1600&q=80",
    fallbackImage:
      "https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&w=1600&q=80",
    imageAlt: "Bartender preparing drinks",
    badges: ["Bar service", "Events", "RSA-aligned hire"],
  },
  "Event Setup Crew": {
    description: "Load in/load out and staging labor rigging adjacent support briefed for your run of show.",
    image:
      "/images/services/event-staff.png",
    fallbackImage:
      "/images/services/event-staff.png",
    imageAlt: "Event crew setting up a venue",
    badges: ["Staging", "Load-in/out", "Uniform-ready"],
  },
  "General Security Guard": {
    description: "Uniformed presence for sites and facilities—access control, patrols, and incident readiness.",
    image:
      "/images/services/general-security-guard.png",
    fallbackImage:
      "/images/services/general-security-guard.png",
    imageAlt: "Security guard on duty",
    badges: ["Patrols", "Access control", "Professional"],
  },
  "VIP Security": {
    description: "Discreet close-protection adjacent staffing—polished presence aligned to premium hospitality.",
    image:
      "/images/services/vip-security.png",
    fallbackImage:
      "/images/services/vip-security.png",
    imageAlt: "Corporate building security presence",
    badges: ["VIP-ready", "Discreet", "Executive venues"],
  },
  Bouncer: {
    description: "Venue door coverage—crowd management support trained for calm, firm professionalism.",
    image:
      "/images/services/bouncer.png",
    fallbackImage:
      "/images/services/bouncer.png",
    imageAlt: "Crowd queued outside an entertainment venue at night",
    badges: ["Nightlife", "Crowd aware", "Firm & calm"],
  },
  "Office Boy/Peon": {
    description: "Office runners and general helpers—mail, pantry support, errands, and light facility tasks.",
    image:
      "/images/services/office-boy-peon.png",
    fallbackImage:
      "/images/services/office-boy-peon.png",
    imageAlt: "Modern office workspace",
    badges: ["Corporate", "Support", "Daily ops"],
  },
  Receptionist: {
    description: "Front-desk coverage—greetings, visitor coordination, and polished first impressions.",
    image:
      "/images/services/receptionist.png",
    fallbackImage:
      "/images/services/receptionist.png",
    imageAlt: "Business reception and front desk",
    badges: ["Front desk", "Scheduling", "Professional tone"],
  },
  "Delivery Courier": {
    description: "Last-mile support for parcels and documents—route discipline and accountable handoffs.",
    image:
      "https://images.pexels.com/photos/7706453/pexels-photo-7706453.jpeg?auto=compress&cs=tinysrgb&w=1600",
    fallbackImage:
      "https://images.pexels.com/photos/6867348/pexels-photo-6867348.jpeg?auto=compress&cs=tinysrgb&w=1600",
    imageAlt: "Courier delivering packages",
    badges: ["Last-mile", "Accountable", "Time-sensitive"],
  },
};

const sectionMeta: Record<
  keyof typeof serviceNeededGroups,
  { id: string; eyebrow: string; intro: string; tint: string; ring: string }
> = {
  "Domestic & Care": {
    id: "domestic-care",
    eyebrow: "Homes & households",
    intro:
      "Domestic staffing built around trust—consistent schedules, clear expectations, and supervised placements.",
    tint: "from-brand/[0.09] via-white to-white",
    ring: "ring-brand/15",
  },
  "Cleaning & Facilities": {
    id: "cleaning-facilities",
    eyebrow: "Facilities & trades-adjacent",
    intro:
      "Facility upkeep and specialty onsite roles—clean teams and skilled labor aligned to your standards.",
    tint: "from-emerald-500/[0.09] via-white to-white",
    ring: "ring-emerald-500/15",
  },
  Construction: {
    id: "construction",
    eyebrow: "Worksites & builds",
    intro:
      "Dependable manual labor and trade support for construction programs—safety-minded crews with attendance focus.",
    tint: "from-amber-500/[0.09] via-white to-white",
    ring: "ring-amber-500/20",
  },
  "Events & Hospitality": {
    id: "events-hospitality",
    eyebrow: "Guests & venues",
    intro:
      "Hospitality-forward staffing for events and dining programs—presentation-ready teams briefed for busy service.",
    tint: "from-rose-500/[0.07] via-white to-white",
    ring: "ring-rose-400/20",
  },
  Security: {
    id: "security",
    eyebrow: "Protection & presence",
    intro:
      "Security staffing from everyday patrols to premium venues—trained professionalism and clear escalation paths.",
    tint: "from-neutral-900/[0.06] via-white to-white",
    ring: "ring-neutral-900/10",
  },
  "Corporate Support": {
    id: "corporate-support",
    eyebrow: "Offices & operations",
    intro:
      "Day-to-day workplace coverage—front desk, runners, and courier support that keeps teams moving.",
    tint: "from-sky-500/[0.07] via-white to-white",
    ring: "ring-sky-500/20",
  },
};

export const metadata: Metadata = {
  ...seoCanonical("/services"),
  title: seoPageTitle("Services — Domestic, Facility & Manual Labor Staffing"),
  description:
    "Explore VeeraFM domestic care, cleaning & facilities, construction labor, hospitality, security, and corporate support staffing—managed, onsite roles with clear standards.",
  openGraph: {
    title: "VeeraFM Services — Comprehensive Onsite Staffing",
    description:
      "Domestic, facility, construction, hospitality, security, and corporate support roles—reliable onsite staffing.",
    type: "website",
    siteName: SEO_SITE_NAME,
    images: [
      {
        url: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1200&q=80",
        width: 1200,
        height: 630,
        alt: "Construction workforce on an active site",
      },
    ],
  },
};

async function ensureSeeded() {
  const count = await prisma.cmsService.count();
  if (count > 0) return;
  await prisma.cmsService.createMany({
    data: seedServices.map((s) => ({
      title: s.title,
      category: s.category,
      description: s.description,
      imageUrl: s.imageUrl,
      imageAlt: s.imageAlt ?? null,
      badges: (s.badges as any) ?? null,
      order: s.order ?? 0,
    })),
  });
}

export default async function ServicesPage() {
  await ensureSeeded();
  const dbServices = await prisma.cmsService.findMany({
    orderBy: [{ order: "asc" }, { title: "asc" }],
  });

  type DbService = (typeof dbServices)[number];
  const byCategory = new Map<string, DbService[]>();
  for (const s of dbServices) {
    const list = byCategory.get(s.category) ?? [];
    list.push(s);
    byCategory.set(s.category, list);
  }

  const sections = Object.entries(serviceNeededGroups) as Array<
    [keyof typeof serviceNeededGroups, readonly ServiceNeeded[]]
  >;

  return (
    <>
      <PreHeader />
      <Navbar />
      <main>
        <ServicesPageHashScroll />
        <section className="relative overflow-hidden border-b border-neutral-200 bg-gradient-to-b from-peach via-white to-[#f6f8ff] py-14 md:py-20">
          <div
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(64,88,176,0.16),transparent)]"
            aria-hidden
          />
          <div className="relative mx-auto max-w-[1320px] px-4 md:px-8">
            <Reveal blur>
              <h1 className="text-center text-[clamp(2.1rem,4.4vw,3.5rem)] font-bold uppercase leading-[1.06] tracking-tight text-neutral-950">
                Services
              </h1>
              <p className="mx-auto mt-5 max-w-3xl text-center text-base leading-relaxed text-neutral-700 md:text-lg">
                VeeraCare supplies managed onsite staffing across domestic households, facilities,
                worksites, venues, and workplaces—comprehensive coverage with supervision you can
                trust.
              </p>
            </Reveal>

            <Reveal delay={0.06}>
              <div className="mx-auto mt-10 flex max-w-5xl flex-wrap items-center justify-center gap-3 md:mt-12">
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
                {sections.map(([label]) => {
                  const meta = sectionMeta[label];
                  return (
                    <a
                      key={label}
                      href={`#${meta.id}`}
                      className="inline-flex items-center gap-2 rounded-full border border-neutral-300 bg-white px-4 py-2 text-[11px] font-bold uppercase tracking-[0.18em] text-neutral-900 transition-all duration-300 hover:border-brand hover:text-brand hover:shadow-md motion-safe:hover:-translate-y-0.5"
                    >
                      {label}
                      <span className="h-1.5 w-1.5 rounded-full bg-neutral-900/20" />
                    </a>
                  );
                })}
              </div>
            </Reveal>
          </div>
        </section>

        {sections.map(([label, roles], sectionIndex) => {
          const meta = sectionMeta[label];
          const band =
            sectionIndex % 2 === 0 ? "bg-white" : "bg-gradient-to-b from-[#f6f8ff] to-white";

          const dbForCategory: DbService[] = byCategory.get(label as string) ?? [];
          const dbByTitle = new Map<string, DbService>(
            dbForCategory.map((s: DbService) => [s.title, s])
          );

          const cards: Array<{ title: string; details: ServiceCardDetails }> = [];

          // Preserve the existing role order (so UI stays the same).
          for (const role of roles) {
            const db = dbByTitle.get(role);
            if (db) cards.push({ title: role, details: toServiceCardDetails(db) });
            else cards.push({ title: role, details: roleDetails[role] });
          }

          // Include any extra DB services in that category (not in the CTA list).
          for (const s of dbForCategory) {
            if (dbByTitle.has(s.title) && (roles as readonly string[]).includes(s.title)) continue;
            if ((roles as readonly string[]).includes(s.title)) continue;
            cards.push({ title: s.title, details: toServiceCardDetails(s) });
          }

          return (
            <section
              key={label}
              id={meta.id}
              className={cn(band, "scroll-mt-24 border-b border-neutral-200/70 py-14 md:scroll-mt-28 md:py-20")}
            >
              <div className="mx-auto max-w-[1320px] px-4 md:px-8">
                <Reveal>
                  <div className="mx-auto max-w-3xl text-center">
                    <p
                      className={cn(
                        "mx-auto inline-flex items-center gap-2 rounded-full bg-white px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-neutral-900 ring-1",
                        meta.ring
                      )}
                    >
                      {meta.eyebrow}
                      <span className="h-1.5 w-1.5 rounded-full bg-brand/70" />
                    </p>
                    <h2 className="mt-5 text-3xl font-bold uppercase tracking-tight text-neutral-950 md:text-4xl">
                      {label}
                    </h2>
                    <p className="mt-4 text-base leading-relaxed text-neutral-700 md:text-lg">
                      {meta.intro}
                    </p>
                  </div>
                </Reveal>

                <Reveal delay={0.06}>
                  <div
                    className={cn(
                      "relative mt-10 overflow-hidden rounded-3xl border border-neutral-200 bg-gradient-to-b p-6 md:mt-14 md:p-10",
                      meta.tint
                    )}
                  >
                    <div
                      className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(0,0,0,0.05),transparent)]"
                      aria-hidden
                    />
                    <div className="relative grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
                      {cards.map((card, i) => (
                        <Reveal key={card.title} delay={i * 0.04} y={16}>
                          <ServiceCard
                            title={card.title}
                            details={card.details}
                            id={serviceSlug(card.title)}
                          />
                        </Reveal>
                      ))}
                    </div>
                  </div>
                </Reveal>
              </div>
            </section>
          );
        })}

        <CTAForm className="bg-gradient-to-b from-white to-[#f6f8ff]" />

        <Footer />
      </main>
    </>
  );
}

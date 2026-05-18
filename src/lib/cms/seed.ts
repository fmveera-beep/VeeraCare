import type { CmsIndustry, CmsService, Prisma } from "@prisma/client";

export type SeedServiceInput = Omit<
  Prisma.CmsServiceCreateInput,
  "createdAt" | "updatedAt"
>;
export type SeedIndustryInput = Omit<
  Prisma.CmsIndustryCreateInput,
  "createdAt" | "updatedAt"
>;

export const seedServices: readonly SeedServiceInput[] = [
  {
    title: "Housemaid",
    category: "Domestic & Care",
    description:
      "Trusted domestic support managed for consistency, discretion, and respectful care at home.",
    imageUrl:
      "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1600&q=80",
    imageAlt: "Domestic housekeeping and home care",
    badges: ["Residential", "Managed", "Verified"],
    order: 10,
  },
  {
    title: "Nanny/Babysitter",
    category: "Domestic & Care",
    description:
      "Reliable childcare coverage screened caregivers aligned to your household routines and schedules.",
    imageUrl:
      "https://images.unsplash.com/photo-1651688729724-bafbf0935462?auto=format&fit=crop&w=1600&q=80",
    imageAlt: "Childcare and babysitting",
    badges: ["Childcare", "Flexible hours", "Household fit"],
    order: 20,
  },
  {
    title: "Elderly Caretaker",
    category: "Domestic & Care",
    description:
      "Compassionate assistance for seniors—dependable support with dignity and clear reporting.",
    imageUrl:
      "https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&w=1600&q=80",
    imageAlt: "Senior care and elderly assistance",
    badges: ["Care", "Dependable", "Supervised"],
    order: 30,
  },
  {
    title: "Personal Cook",
    category: "Domestic & Care",
    description:
      "Household and small team cooking—menus, hygiene standards, and predictable meal coverage.",
    imageUrl:
      "https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=1600&q=80",
    imageAlt: "Cook preparing food in a kitchen",
    badges: ["Household", "Hygiene", "Schedules"],
    order: 40,
  },
  {
    title: "Private Driver",
    category: "Domestic & Care",
    description:
      "Professional driving support—punctual chauffeurs screened for safety and professionalism.",
    imageUrl: "/images/services/private-driver.png",
    imageAlt: "Professional driving on the road",
    badges: ["Chauffeur", "Safety", "Discretion"],
    order: 50,
  },
  {
    title: "Deep Cleaning",
    category: "Cleaning & Facilities",
    description:
      "Intensive turnover and detailed cleans—high-touch standards for homes and facility zones.",
    imageUrl: "/images/services/deep-cleaning.png",
    imageAlt: "Deep cleaning of interior spaces",
    badges: ["Turnover", "Detail-oriented", "SLA-ready"],
    order: 60,
  },
  {
    title: "Janitorial Staff",
    category: "Cleaning & Facilities",
    description:
      "Daily facility upkeep and porter-style support—consistent attendance and supervision.",
    imageUrl: "/images/services/janitorial-staff.png",
    imageAlt: "Janitorial cleaning in a facility",
    badges: ["Facilities", "Day/night", "Accountable"],
    order: 70,
  },
  {
    title: "Plumber",
    category: "Cleaning & Facilities",
    description:
      "Onsite plumbing labor and trade-adjacent support under your direction and safety protocols.",
    imageUrl:
      "https://images.unsplash.com/photo-1749532125405-70950966b0e5?auto=format&fit=crop&w=1600&q=80",
    imageAlt: "Plumber repairing pipes and fixtures in a bathroom",
    badges: ["Trades support", "Onsite", "Compliance-aware"],
    order: 80,
  },
  {
    title: "Electrician",
    category: "Cleaning & Facilities",
    description:
      "Electrical support crews screened for credential alignment—dependable coverage for sites and facilities.",
    imageUrl:
      "https://images.unsplash.com/photo-1621905251918-48416bd8575a?auto=format&fit=crop&w=1600&q=80",
    imageAlt: "Electrician working with wiring",
    badges: ["Electrical", "Safety-first", "Experienced"],
    order: 90,
  },
  {
    title: "Gardener/Landscaper",
    category: "Cleaning & Facilities",
    description:
      "Groundskeeping and landscaping labor—seasonal upkeep, curb appeal, and outdoor maintenance.",
    imageUrl:
      "https://images.pexels.com/photos/169523/pexels-photo-169523.jpeg?auto=compress&cs=tinysrgb&w=1600",
    imageAlt: "Landscaping and gardening",
    badges: ["Outdoors", "Seasonal", "Hands-on"],
    order: 100,
  },
  {
    title: "General Laborer",
    category: "Construction",
    description:
      "Site-ready manpower for moving materials, prep work, and general onsite assistance.",
    imageUrl:
      "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1600&q=80",
    imageAlt: "Construction workers on a building site",
    badges: ["Manpower", "Site-ready", "Briefed crews"],
    order: 110,
  },
  {
    title: "Mason",
    category: "Construction",
    description:
      "Masonry support aligned to your foreman—brick/block labor with trades discipline.",
    imageUrl:
      "https://images.pexels.com/photos/8961399/pexels-photo-8961399.jpeg?auto=compress&cs=tinysrgb&w=1600",
    imageAlt: "Brick masonry construction",
    badges: ["Masonry", "Structural", "Worksite"],
    order: 120,
  },
  {
    title: "Carpenter",
    category: "Construction",
    description:
      "Carpentry helpers and skilled woodworkers for fabrication, fit-out, and onsite carpentry tasks.",
    imageUrl:
      "https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=1600&q=80",
    imageAlt: "Carpenter woodworking",
    badges: ["Wood trades", "Fit-out", "Precision"],
    order: 130,
  },
  {
    title: "Painter",
    category: "Construction",
    description:
      "Painting crews for interiors and facades—prep, finish standards, and clean worksite habits.",
    imageUrl: "/images/services/painter.png",
    imageAlt: "Painter applying paint",
    badges: ["Finish quality", "Prep & coat", "Site-safe"],
    order: 140,
  },
  {
    title: "Waitstaff/Catering",
    category: "Events & Hospitality",
    description:
      "Front-of-house and banquet-style service—guest-ready presentation and coordinated teamwork.",
    imageUrl:
      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1600&q=80",
    imageAlt: "Restaurant service and dining",
    badges: ["Hospitality", "Banquets", "Guest-ready"],
    order: 150,
  },
  {
    title: "Bartender",
    category: "Events & Hospitality",
    description:
      "Bar coverage for events and venues—hygiene, pace, and professional guest interaction.",
    imageUrl:
      "https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&w=1600&q=80",
    imageAlt: "Bartender preparing drinks",
    badges: ["Bar service", "Events", "RSA-aligned hire"],
    order: 160,
  },
  {
    title: "Event Setup Crew",
    category: "Events & Hospitality",
    description:
      "Load-in/load-out and staging labor—briefed for your run of show and venue resets.",
    imageUrl: "/images/services/event-staff.png",
    imageAlt: "Event crew setting up a venue",
    badges: ["Staging", "Load-in/out", "Uniform-ready"],
    order: 170,
  },
  {
    title: "General Security Guard",
    category: "Security",
    description:
      "Uniformed presence for sites and facilities—access control, patrols, and incident readiness.",
    imageUrl: "/images/services/general-security-guard.png",
    imageAlt: "Security guard on duty",
    badges: ["Patrols", "Access control", "Professional"],
    order: 180,
  },
  {
    title: "VIP Security",
    category: "Security",
    description:
      "Discreet close-protection staffing—polished presence aligned to premium hospitality.",
    imageUrl: "/images/services/vip-security.png",
    imageAlt: "Corporate building security presence",
    badges: ["VIP-ready", "Discreet", "Executive venues"],
    order: 190,
  },
  {
    title: "Bouncer",
    category: "Security",
    description:
      "Venue door coverage—crowd management support trained for calm, firm professionalism.",
    imageUrl: "/images/services/bouncer.png",
    imageAlt: "Crowd queued outside an entertainment venue at night",
    badges: ["Nightlife", "Crowd aware", "Firm & calm"],
    order: 200,
  },
  {
    title: "Office Boy/Peon",
    category: "Corporate Support",
    description:
      "Office runners and general helpers—mail, pantry support, errands, and light facility tasks.",
    imageUrl: "/images/services/office-boy-peon.png",
    imageAlt: "Modern office workspace",
    badges: ["Corporate", "Support", "Daily ops"],
    order: 210,
  },
  {
    title: "Receptionist",
    category: "Corporate Support",
    description:
      "Front-desk coverage—greetings, visitor coordination, and polished first impressions.",
    imageUrl: "/images/services/receptionist.png",
    imageAlt: "Business reception and front desk",
    badges: ["Front desk", "Scheduling", "Professional tone"],
    order: 220,
  },
  {
    title: "Delivery Courier",
    category: "Corporate Support",
    description:
      "Last-mile support for parcels and documents—route discipline and accountable handoffs.",
    imageUrl:
      "https://images.pexels.com/photos/7706453/pexels-photo-7706453.jpeg?auto=compress&cs=tinysrgb&w=1600",
    imageAlt: "Courier delivering packages",
    badges: ["Last-mile", "Accountable", "Time-sensitive"],
    order: 230,
  },
];

export const seedIndustries: readonly SeedIndustryInput[] = [
  {
    key: "healthcare",
    title: "Healthcare Facilities",
    gradient: "from-brand-navy via-brand to-brand-light",
    iconName: "HeartPulse",
    body:
      "Clinical support, environmental services (EVS), infection prevention aides, and facility maintenance with audit ready workflows.",
    jobs: [
      "Clinical support and patient assistance",
      "EVS / infection prevention aides",
      "Facility maintenance coverage",
      "Supply and transport support",
      "Front desk and visitor coordination",
    ],
    order: 10,
  },
  {
    key: "construction",
    title: "Construction & Manpower",
    gradient: "from-brand-navy via-brand-mid to-brand-light",
    iconName: "HardHat",
    body:
      "Skilled trades support, site helpers, heavy machinery operators, and safety certified labor for building and infrastructure projects.",
    jobs: [
      "Skilled trades support",
      "Site helpers and material handling",
      "Heavy machinery operators",
      "Safety certified labor",
      "Site cleanup and logistics support",
    ],
    order: 20,
  },
  {
    key: "domestic",
    title: "Domestic & Residential Care",
    gradient: "from-brand-navy via-brand to-brand-pale",
    iconName: "Home",
    body:
      "Managed domestic staffing for homes—trusted housemaids and professional cleaners with consistent schedules and quality oversight.",
    jobs: [
      "Housemaids for day-to-day home support",
      "Professional house cleaning and deep cleans",
      "Move-in / move-out cleaning coverage",
      "Supervised teams with checklists",
      "Recurring schedules you can count on",
    ],
    order: 30,
  },
  {
    key: "facilities",
    title: "Facilities & Workplaces",
    gradient: "from-brand via-brand-mid to-brand-pale",
    iconName: "Building2",
    body:
      "Janitorial, day porters, grounds maintenance, and event setup for commercial and corporate spaces.",
    jobs: [
      "Janitorial & day porters",
      "Grounds & light maintenance",
      "Event setup / swing shift coverage",
      "Supervisors & quality spotchecks",
      "Porters and move support",
    ],
    order: 40,
  },
];

export function toServiceCardDetails(s: CmsService): {
  description: string;
  image: string;
  fallbackImage: string;
  imageAlt: string;
  badges: readonly string[];
} {
  const badges =
    Array.isArray((s.badges as any) ?? null) ? ((s.badges as any) as string[]) : [];
  return {
    description: s.description,
    image: s.imageUrl,
    fallbackImage: s.imageUrl,
    imageAlt: s.imageAlt || s.title,
    badges: badges.length ? badges : ["Managed", "Verified"],
  };
}


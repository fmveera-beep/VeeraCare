export type JobSection = {
  heading?: string;
  paragraphs: string[];
};

export type JobPost = {
  slug: string;
  title: string;
  excerpt: string;
  metaDescription: string;
  category: string;
  location: string;
  employmentType: string;
  salaryRange: string | null;
  heroImage: string | null;
  heroImageAlt: string | null;
  sections: JobSection[];
  requirements: string[];
  benefits: string[];
  publishedAt: string;
};

export const jobCategoryOptions = [
  "Security",
  "Cleaning",
  "Housekeeping",
  "Driving",
  "IT & Telecommunication",
  "Sales & Marketing",
  "Support Service",
  "Accounting",
  "Commercial",
  "Facilities",
] as const;

export const jobLocationOptions = [
  "Dubai",
  "Abu Dhabi",
  "Sharjah",
  "Ajman",
  "Masafi",
  "Other UAE",
] as const;

export const jobEmploymentTypeOptions = [
  "Full-time",
  "Part-time",
  "Contract",
] as const;

const defaultHero =
  "https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1200&q=80";

export const jobPosts: JobPost[] = [
  {
    slug: "security-supervisor-masafi",
    title: "Security Supervisor",
    excerpt:
      "Lead a team of security guards at Masafi sites. Oversee daily operations, ensure safety protocols are followed, and coordinate with client management.",
    metaDescription:
      "Security Supervisor role in Masafi with VeeraFM. Lead guard teams, enforce safety protocols, and earn AED 4,000/month with benefits.",
    category: "Security",
    location: "Masafi",
    employmentType: "Full-time",
    salaryRange: "AED 4,000",
    heroImage: defaultHero,
    heroImageAlt: "Security supervisor on duty",
    publishedAt: "2026-06-01",
    requirements: [
      "Minimum 3 years security experience",
      "Valid SIRA certificate preferred",
      "Strong leadership and communication skills",
      "Ability to work rotating shifts",
      "Clean background check required",
    ],
    benefits: [
      "Competitive salary AED 4,000",
      "Accommodation provided",
      "Medical insurance",
      "30 days annual leave",
      "Air ticket allowance",
    ],
    sections: [
      {
        paragraphs: [
          "As Security Supervisor you will manage a team of guards across assigned Masafi locations. You are responsible for shift briefings, incident reporting, and ensuring all post orders and client SOPs are followed.",
        ],
      },
    ],
  },
  {
    slug: "sira-security-guard-dubai",
    title: "SIRA Security Guard",
    excerpt:
      "Licensed SIRA security guard roles across commercial and residential sites in Dubai. Steady shifts, clear reporting lines, and competitive monthly packages.",
    metaDescription:
      "Apply for SIRA Security Guard positions in Dubai with VeeraFM. Full-time onsite security roles with structured supervision and transparent pay.",
    category: "Security",
    location: "Dubai",
    employmentType: "Full-time",
    salaryRange: "AED 2,200",
    heroImage: defaultHero,
    heroImageAlt: "Security professional on duty",
    publishedAt: "2026-05-01",
    requirements: [
      "Valid SIRA license (or eligibility to obtain)",
      "Minimum 1 year security experience in UAE preferred",
      "Good communication in English; Hindi/Urdu a plus",
      "Physically fit for standing and patrol duties",
    ],
    benefits: [],
    sections: [
      {
        paragraphs: [
          "VeeraFM is recruiting SIRA-licensed security guards for client sites across Dubai. You will work as part of a supervised team with defined post orders, attendance discipline, and replacement coverage when routes change.",
        ],
      },
      {
        heading: "What you will do",
        paragraphs: [
          "Access control, patrols, incident reporting, and coordination with site supervisors. Shifts follow client schedules with overtime where applicable and documented.",
        ],
      },
    ],
  },
  {
    slug: "psbd-security-guard-dubai",
    title: "PSBD Security Guard",
    excerpt:
      "PSBD-certified guards for high-traffic commercial environments. Join a managed workforce with onboarding support and reliable scheduling.",
    metaDescription:
      "PSBD Security Guard openings in Dubai through VeeraFM. Join our managed security workforce with clear standards and site supervision.",
    category: "Security",
    location: "Dubai",
    employmentType: "Full-time",
    salaryRange: "AED 2,000",
    heroImage: defaultHero,
    heroImageAlt: "Security team at commercial building",
    publishedAt: "2026-04-28",
    requirements: [
      "Valid PSBD certification",
      "Experience in mall, warehouse, or tower security",
      "Professional appearance and punctual attendance",
    ],
    benefits: [],
    sections: [
      {
        paragraphs: [
          "We deploy PSBD guards to retail, logistics, and mixed-use properties. Supervisors provide daily briefings, escalation paths, and quality checks aligned to client SLAs.",
        ],
      },
    ],
  },
  {
    slug: "security-supervisor-masafi",
    title: "Security Supervisor",
    excerpt:
      "Lead a small guard team at a Masafi site. Supervisory experience required—roster management, handovers, and client liaison.",
    metaDescription:
      "Security Supervisor role in Masafi with VeeraFM. Lead onsite guards with accountability for attendance, reporting, and client standards.",
    category: "Security",
    location: "Masafi",
    employmentType: "Full-time",
    salaryRange: "AED 4,000",
    heroImage: defaultHero,
    heroImageAlt: "Security supervisor briefing team",
    publishedAt: "2026-04-20",
    requirements: [
      "Minimum 3 years security experience",
      "Valid SIRA certificate preferred",
      "Strong leadership and communication skills",
      "Ability to work rotating shifts",
      "Clean background check required",
    ],
    benefits: [
      "Competitive salary AED 4,000",
      "Accommodation provided",
      "Medical insurance",
      "30 days annual leave",
      "Air ticket allowance",
    ],
    sections: [
      {
        paragraphs: [
          "Supervisors are the operational anchor on site: you coordinate guards, verify post coverage, and communicate with VeeraFM operations and the client representative.",
        ],
      },
    ],
  },
  {
    slug: "hotel-housekeeping-staff-dubai",
    title: "Hotel Housekeeping Staff",
    excerpt:
      "Housekeeping roles for hospitality properties in Dubai. Room turnover, public-area standards, and team-based shift work.",
    metaDescription:
      "Hotel housekeeping jobs in Dubai with VeeraFM. Join supervised hospitality cleaning teams with steady schedules.",
    category: "Housekeeping",
    location: "Dubai",
    employmentType: "Full-time",
    salaryRange: "AED 2,000",
    heroImage:
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80",
    heroImageAlt: "Hotel housekeeping professional",
    publishedAt: "2026-04-15",
    requirements: [
      "Prior housekeeping or hospitality cleaning experience",
      "Attention to detail and ability to follow checklist standards",
      "Available for morning or evening shifts as rostered",
    ],
    benefits: [],
    sections: [
      {
        paragraphs: [
          "Housekeeping teams work to property-specific standards with supervisors on floor. VeeraFM handles deployment, attendance tracking, and replacement coverage.",
        ],
      },
    ],
  },
  {
    slug: "cleaners-male-female-sharjah",
    title: "Cleaners (Male & Female)",
    excerpt:
      "Janitorial and cleaning staff for commercial and residential contracts in Sharjah. Male and female teams as required by site.",
    metaDescription:
      "Cleaner jobs in Sharjah—male and female roles via VeeraFM. Commercial and residential janitorial placements with supervised teams.",
    category: "Cleaning",
    location: "Sharjah",
    employmentType: "Full-time",
    salaryRange: "AED 1,500 – 2,000",
    heroImage:
      "https://images.unsplash.com/photo-1581578731544-c64695cc6952?auto=format&fit=crop&w=1200&q=80",
    heroImageAlt: "Professional cleaning staff",
    publishedAt: "2026-04-10",
    requirements: [
      "Experience in janitorial or facilities cleaning",
      "Ability to use basic cleaning equipment safely",
      "Reliable attendance and teamwork",
    ],
    benefits: [],
    sections: [
      {
        paragraphs: [
          "Cleaners are assigned to mapped zones with approved products and PPE. Supervisors conduct spot checks and sign-off logs for client visibility.",
        ],
      },
    ],
  },
  {
    slug: "light-vehicle-driver-abu-dhabi",
    title: "Light Vehicle Driver (UAE License)",
    excerpt:
      "Light vehicle drivers with valid UAE license for Abu Dhabi routes. Professional presentation and route discipline required.",
    metaDescription:
      "Light vehicle driver jobs in Abu Dhabi with VeeraFM. UAE license required for supervised driving assignments.",
    category: "Driving",
    location: "Abu Dhabi",
    employmentType: "Full-time",
    salaryRange: "AED 3,000",
    heroImage:
      "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&w=1200&q=80",
    heroImageAlt: "Professional driver",
    publishedAt: "2026-04-05",
    requirements: [
      "Valid UAE light vehicle driving license",
      "Clean driving record",
      "Familiarity with Abu Dhabi routes",
      "Basic English communication",
    ],
    benefits: [],
    sections: [
      {
        paragraphs: [
          "Drivers support client logistics and staff transport under defined routes and safety policies. Attendance and vehicle handover procedures are documented daily.",
        ],
      },
    ],
  },
];

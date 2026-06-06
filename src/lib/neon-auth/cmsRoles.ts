import { parseAdminEmailList } from "@/lib/neon-auth/adminEmails";

export type CmsRole = "admin" | "hr" | "leads";

function stripQuotes(s: string) {
  return s.replace(/^\ufeff/, "").replace(/^["']|["']$/g, "").trim();
}

function splitEmails(csv: string): string[] {
  return csv
    .split(",")
    .map((s) => stripQuotes(s.trim()).toLowerCase())
    .filter(Boolean);
}

/**
 * Comma-separated HR users (view jobs + applications only).
 * Used only for initial DB seed when no CMS users exist yet.
 */
export const SOURCE_HR_EMAILS = "";

/**
 * Comma-separated Leads users (view contact form leads only).
 * Used only for initial DB seed when no CMS users exist yet.
 */
export const SOURCE_LEADS_EMAILS = "";

export function parseHrEmailList(): string[] {
  const merged: string[] = [];
  if (SOURCE_HR_EMAILS.trim()) {
    merged.push(...splitEmails(SOURCE_HR_EMAILS));
  }
  if (process.env.HR_EMAIL?.trim()) {
    merged.push(...splitEmails(process.env.HR_EMAIL));
  }
  return Array.from(new Set(merged));
}

export function parseLeadsEmailList(): string[] {
  const merged: string[] = [];
  if (SOURCE_LEADS_EMAILS.trim()) {
    merged.push(...splitEmails(SOURCE_LEADS_EMAILS));
  }
  if (process.env.LEADS_EMAIL?.trim()) {
    merged.push(...splitEmails(process.env.LEADS_EMAIL));
  }
  return Array.from(new Set(merged));
}

/** @deprecated Use listAllowedLoginEmails() from lib/cms/users — env lists seed DB only. */
export function parseAllowedLoginEmailList(): string[] {
  return Array.from(
    new Set([...parseAdminEmailList(), ...parseHrEmailList(), ...parseLeadsEmailList()])
  );
}

export function roleLabel(role: CmsRole): string {
  switch (role) {
    case "admin":
      return "Admin";
    case "hr":
      return "HR";
    case "leads":
      return "Leads";
  }
}

export function roleDescription(role: CmsRole): string {
  switch (role) {
    case "admin":
      return "Full CMS access — manage all content, users, and settings.";
    case "hr":
      return "View job openings and careers applications (no editing).";
    case "leads":
      return "View contact form leads only (no editing).";
  }
}

export const CMS_ROLE_OPTIONS: { value: CmsRole; label: string }[] = [
  { value: "admin", label: "Admin" },
  { value: "hr", label: "HR" },
  { value: "leads", label: "Leads" },
];

const HR_ALLOWED_PREFIXES = [
  "/admin/dashboard/jobs",
  "/admin/dashboard/job-applications",
] as const;

const LEADS_ALLOWED_PREFIXES = ["/admin/dashboard/leads"] as const;

export function canAccessDashboardPath(role: CmsRole, pathname: string): boolean {
  if (role === "admin") return true;
  if (pathname === "/admin/dashboard") return true;
  if (role === "hr") {
    return HR_ALLOWED_PREFIXES.some((prefix) => pathname.startsWith(prefix));
  }
  if (role === "leads") {
    return LEADS_ALLOWED_PREFIXES.some((prefix) => pathname.startsWith(prefix));
  }
  return false;
}

export function canAccessLeads(role: CmsRole): boolean {
  return role === "admin" || role === "leads";
}

export function canAccessJobs(role: CmsRole): boolean {
  return role === "admin" || role === "hr";
}

export function canWriteCms(role: CmsRole): boolean {
  return role === "admin";
}

export function sidebarNavForRole(role: CmsRole) {
  const all = [
    {
      href: "/admin/dashboard",
      label: "Dashboard Home",
      roles: ["admin", "hr", "leads"] as CmsRole[],
    },
    { href: "/admin/dashboard/leads", label: "Leads", roles: ["admin", "leads"] as CmsRole[] },
    { href: "/admin/dashboard/services", label: "Manage Services", roles: ["admin"] as CmsRole[] },
    {
      href: "/admin/dashboard/industries",
      label: "Manage Industries",
      roles: ["admin"] as CmsRole[],
    },
    { href: "/admin/dashboard/insights", label: "Manage Insights", roles: ["admin"] as CmsRole[] },
    { href: "/admin/dashboard/jobs", label: "Manage Jobs", roles: ["admin", "hr"] as CmsRole[] },
    {
      href: "/admin/dashboard/job-applications",
      label: "Job Applications",
      roles: ["admin", "hr"] as CmsRole[],
    },
    { href: "/admin/dashboard/users", label: "Manage Users", roles: ["admin"] as CmsRole[] },
    { href: "/admin/dashboard/settings", label: "Settings", roles: ["admin"] as CmsRole[] },
  ] as const;

  return all.filter((item) => item.roles.includes(role));
}

export function dashboardCardsForRole(role: CmsRole) {
  const all = [
    {
      href: "/admin/dashboard/leads",
      title: "Leads",
      description: "View hiring and worker inquiries from the contact form.",
      roles: ["admin", "leads"] as CmsRole[],
    },
    {
      href: "/admin/dashboard/services",
      title: "Manage Services",
      description: "Add, edit, or remove service cards shown on the website.",
      roles: ["admin"] as CmsRole[],
    },
    {
      href: "/admin/dashboard/industries",
      title: "Manage Industries",
      description: "Update industry categories used across the homepage.",
      roles: ["admin"] as CmsRole[],
    },
    {
      href: "/admin/dashboard/insights",
      title: "Manage Insights",
      description: "Publish and edit blog articles on /insights and the homepage preview.",
      roles: ["admin"] as CmsRole[],
    },
    {
      href: "/admin/dashboard/jobs",
      title: "Manage Jobs",
      description: "Add and publish job openings on the /careers portal.",
      roles: ["admin", "hr"] as CmsRole[],
    },
    {
      href: "/admin/dashboard/job-applications",
      title: "Job Applications",
      description: "Review careers form submissions and download uploaded CVs.",
      roles: ["admin", "hr"] as CmsRole[],
    },
    {
      href: "/admin/dashboard/users",
      title: "Manage Users",
      description: "Assign admin, HR, or Leads roles to CMS login emails.",
      roles: ["admin"] as CmsRole[],
    },
  ] as const;

  return all.filter((item) => item.roles.includes(role));
}

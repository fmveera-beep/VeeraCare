import { parseAdminEmailList } from "@/lib/neon-auth/adminEmails";

export type CmsRole = "admin" | "hr";

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
 * Merged with `process.env.HR_EMAIL` on the server.
 */
export const SOURCE_HR_EMAILS = "";

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

export function parseAllowedLoginEmailList(): string[] {
  return Array.from(new Set([...parseAdminEmailList(), ...parseHrEmailList()]));
}

export function getCmsRole(email: string): CmsRole | null {
  const normalized = email.trim().toLowerCase();
  if (parseAdminEmailList().includes(normalized)) return "admin";
  if (parseHrEmailList().includes(normalized)) return "hr";
  return null;
}

export function isAllowedCmsEmail(email: string): boolean {
  return getCmsRole(email) !== null;
}

const HR_ALLOWED_PREFIXES = [
  "/admin/dashboard/jobs",
  "/admin/dashboard/job-applications",
] as const;

export function canAccessDashboardPath(role: CmsRole, pathname: string): boolean {
  if (role === "admin") return true;
  if (pathname === "/admin/dashboard") return true;
  return HR_ALLOWED_PREFIXES.some((prefix) => pathname.startsWith(prefix));
}

export function canWriteCms(role: CmsRole): boolean {
  return role === "admin";
}

export function sidebarNavForRole(role: CmsRole) {
  const all = [
    { href: "/admin/dashboard", label: "Dashboard Home", roles: ["admin", "hr"] as CmsRole[] },
    { href: "/admin/dashboard/leads", label: "Leads", roles: ["admin"] as CmsRole[] },
    { href: "/admin/dashboard/services", label: "Manage Services", roles: ["admin"] as CmsRole[] },
    { href: "/admin/dashboard/industries", label: "Manage Industries", roles: ["admin"] as CmsRole[] },
    { href: "/admin/dashboard/insights", label: "Manage Insights", roles: ["admin"] as CmsRole[] },
    { href: "/admin/dashboard/jobs", label: "Manage Jobs", roles: ["admin", "hr"] as CmsRole[] },
    {
      href: "/admin/dashboard/job-applications",
      label: "Job Applications",
      roles: ["admin", "hr"] as CmsRole[],
    },
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
      roles: ["admin"] as CmsRole[],
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
  ] as const;

  return all.filter((item) => item.roles.includes(role));
}

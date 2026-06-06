import type { ReactNode } from "react";
import { requireCmsRole } from "@/lib/neon-auth/requireCmsPage";

export default async function JobApplicationsLayout({ children }: { children: ReactNode }) {
  await requireCmsRole(["admin", "hr"]);
  return children;
}

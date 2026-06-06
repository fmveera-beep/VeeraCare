import type { ReactNode } from "react";
import { requireCmsRole } from "@/lib/neon-auth/requireCmsPage";

export default async function UsersLayout({ children }: { children: ReactNode }) {
  await requireCmsRole("admin");
  return children;
}

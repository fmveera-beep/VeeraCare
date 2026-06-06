import { redirect } from "next/navigation";
import type { CmsRole } from "@/lib/neon-auth/cmsRoles";
import { canAccessDashboardPath, getCmsRole } from "@/lib/neon-auth/cmsRoles";
import { getNeonSessionEmail } from "@/lib/neon-auth/readNeonSessionEmail";
import { tryGetNeonAuth } from "@/lib/neon-auth/server";

export async function getCmsSession(): Promise<
  { email: string; role: CmsRole } | null
> {
  const auth = tryGetNeonAuth();
  if (!auth) return null;

  const { email } = await getNeonSessionEmail(auth);
  if (!email) return null;

  const role = getCmsRole(email);
  if (!role) return null;

  return { email, role };
}

export async function requireCmsRole(allowed: CmsRole | CmsRole[]) {
  const allowedRoles = Array.isArray(allowed) ? allowed : [allowed];
  const session = await getCmsSession();

  if (!session) redirect("/admin/login");
  if (!allowedRoles.includes(session.role)) redirect("/admin/dashboard?error=forbidden");
}

export async function requireDashboardPath(pathname: string) {
  const session = await getCmsSession();
  if (!session) redirect("/admin/login");
  if (!canAccessDashboardPath(session.role, pathname)) {
    redirect("/admin/dashboard?error=forbidden");
  }
}

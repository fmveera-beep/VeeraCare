import type { CmsRole } from "@/lib/neon-auth/cmsRoles";
import { resolveCmsRole } from "@/lib/cms/users";
import { getNeonSessionEmail } from "@/lib/neon-auth/readNeonSessionEmail";
import { tryGetNeonAuth } from "@/lib/neon-auth/server";

export type CmsAuthSession = {
  email: string;
  role: CmsRole;
};

export async function getCmsAuthSession(): Promise<CmsAuthSession | null> {
  const auth = tryGetNeonAuth();
  if (!auth) return null;

  const { email } = await getNeonSessionEmail(auth);
  if (!email) return null;

  const role = await resolveCmsRole(email);
  if (!role) return null;

  return { email, role };
}

/** Any signed-in CMS user. */
export async function assertCmsAccess(): Promise<CmsAuthSession | null> {
  return getCmsAuthSession();
}

/** Full CMS admin only (read + write). */
export async function assertAdmin(): Promise<CmsAuthSession | null> {
  const session = await getCmsAuthSession();
  if (!session || session.role !== "admin") return null;
  return session;
}

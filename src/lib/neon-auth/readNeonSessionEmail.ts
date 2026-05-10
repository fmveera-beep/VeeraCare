import type { tryGetNeonAuth } from "@/lib/neon-auth/server";
import { emailFromNeonAuthSession } from "@/lib/neon-auth/sessionEmail";

type NeonAuth = NonNullable<ReturnType<typeof tryGetNeonAuth>>;

/**
 * Reads session email from Neon Auth. When cookie-cache omits user/email,
 * retries once without cookie cache so the upstream session maps reliably.
 */
export async function getNeonSessionEmail(auth: NeonAuth): Promise<{
  email: string | null;
  error: unknown | null;
}> {
  let { data, error } = await auth.getSession();
  if (error) return { email: null, error };

  let email = emailFromNeonAuthSession(data);
  if (email) return { email, error: null };

  const refreshed = await auth.getSession({
    query: { disableCookieCache: "true" },
  } as Parameters<NeonAuth["getSession"]>[0]);

  if (refreshed.error) return { email: null, error: refreshed.error };

  email = emailFromNeonAuthSession(refreshed.data);
  return { email, error: null };
}

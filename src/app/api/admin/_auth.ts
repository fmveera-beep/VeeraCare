import { isAllowedAdminEmail } from "@/lib/neon-auth/adminEmails";
import { getNeonSessionEmail } from "@/lib/neon-auth/readNeonSessionEmail";
import { tryGetNeonAuth } from "@/lib/neon-auth/server";

export async function assertAdmin(): Promise<boolean> {
  const auth = tryGetNeonAuth();
  if (!auth) return false;

  const { email } = await getNeonSessionEmail(auth);
  if (!email) return false;

  return isAllowedAdminEmail(email);
}

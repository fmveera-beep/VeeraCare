/**
 * Neon Auth `getSession()` returns different shapes:
 * - Cookie-cached payload: `{ session, user }` with email on `user.email`
 * - Fresh/upstream mapped session: `{ session: { user, … } }` (nested user)
 */
export function emailFromNeonAuthSession(data: unknown): string | null {
  if (!data || typeof data !== "object") return null;
  const d = data as Record<string, unknown>;

  const topUser = d.user;
  if (topUser && typeof topUser === "object") {
    const email = (topUser as { email?: unknown }).email;
    if (typeof email === "string" && email.trim()) {
      return email.trim().toLowerCase();
    }
  }

  const session = d.session;
  if (session && typeof session === "object") {
    const nestedUser = (session as { user?: unknown }).user;
    if (nestedUser && typeof nestedUser === "object") {
      const email = (nestedUser as { email?: unknown }).email;
      if (typeof email === "string" && email.trim()) {
        return email.trim().toLowerCase();
      }
    }
  }

  return null;
}

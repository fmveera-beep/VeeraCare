import { NextResponse } from "next/server";
import type { AdminMeReason } from "@/lib/neon-auth/adminMeReason";
import { getCmsRole, isAllowedCmsEmail } from "@/lib/neon-auth/cmsRoles";
import { getNeonSessionEmail } from "@/lib/neon-auth/readNeonSessionEmail";
import { tryGetNeonAuth } from "@/lib/neon-auth/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const auth = tryGetNeonAuth();
  if (!auth) {
    return NextResponse.json(
      { ok: false as const, reason: "auth_config" as AdminMeReason },
      { status: 503 }
    );
  }

  const { email, error } = await getNeonSessionEmail(auth);

  if (error || !email) {
    return NextResponse.json(
      { ok: false as const, reason: "no_session" as AdminMeReason },
      { status: 401 }
    );
  }

  if (!isAllowedCmsEmail(email)) {
    return NextResponse.json(
      { ok: false as const, reason: "not_allowlisted" as AdminMeReason },
      { status: 403 }
    );
  }

  const role = getCmsRole(email)!;

  return NextResponse.json({
    ok: true as const,
    role,
    email,
    canWrite: role === "admin",
  });
}

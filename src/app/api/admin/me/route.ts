import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import type { AdminMeReason } from "@/lib/neon-auth/adminMeReason";
import { canDeleteLeads, canWriteCms, canWriteJobs } from "@/lib/neon-auth/cmsRoles";
import { resolveCmsRole } from "@/lib/cms/users";
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

  const role = await resolveCmsRole(email);
  if (!role) {
    return NextResponse.json(
      { ok: false as const, reason: "not_allowlisted" as AdminMeReason },
      { status: 403 }
    );
  }

  return NextResponse.json({
    ok: true as const,
    role,
    email,
    canWrite: canWriteCms(role),
    canWriteJobs: canWriteJobs(role),
    canDeleteLeads: canDeleteLeads(role),
  });
}

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { assertAdmin } from "@/app/api/admin/_auth";
import type { CmsRole } from "@/lib/neon-auth/cmsRoles";
import {
  createCmsUser,
  deleteCmsUser,
  listCmsUsers,
  updateCmsUserRole,
} from "@/lib/cms/users";

function parseRole(raw: unknown): CmsRole | null {
  if (raw === "admin" || raw === "hr" || raw === "leads") return raw;
  return null;
}

export async function GET() {
  if (!(await assertAdmin()))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const items = await listCmsUsers();
    return NextResponse.json({ items, total: items.length });
  } catch (e) {
    console.error("[admin/cms-users GET]", e);
    const msg = e instanceof Error ? e.message : "Database error";
    return NextResponse.json({ error: msg }, { status: 503 });
  }
}

export async function POST(req: NextRequest) {
  if (!(await assertAdmin()))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = (await req.json()) as { email?: string; role?: unknown };
    const email = String(body.email ?? "").trim();
    const role = parseRole(body.role);
    if (!email || !role) {
      return NextResponse.json({ error: "Email and role are required." }, { status: 400 });
    }

    const item = await createCmsUser(email, role);
    return NextResponse.json({ item });
  } catch (e) {
    console.error("[admin/cms-users POST]", e);
    const msg = e instanceof Error ? e.message : "Could not add user.";
    const status = msg.includes("Unique constraint") ? 409 : 400;
    return NextResponse.json({ error: msg }, { status });
  }
}

export async function PUT(req: NextRequest) {
  if (!(await assertAdmin()))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = (await req.json()) as { id?: string; role?: unknown };
    const id = String(body.id ?? "").trim();
    const role = parseRole(body.role);
    if (!id || !role) {
      return NextResponse.json({ error: "User id and role are required." }, { status: 400 });
    }

    const item = await updateCmsUserRole(id, role);
    return NextResponse.json({ item });
  } catch (e) {
    console.error("[admin/cms-users PUT]", e);
    const msg = e instanceof Error ? e.message : "Could not update user.";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest) {
  if (!(await assertAdmin()))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const id = new URL(req.url).searchParams.get("id")?.trim();
  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  try {
    await deleteCmsUser(id);
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[admin/cms-users DELETE]", e);
    const msg = e instanceof Error ? e.message : "Could not remove user.";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}

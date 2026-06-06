import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { assertCmsAccess, assertLeadsDelete } from "@/app/api/admin/_auth";
import { canAccessLeads } from "@/lib/neon-auth/cmsRoles";
import {
  inquiryTypeLabel,
  serviceNeededLabel,
} from "@/lib/cms/staffRequestLabels";

function serializeLead(row: Awaited<ReturnType<typeof prisma.staffRequest.findMany>>[number]) {
  return {
    id: row.id,
    inquiryType: row.inquiryType,
    inquiryLabel: inquiryTypeLabel(row.inquiryType),
    name: row.name,
    phone: row.phone,
    email: row.email,
    serviceNeeded: serviceNeededLabel(row.serviceNeeded),
    availability: row.availability,
    message: row.message,
    sourcePath: row.sourcePath,
    createdAt: row.createdAt.toISOString(),
  };
}

export async function GET() {
  const session = await assertCmsAccess();
  if (!session || !canAccessLeads(session.role))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const rows = await prisma.staffRequest.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({
      items: rows.map(serializeLead),
      total: rows.length,
    });
  } catch (e) {
    console.error("[admin/leads GET]", e);
    const msg = e instanceof Error ? e.message : "Database error";
    return NextResponse.json({ error: msg }, { status: 503 });
  }
}

export async function DELETE(req: NextRequest) {
  if (!(await assertLeadsDelete())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const id = new URL(req.url).searchParams.get("id")?.trim();
  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  try {
    await prisma.staffRequest.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[admin/leads DELETE]", e);
    const msg = e instanceof Error ? e.message : "Delete failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

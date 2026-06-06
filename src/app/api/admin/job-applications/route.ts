import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { assertAdmin, assertCmsAccess } from "@/app/api/admin/_auth";

function serialize(row: {
  id: string;
  jobSlug: string;
  jobTitle: string;
  name: string;
  email: string;
  phone: string;
  message: string | null;
  cvUrl: string | null;
  cvFileName: string | null;
  sourcePath: string | null;
  createdAt: Date;
}) {
  return {
    id: row.id,
    jobSlug: row.jobSlug,
    jobTitle: row.jobTitle,
    name: row.name,
    email: row.email,
    phone: row.phone,
    message: row.message,
    cvUrl: row.cvUrl,
    cvFileName: row.cvFileName,
    sourcePath: row.sourcePath,
    createdAt: row.createdAt.toISOString(),
  };
}

export async function GET() {
  if (!(await assertCmsAccess()))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const rows = await prisma.jobApplication.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({
      items: rows.map(serialize),
      total: rows.length,
    });
  } catch (e) {
    console.error("[admin/job-applications GET]", e);
    const msg = e instanceof Error ? e.message : "Database error";
    return NextResponse.json({ error: msg }, { status: 503 });
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
    await prisma.jobApplication.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[admin/job-applications DELETE]", e);
    const msg = e instanceof Error ? e.message : "Delete failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

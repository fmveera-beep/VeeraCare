import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { assertAdmin } from "@/app/api/admin/_auth";
import { rowToCmsJobRecord, seedJobCreateData } from "@/lib/jobs/cms";

function parseBody(input: {
  slug?: string;
  title?: string;
  excerpt?: string;
  metaDescription?: string;
  category?: string;
  location?: string;
  employmentType?: string;
  salaryRange?: string | null;
  heroImage?: string | null;
  heroImageAlt?: string | null;
  sections?: unknown;
  requirements?: unknown;
  benefits?: unknown;
  published?: boolean;
  publishedAt?: string;
  order?: number;
}) {
  const slug = String(input.slug ?? "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  const title = String(input.title ?? "").trim();
  const excerpt = String(input.excerpt ?? "").trim();
  const metaDescription = String(input.metaDescription ?? "").trim();
  const category = String(input.category ?? "").trim();
  const location = String(input.location ?? "").trim();
  const employmentType = String(input.employmentType ?? "Full-time").trim() || "Full-time";
  const salaryRange = input.salaryRange?.trim() || null;
  const publishedAt = input.publishedAt ? new Date(input.publishedAt) : new Date();
  const order = Number.isFinite(input.order) ? (input.order as number) : 0;
  const published = input.published !== false;
  const sections = Array.isArray(input.sections) ? input.sections : [];
  const requirements = Array.isArray(input.requirements) ? input.requirements : [];
  const benefits = Array.isArray(input.benefits) ? input.benefits : [];

  if (!slug || !title || !excerpt || !metaDescription || !category || !location) {
    return { error: "Missing required fields" as const };
  }
  if (!Array.isArray(sections) || sections.length === 0) {
    return { error: "At least one content section is required" as const };
  }

  return {
    data: {
      slug,
      title,
      excerpt,
      metaDescription,
      category,
      location,
      employmentType,
      salaryRange,
      heroImage: input.heroImage?.trim() || null,
      heroImageAlt: input.heroImageAlt?.trim() || null,
      sections: sections as object,
      requirements: requirements as object,
      benefits: benefits as object,
      published,
      publishedAt,
      order,
    },
  };
}

async function ensureSeeded() {
  const count = await prisma.cmsJob.count();
  if (count > 0) return;
  await prisma.cmsJob.createMany({ data: seedJobCreateData() });
}

export async function GET() {
  if (!(await assertAdmin()))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    await ensureSeeded();
    const items = await prisma.cmsJob.findMany({
      orderBy: [{ order: "asc" }, { publishedAt: "desc" }],
    });
    return NextResponse.json({
      items: items.map(rowToCmsJobRecord),
    });
  } catch (e) {
    console.error("[admin/jobs GET]", e);
    const msg = e instanceof Error ? e.message : "Database error";
    return NextResponse.json({ error: msg }, { status: 503 });
  }
}

export async function POST(req: NextRequest) {
  if (!(await assertAdmin()))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  if (searchParams.get("reset") === "1") {
    await prisma.cmsJob.deleteMany();
    await prisma.cmsJob.createMany({ data: seedJobCreateData() });
    const items = await prisma.cmsJob.findMany({
      orderBy: [{ order: "asc" }, { publishedAt: "desc" }],
    });
    return NextResponse.json({ items: items.map(rowToCmsJobRecord) });
  }

  const body = await req.json();
  const parsed = parseBody(body);
  if ("error" in parsed) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  try {
    const created = await prisma.cmsJob.create({ data: parsed.data });
    return NextResponse.json({ item: rowToCmsJobRecord(created) });
  } catch (e) {
    console.error("[admin/jobs POST]", e);
    const msg = e instanceof Error ? e.message : "Create failed";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}

export async function PUT(req: NextRequest) {
  if (!(await assertAdmin()))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const id = String((body as { id?: string }).id ?? "").trim();
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const parsed = parseBody(body as Parameters<typeof parseBody>[0]);
  if ("error" in parsed) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  try {
    const updated = await prisma.cmsJob.update({
      where: { id },
      data: parsed.data,
    });
    return NextResponse.json({ item: rowToCmsJobRecord(updated) });
  } catch (e) {
    console.error("[admin/jobs PUT]", e);
    const msg = e instanceof Error ? e.message : "Update failed";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest) {
  if (!(await assertAdmin()))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  await prisma.cmsJob.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { assertAdmin } from "@/app/api/admin/_auth";
import {
  rowToCmsInsightRecord,
  seedInsightCreateData,
} from "@/lib/insights/cms";

function parseBody(input: {
  slug?: string;
  title?: string;
  excerpt?: string;
  metaDescription?: string;
  publishedAt?: string;
  readTimeMinutes?: number;
  category?: string;
  heroImage?: string;
  heroImageAlt?: string | null;
  author?: string;
  sections?: unknown;
  published?: boolean;
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
  const heroImage = String(input.heroImage ?? "").trim();
  const author = String(input.author ?? "VeeraCare Insights").trim();
  const publishedAt = input.publishedAt
    ? new Date(input.publishedAt)
    : new Date();
  const readTimeMinutes = Number.isFinite(input.readTimeMinutes)
    ? Math.max(1, Math.round(input.readTimeMinutes as number))
    : 5;
  const order = Number.isFinite(input.order) ? (input.order as number) : 0;
  const published = input.published !== false;
  const sections = Array.isArray(input.sections) ? input.sections : [];

  if (!slug || !title || !excerpt || !metaDescription || !category || !heroImage) {
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
      publishedAt,
      readTimeMinutes,
      category,
      heroImage,
      heroImageAlt: input.heroImageAlt?.trim() || null,
      author: author || "VeeraCare Insights",
      sections: sections as object,
      published,
      order,
    },
  };
}

async function ensureSeeded() {
  const count = await prisma.cmsInsight.count();
  if (count > 0) return;
  await prisma.cmsInsight.createMany({ data: seedInsightCreateData() });
}

export async function GET() {
  if (!(await assertAdmin()))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    await ensureSeeded();
    const items = await prisma.cmsInsight.findMany({
      orderBy: [{ order: "asc" }, { publishedAt: "desc" }],
    });
    return NextResponse.json({
      items: items.map(rowToCmsInsightRecord),
    });
  } catch (e) {
    console.error("[admin/insights GET]", e);
    const msg = e instanceof Error ? e.message : "Database error";
    return NextResponse.json({ error: msg }, { status: 503 });
  }
}

export async function POST(req: NextRequest) {
  if (!(await assertAdmin()))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  if (searchParams.get("reset") === "1") {
    await prisma.cmsInsight.deleteMany();
    await prisma.cmsInsight.createMany({ data: seedInsightCreateData() });
    const items = await prisma.cmsInsight.findMany({
      orderBy: [{ order: "asc" }, { publishedAt: "desc" }],
    });
    return NextResponse.json({ items: items.map(rowToCmsInsightRecord) });
  }

  const body = await req.json();
  const parsed = parseBody(body);
  if ("error" in parsed) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  try {
    const created = await prisma.cmsInsight.create({ data: parsed.data });
    return NextResponse.json({ item: rowToCmsInsightRecord(created) });
  } catch (e) {
    console.error("[admin/insights POST]", e);
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
    const updated = await prisma.cmsInsight.update({
      where: { id },
      data: parsed.data,
    });
    return NextResponse.json({ item: rowToCmsInsightRecord(updated) });
  } catch (e) {
    console.error("[admin/insights PUT]", e);
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

  await prisma.cmsInsight.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}

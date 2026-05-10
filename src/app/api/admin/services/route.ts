import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { assertAdmin } from "@/app/api/admin/_auth";
import { seedServices } from "@/lib/cms/seed";

async function ensureSeeded() {
  const count = await prisma.cmsService.count();
  if (count > 0) return;
  await prisma.cmsService.createMany({
    data: seedServices.map((s) => ({
      title: s.title,
      category: s.category,
      description: s.description,
      imageUrl: s.imageUrl,
      imageAlt: s.imageAlt ?? null,
      badges: (s.badges as any) ?? null,
      order: s.order ?? 0,
    })),
  });
}

export async function GET(req: NextRequest) {
  if (!(await assertAdmin()))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    await ensureSeeded();
    const items = await prisma.cmsService.findMany({
      orderBy: [{ order: "asc" }, { title: "asc" }],
    });
    return NextResponse.json({ items });
  } catch (e) {
    console.error("[admin/services GET]", e);
    const msg = e instanceof Error ? e.message : "Database error";
    return NextResponse.json({ error: msg }, { status: 503 });
  }
}

export async function POST(req: NextRequest) {
  if (!(await assertAdmin()))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { searchParams } = new URL(req.url);
  if (searchParams.get("reset") === "1") {
    await prisma.cmsService.deleteMany();
    await prisma.cmsService.createMany({
      data: seedServices.map((s) => ({
        title: s.title,
        category: s.category,
        description: s.description,
        imageUrl: s.imageUrl,
        imageAlt: s.imageAlt ?? null,
        badges: (s.badges as any) ?? null,
        order: s.order ?? 0,
      })),
    });
    const items = await prisma.cmsService.findMany({
      orderBy: [{ order: "asc" }, { title: "asc" }],
    });
    return NextResponse.json({ items });
  }

  const body = (await req.json()) as {
    title: string;
    category: string;
    description: string;
    imageUrl: string;
    imageAlt?: string | null;
    badges?: unknown;
    order?: number;
  };
  const created = await prisma.cmsService.create({
    data: {
      title: body.title,
      category: body.category,
      description: body.description,
      imageUrl: body.imageUrl,
      imageAlt: body.imageAlt ?? null,
      badges: (body.badges as any) ?? null,
      order: Number.isFinite(body.order) ? (body.order as number) : 0,
    },
  });
  return NextResponse.json({ item: created });
}

export async function PUT(req: NextRequest) {
  if (!(await assertAdmin()))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = (await req.json()) as {
    id: string;
    title: string;
    category: string;
    description: string;
    imageUrl: string;
    imageAlt?: string | null;
    badges?: unknown;
    order?: number;
  };
  const updated = await prisma.cmsService.update({
    where: { id: body.id },
    data: {
      title: body.title,
      category: body.category,
      description: body.description,
      imageUrl: body.imageUrl,
      imageAlt: body.imageAlt ?? null,
      badges: (body.badges as any) ?? null,
      order: Number.isFinite(body.order) ? (body.order as number) : 0,
    },
  });
  return NextResponse.json({ item: updated });
}

export async function DELETE(req: NextRequest) {
  if (!(await assertAdmin()))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { searchParams } = new URL(req.url);
  if (searchParams.get("all") === "1") {
    await prisma.cmsService.deleteMany();
    return NextResponse.json({ ok: true });
  }
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  await prisma.cmsService.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}


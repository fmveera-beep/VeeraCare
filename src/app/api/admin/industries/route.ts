import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { assertAdmin } from "@/app/api/admin/_auth";
import { seedIndustries } from "@/lib/cms/seed";

async function ensureSeeded() {
  const count = await prisma.cmsIndustry.count();
  if (count > 0) return;
  await prisma.cmsIndustry.createMany({
    data: seedIndustries.map((s) => ({
      key: s.key,
      title: s.title,
      gradient: s.gradient,
      iconName: s.iconName,
      body: s.body,
      jobs: s.jobs as any,
      order: s.order ?? 0,
    })),
  });
}

export async function GET(req: NextRequest) {
  if (!assertAdmin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    await ensureSeeded();
    const items = await prisma.cmsIndustry.findMany({
      orderBy: [{ order: "asc" }, { title: "asc" }],
    });
    return NextResponse.json({ items });
  } catch (e) {
    console.error("[admin/industries GET]", e);
    const msg = e instanceof Error ? e.message : "Database error";
    return NextResponse.json({ error: msg }, { status: 503 });
  }
}

export async function POST(req: NextRequest) {
  if (!assertAdmin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { searchParams } = new URL(req.url);
  if (searchParams.get("reset") === "1") {
    await prisma.cmsIndustry.deleteMany();
    await prisma.cmsIndustry.createMany({
      data: seedIndustries.map((s) => ({
        key: s.key,
        title: s.title,
        gradient: s.gradient,
        iconName: s.iconName,
        body: s.body,
        jobs: s.jobs as any,
        order: s.order ?? 0,
      })),
    });
    const items = await prisma.cmsIndustry.findMany({
      orderBy: [{ order: "asc" }, { title: "asc" }],
    });
    return NextResponse.json({ items });
  }

  const body = (await req.json()) as {
    key: string;
    title: string;
    gradient: string;
    iconName: string;
    body: string;
    jobs: unknown;
    order?: number;
  };
  const created = await prisma.cmsIndustry.create({
    data: {
      key: body.key,
      title: body.title,
      gradient: body.gradient,
      iconName: body.iconName,
      body: body.body,
      jobs: body.jobs as any,
      order: Number.isFinite(body.order) ? (body.order as number) : 0,
    },
  });
  return NextResponse.json({ item: created });
}

export async function PUT(req: NextRequest) {
  if (!assertAdmin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = (await req.json()) as {
    id: string;
    key: string;
    title: string;
    gradient: string;
    iconName: string;
    body: string;
    jobs: unknown;
    order?: number;
  };
  const updated = await prisma.cmsIndustry.update({
    where: { id: body.id },
    data: {
      key: body.key,
      title: body.title,
      gradient: body.gradient,
      iconName: body.iconName,
      body: body.body,
      jobs: body.jobs as any,
      order: Number.isFinite(body.order) ? (body.order as number) : 0,
    },
  });
  return NextResponse.json({ item: updated });
}

export async function DELETE(req: NextRequest) {
  if (!assertAdmin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { searchParams } = new URL(req.url);
  if (searchParams.get("all") === "1") {
    await prisma.cmsIndustry.deleteMany();
    return NextResponse.json({ ok: true });
  }
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  await prisma.cmsIndustry.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}


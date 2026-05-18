import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { seedServices } from "@/lib/cms/seed";

export const dynamic = "force-dynamic";

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

export async function GET() {
  await ensureSeeded();
  const items = await prisma.cmsService.findMany({
    orderBy: [{ order: "asc" }, { title: "asc" }],
    select: { title: true, category: true, order: true },
  });
  return NextResponse.json({ items });
}

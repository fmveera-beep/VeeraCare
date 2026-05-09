import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { seedIndustries } from "@/lib/cms/seed";

export const dynamic = "force-dynamic";

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

export async function GET() {
  await ensureSeeded();
  const items = await prisma.cmsIndustry.findMany({
    orderBy: [{ order: "asc" }, { title: "asc" }],
  });
  return NextResponse.json({ items });
}


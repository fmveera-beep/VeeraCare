import { prisma } from "@/lib/prisma";
import { jobPosts, type JobPost, type JobSection } from "@/lib/jobs/posts";

export type CmsJobRecord = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  metaDescription: string;
  category: string;
  location: string;
  employmentType: string;
  salaryRange: string | null;
  heroImage: string | null;
  heroImageAlt: string | null;
  sections: JobSection[];
  requirements: string[];
  benefits: string[];
  published: boolean;
  publishedAt: string;
  order: number;
  createdAt: string;
  updatedAt: string;
};

function parseSections(raw: unknown): JobSection[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((s) => {
      if (!s || typeof s !== "object") return null;
      const row = s as { heading?: unknown; paragraphs?: unknown };
      const paragraphs = Array.isArray(row.paragraphs)
        ? row.paragraphs.filter((p): p is string => typeof p === "string")
        : [];
      if (paragraphs.length === 0) return null;
      const section: JobSection = { paragraphs };
      if (typeof row.heading === "string" && row.heading.trim()) {
        section.heading = row.heading.trim();
      }
      return section;
    })
    .filter((s): s is JobSection => s !== null);
}

function parseRequirements(raw: unknown): string[] {
  if (!Array.isArray(raw)) return [];
  return raw.filter((r): r is string => typeof r === "string" && r.trim().length > 0);
}

function parseBenefits(raw: unknown): string[] {
  return parseRequirements(raw);
}

export function rowToJobPost(row: {
  slug: string;
  title: string;
  excerpt: string;
  metaDescription: string;
  category: string;
  location: string;
  employmentType: string;
  salaryRange: string | null;
  heroImage: string | null;
  heroImageAlt: string | null;
  sections: unknown;
  requirements: unknown;
  benefits?: unknown;
  publishedAt: Date;
}): JobPost {
  return {
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    metaDescription: row.metaDescription,
    category: row.category,
    location: row.location,
    employmentType: row.employmentType,
    salaryRange: row.salaryRange,
    heroImage: row.heroImage,
    heroImageAlt: row.heroImageAlt ?? row.title,
    sections: parseSections(row.sections),
    requirements: parseRequirements(row.requirements),
    benefits: parseBenefits(row.benefits),
    publishedAt: row.publishedAt.toISOString().slice(0, 10),
  };
}

export function rowToCmsJobRecord(row: {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  metaDescription: string;
  category: string;
  location: string;
  employmentType: string;
  salaryRange: string | null;
  heroImage: string | null;
  heroImageAlt: string | null;
  sections: unknown;
  requirements: unknown;
  benefits?: unknown;
  published: boolean;
  publishedAt: Date;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}): CmsJobRecord {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    metaDescription: row.metaDescription,
    category: row.category,
    location: row.location,
    employmentType: row.employmentType,
    salaryRange: row.salaryRange,
    heroImage: row.heroImage,
    heroImageAlt: row.heroImageAlt,
    sections: parseSections(row.sections),
    requirements: parseRequirements(row.requirements),
    benefits: parseBenefits(row.benefits),
    published: row.published,
    publishedAt: row.publishedAt.toISOString(),
    order: row.order,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

export function seedJobCreateData() {
  return jobPosts.map((p, index) => ({
    slug: p.slug,
    title: p.title,
    excerpt: p.excerpt,
    metaDescription: p.metaDescription,
    category: p.category,
    location: p.location,
    employmentType: p.employmentType,
    salaryRange: p.salaryRange,
    heroImage: p.heroImage,
    heroImageAlt: p.heroImageAlt,
    sections: p.sections as object,
    requirements: p.requirements as object,
    benefits: p.benefits as object,
    published: true,
    publishedAt: new Date(p.publishedAt),
    order: index,
  }));
}

export async function ensureJobSeeded() {
  const count = await prisma.cmsJob.count();
  if (count > 0) return;
  await prisma.cmsJob.createMany({ data: seedJobCreateData() });
}

export async function loadPublishedJobs(): Promise<JobPost[]> {
  try {
    await ensureJobSeeded();
    const rows = await prisma.cmsJob.findMany({
      where: { published: true },
      orderBy: [{ order: "asc" }, { publishedAt: "desc" }],
    });
    if (rows.length === 0) return jobPosts;
    return rows.map(rowToJobPost);
  } catch (e) {
    console.error("[jobs] loadPublishedJobs", e);
    return jobPosts;
  }
}

export async function loadJobBySlug(slug: string): Promise<JobPost | undefined> {
  try {
    await ensureJobSeeded();
    const row = await prisma.cmsJob.findFirst({
      where: { slug, published: true },
    });
    if (row) return rowToJobPost(row);
  } catch (e) {
    console.error("[jobs] loadJobBySlug", e);
  }
  return jobPosts.find((p) => p.slug === slug);
}

export async function loadAllPublishedJobSlugs(): Promise<string[]> {
  try {
    await ensureJobSeeded();
    const rows = await prisma.cmsJob.findMany({
      where: { published: true },
      select: { slug: true },
      orderBy: [{ order: "asc" }, { publishedAt: "desc" }],
    });
    if (rows.length > 0) return rows.map((r) => r.slug);
  } catch (e) {
    console.error("[jobs] loadAllPublishedJobSlugs", e);
  }
  return jobPosts.map((p) => p.slug);
}

export async function loadLatestPublishedJobs(limit = 3): Promise<JobPost[]> {
  const jobs = await loadPublishedJobs();
  return [...jobs]
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, limit);
}

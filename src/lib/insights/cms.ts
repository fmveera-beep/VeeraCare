import { prisma } from "@/lib/prisma";
import {
  insightPosts,
  type InsightPost,
  type InsightSection,
} from "@/lib/insights/posts";

export type CmsInsightRecord = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  metaDescription: string;
  publishedAt: string;
  readTimeMinutes: number;
  category: string;
  heroImage: string;
  heroImageAlt: string | null;
  author: string;
  sections: InsightSection[];
  published: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
};

function parseSections(raw: unknown): InsightSection[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((s) => {
      if (!s || typeof s !== "object") return null;
      const row = s as { heading?: unknown; paragraphs?: unknown };
      const paragraphs = Array.isArray(row.paragraphs)
        ? row.paragraphs.filter((p): p is string => typeof p === "string")
        : [];
      if (paragraphs.length === 0) return null;
      const section: InsightSection = { paragraphs };
      if (typeof row.heading === "string" && row.heading.trim()) {
        section.heading = row.heading.trim();
      }
      return section;
    })
    .filter((s): s is InsightSection => s !== null);
}

export function rowToInsightPost(row: {
  slug: string;
  title: string;
  excerpt: string;
  metaDescription: string;
  publishedAt: Date;
  readTimeMinutes: number;
  category: string;
  heroImage: string;
  heroImageAlt: string | null;
  author: string;
  sections: unknown;
}): InsightPost {
  return {
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    metaDescription: row.metaDescription,
    publishedAt: row.publishedAt.toISOString().slice(0, 10),
    readTimeMinutes: row.readTimeMinutes,
    category: row.category,
    heroImage: row.heroImage,
    heroImageAlt: row.heroImageAlt ?? row.title,
    author: row.author,
    sections: parseSections(row.sections),
  };
}

export function rowToCmsInsightRecord(row: {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  metaDescription: string;
  publishedAt: Date;
  readTimeMinutes: number;
  category: string;
  heroImage: string;
  heroImageAlt: string | null;
  author: string;
  sections: unknown;
  published: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}): CmsInsightRecord {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    metaDescription: row.metaDescription,
    publishedAt: row.publishedAt.toISOString(),
    readTimeMinutes: row.readTimeMinutes,
    category: row.category,
    heroImage: row.heroImage,
    heroImageAlt: row.heroImageAlt,
    author: row.author,
    sections: parseSections(row.sections),
    published: row.published,
    order: row.order,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

export function seedInsightCreateData() {
  return insightPosts.map((p, index) => ({
    slug: p.slug,
    title: p.title,
    excerpt: p.excerpt,
    metaDescription: p.metaDescription,
    publishedAt: new Date(p.publishedAt),
    readTimeMinutes: p.readTimeMinutes,
    category: p.category,
    heroImage: p.heroImage,
    heroImageAlt: p.heroImageAlt,
    author: p.author,
    sections: p.sections as object,
    published: true,
    order: index,
  }));
}

export async function ensureInsightSeeded() {
  const count = await prisma.cmsInsight.count();
  if (count > 0) return;
  await prisma.cmsInsight.createMany({ data: seedInsightCreateData() });
}

export async function loadPublishedInsightPosts(): Promise<InsightPost[]> {
  try {
    await ensureInsightSeeded();
    const rows = await prisma.cmsInsight.findMany({
      where: { published: true },
      orderBy: [{ order: "asc" }, { publishedAt: "desc" }],
    });
    if (rows.length === 0) return insightPosts;
    return rows.map(rowToInsightPost);
  } catch (e) {
    console.error("[insights] loadPublishedInsightPosts", e);
    return insightPosts;
  }
}

export async function loadInsightPostBySlug(slug: string): Promise<InsightPost | undefined> {
  try {
    await ensureInsightSeeded();
    const row = await prisma.cmsInsight.findFirst({
      where: { slug, published: true },
    });
    if (row) return rowToInsightPost(row);
  } catch (e) {
    console.error("[insights] loadInsightPostBySlug", e);
  }
  return insightPosts.find((p) => p.slug === slug);
}

export async function loadAllPublishedInsightSlugs(): Promise<string[]> {
  try {
    await ensureInsightSeeded();
    const rows = await prisma.cmsInsight.findMany({
      where: { published: true },
      select: { slug: true },
      orderBy: [{ order: "asc" }, { publishedAt: "desc" }],
    });
    if (rows.length > 0) return rows.map((r) => r.slug);
  } catch (e) {
    console.error("[insights] loadAllPublishedInsightSlugs", e);
  }
  return insightPosts.map((p) => p.slug);
}

export async function loadLatestPublishedInsights(limit = 3): Promise<InsightPost[]> {
  const posts = await loadPublishedInsightPosts();
  return [...posts]
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, limit);
}

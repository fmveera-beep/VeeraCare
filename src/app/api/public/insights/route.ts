import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { loadLatestPublishedInsights, loadPublishedInsightPosts } from "@/lib/insights/cms";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const limitParam = searchParams.get("limit");
  const limit = limitParam ? Math.min(12, Math.max(1, Number(limitParam) || 3)) : undefined;

  const posts = limit
    ? await loadLatestPublishedInsights(limit)
    : await loadPublishedInsightPosts();

  const items = posts.map((p) => ({
    slug: p.slug,
    title: p.title,
    excerpt: p.excerpt,
    publishedAt: p.publishedAt,
    readTimeMinutes: p.readTimeMinutes,
    category: p.category,
    heroImage: p.heroImage,
    heroImageAlt: p.heroImageAlt,
  }));

  return NextResponse.json({ items });
}

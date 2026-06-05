import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/seo/siteUrl";
import { insightPosts } from "@/lib/insights/posts";
import { jobPosts } from "@/lib/jobs/posts";

const STATIC_PATHS: {
  path: string;
  priority: number;
  changeFrequency: MetadataRoute.Sitemap[0]["changeFrequency"];
}[] = [
  { path: "", priority: 1, changeFrequency: "weekly" },
  { path: "/services", priority: 0.9, changeFrequency: "weekly" },
  { path: "/contact", priority: 0.8, changeFrequency: "monthly" },
  { path: "/insights", priority: 0.8, changeFrequency: "weekly" },
  { path: "/careers", priority: 0.85, changeFrequency: "weekly" },
  { path: "/solutions/contract-staffing", priority: 0.7, changeFrequency: "monthly" },
  { path: "/solutions/direct-hire", priority: 0.7, changeFrequency: "monthly" },
];

function safeLastModified(iso: string): Date {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? new Date() : d;
}

/**
 * Static sitemap for crawlers (Google Search Console).
 * Intentionally avoids Prisma/DB so /sitemap.xml never 500s in production.
 * New CMS insight URLs are still discoverable via /insights and internal links.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const base = getSiteUrl();
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = STATIC_PATHS.map(
    ({ path, priority, changeFrequency }) => ({
      url: `${base}${path}`,
      lastModified: now,
      changeFrequency,
      priority,
    })
  );

  const articleEntries: MetadataRoute.Sitemap = insightPosts.map((post) => ({
    url: `${base}/insights/${post.slug}`,
    lastModified: safeLastModified(post.publishedAt),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const jobEntries: MetadataRoute.Sitemap = jobPosts.map((job) => ({
    url: `${base}/careers/${job.slug}`,
    lastModified: safeLastModified(job.publishedAt),
    changeFrequency: "weekly",
    priority: 0.65,
  }));

  return [...staticEntries, ...articleEntries, ...jobEntries];
}

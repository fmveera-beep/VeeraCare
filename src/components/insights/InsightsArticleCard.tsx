import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { RemoteImage } from "@/components/media/RemoteImage";
import type { InsightPost } from "@/lib/insights/posts";

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return iso;
  }
}

export function InsightsArticleCard({ post }: { post: InsightPost }) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm transition-all duration-300 hover:border-brand/25 hover:shadow-lg hover:shadow-brand/10">
      <div className="relative aspect-[16/10] overflow-hidden bg-neutral-100">
        <RemoteImage
          src={post.heroImage}
          alt={post.heroImageAlt}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-brand">
          {post.category}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-6 md:p-7">
        <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">
          {formatDate(post.publishedAt)} · {post.readTimeMinutes} min read
        </p>
        <h2 className="mt-3 text-xl font-bold leading-snug tracking-tight text-neutral-950 md:text-[1.35rem]">
          {post.title}
        </h2>
        <p className="mt-3 flex-1 text-sm leading-relaxed text-neutral-600">
          {post.excerpt}
        </p>
        <Link
          href={`/insights/${post.slug}`}
          className="mt-6 inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-brand transition-colors group-hover:text-brand-navy"
        >
          Read more
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
    </article>
  );
}

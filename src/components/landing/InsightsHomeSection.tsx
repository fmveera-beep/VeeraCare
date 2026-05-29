import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { RemoteImage } from "@/components/media/RemoteImage";
import { Reveal } from "@/components/motion/Reveal";
import { loadLatestPublishedInsights } from "@/lib/insights/cms";

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return iso;
  }
}

export async function InsightsHomeSection() {
  const posts = await loadLatestPublishedInsights(3);

  return (
    <section
      id="insights"
      className="border-y border-neutral-200 bg-[#f6f8ff] py-16 md:py-24"
    >
      <div className="mx-auto max-w-[1320px] px-4 md:px-8">
        <Reveal>
          <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-end">
            <div className="max-w-2xl">
              <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-brand">
                VeeraCare Insights
              </p>
              <h2 className="mt-4 text-3xl font-bold uppercase leading-[1.08] tracking-tight text-neutral-950 md:text-4xl">
                Corporate guidance for operators &amp; HR leaders
              </h2>
              <p className="mt-4 text-base leading-relaxed text-neutral-600 md:text-lg">
                Practical perspectives on strategic staffing, lean facilities management,
                and building a culture of reliability—written for startups and growing
                companies that cannot afford operational drift.
              </p>
            </div>
            <Link
              href="/insights"
              className="inline-flex shrink-0 items-center gap-2 rounded-[4px] border border-brand bg-white px-6 py-3 text-[11px] font-bold uppercase tracking-[0.18em] text-brand transition-colors hover:bg-brand hover:text-white"
            >
              View all insights
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </Reveal>

        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {posts.map((post, i) => (
            <Reveal key={post.slug} delay={i * 0.06} y={18}>
              <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm transition-all duration-300 hover:border-brand/25 hover:shadow-lg hover:shadow-brand/10">
                <div className="relative aspect-[16/10] overflow-hidden bg-neutral-100">
                  <RemoteImage
                    src={post.heroImage}
                    alt={post.heroImageAlt}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
                  <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-brand">
                    {post.category}
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">
                    {formatDate(post.publishedAt)} · {post.readTimeMinutes} min read
                  </p>
                  <h3 className="mt-3 line-clamp-3 text-lg font-bold leading-snug text-neutral-950">
                    {post.title}
                  </h3>
                  <p className="mt-3 line-clamp-3 flex-1 text-sm leading-relaxed text-neutral-600">
                    {post.excerpt}
                  </p>
                  <Link
                    href={`/insights/${post.slug}`}
                    className="mt-5 inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-brand transition-colors group-hover:text-brand-navy"
                  >
                    Read article
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

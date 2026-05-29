import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { PreHeader } from "@/components/landing/PreHeader";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { RemoteImage } from "@/components/media/RemoteImage";
import { InsightsArticleProse } from "@/components/insights/InsightsArticleProse";
import { Reveal } from "@/components/motion/Reveal";
import {
  loadAllPublishedInsightSlugs,
  loadInsightPostBySlug,
} from "@/lib/insights/cms";

type PageProps = {
  params: { slug: string };
};

export const revalidate = 60;

export async function generateStaticParams() {
  const slugs = await loadAllPublishedInsightSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const slug = params.slug;
  const post = await loadInsightPostBySlug(slug);
  if (!post) {
    return {
      title: "Article not found | VeeraCare Insights",
      description: "The requested VeeraCare Insights article could not be found.",
    };
  }

  return {
    title: `${post.title} | VeeraCare Insights`,
    description: post.metaDescription,
    openGraph: {
      title: post.title,
      description: post.metaDescription,
      type: "article",
      siteName: "VeeraCare",
      publishedTime: post.publishedAt,
      images: [
        {
          url: post.heroImage,
          width: 1200,
          height: 630,
          alt: post.heroImageAlt,
        },
      ],
    },
  };
}

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

export default async function InsightArticlePage({ params }: PageProps) {
  const slug = params.slug;
  const post = await loadInsightPostBySlug(slug);
  if (!post) notFound();

  return (
    <>
      <PreHeader />
      <Navbar />
      <main>
        <article>
          <header className="relative min-h-[min(52vh,520px)] overflow-hidden border-b border-neutral-200 bg-neutral-950">
            <RemoteImage
              src={post.heroImage}
              alt={post.heroImageAlt}
              fill
              priority
              className="object-cover opacity-70"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/55 to-black/30" />
            <div className="relative mx-auto flex min-h-[min(52vh,520px)] max-w-[1320px] flex-col justify-end px-4 pb-12 pt-28 md:px-8 md:pb-16">
              <Reveal blur>
                <Link
                  href="/insights"
                  className="inline-flex w-fit items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-white/80 transition-colors hover:text-white"
                >
                  <ArrowLeft className="h-4 w-4" />
                  All insights
                </Link>
                <p className="mt-6 text-[11px] font-bold uppercase tracking-[0.22em] text-brand-pale">
                  {post.category}
                </p>
                <h1 className="mt-4 max-w-4xl text-[clamp(1.85rem,3.8vw,3rem)] font-bold uppercase leading-[1.08] tracking-tight text-white">
                  {post.title}
                </h1>
                <p className="mt-5 max-w-2xl text-sm text-white/75 md:text-base">
                  {formatDate(post.publishedAt)} · {post.readTimeMinutes} min read ·{" "}
                  {post.author}
                </p>
              </Reveal>
            </div>
          </header>

          <div className="bg-white py-14 md:py-20">
            <Reveal>
              <p className="mx-auto max-w-[720px] px-4 text-lg font-medium leading-relaxed text-neutral-800 md:px-0 md:text-xl">
                {post.excerpt}
              </p>
            </Reveal>
            <div className="mt-12 px-4 md:px-8">
              <InsightsArticleProse sections={post.sections} />
            </div>
          </div>
        </article>

        <section className="border-t border-neutral-200 bg-[#f6f8ff] py-12 md:py-16">
          <div className="mx-auto max-w-[1320px] px-4 text-center md:px-8">
            <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-brand">
              VeeraCare
            </p>
            <p className="mt-3 text-lg font-bold text-neutral-950">
              Need dependable staffing or facilities coverage?
            </p>
            <Link
              href="/contact"
              className="mt-6 inline-flex items-center justify-center rounded-[4px] bg-brand px-6 py-3 text-[11px] font-bold uppercase tracking-[0.18em] text-white transition-colors hover:bg-brand-navy"
            >
              Contact our team
            </Link>
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
}

import type { Metadata } from "next";
import { PreHeader } from "@/components/landing/PreHeader";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { InsightsHero } from "@/components/insights/InsightsHero";
import { InsightsArticleCard } from "@/components/insights/InsightsArticleCard";
import { loadPublishedInsightPosts } from "@/lib/insights/cms";
import { Reveal } from "@/components/motion/Reveal";

import { SEO_SITE_NAME, seoPageTitle } from "@/lib/seo/brand";

export const metadata: Metadata = {
  title: seoPageTitle("Insights — Staffing & Facilities Management"),
  description:
    "VeeraFM Insights shares corporate guidance on strategic staffing, facilities management for startups, and building a culture of reliability across HR and workspace operations.",
  openGraph: {
    title: "VeeraFM Insights — Staffing & Facilities Perspectives",
    description:
      "Expert perspectives on workforce strategy, lean facilities management, and operational reliability for startups and growing companies.",
    type: "website",
    siteName: SEO_SITE_NAME,
    images: [
      {
        url: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80",
        width: 1200,
        height: 630,
        alt: "Modern corporate workspace",
      },
    ],
  },
};

export const revalidate = 60;

export default async function InsightsIndexPage() {
  const posts = await loadPublishedInsightPosts();

  return (
    <>
      <PreHeader />
      <Navbar />
      <main>
        <InsightsHero />

        <section className="border-b border-neutral-200 bg-white py-14 md:py-20">
          <div className="mx-auto max-w-[1320px] px-4 md:px-8">
            <Reveal>
              <div className="mx-auto max-w-2xl text-center">
                <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-brand">
                  Latest articles
                </p>
                <p className="mt-4 text-base leading-relaxed text-neutral-600 md:text-lg">
                  Curated for operators, HR leaders, and founders who need dependable
                  staffing and facilities execution—not generic hiring advice.
                </p>
              </div>
            </Reveal>

            <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3 lg:gap-10">
              {posts.map((post, i) => (
                <Reveal key={post.slug} delay={i * 0.06} y={20}>
                  <InsightsArticleCard post={post} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
}

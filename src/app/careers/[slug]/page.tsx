import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Briefcase, MapPin } from "lucide-react";
import { PreHeader } from "@/components/landing/PreHeader";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { InsightsArticleProse } from "@/components/insights/InsightsArticleProse";
import { RemoteImage } from "@/components/media/RemoteImage";
import { Reveal } from "@/components/motion/Reveal";
import { loadAllPublishedJobSlugs, loadJobBySlug } from "@/lib/jobs/cms";
import { SEO_SITE_NAME, seoPageTitle } from "@/lib/seo/brand";
import { seoCanonical } from "@/lib/seo/canonical";

type PageProps = {
  params: { slug: string };
};

export const revalidate = 60;

export async function generateStaticParams() {
  const slugs = await loadAllPublishedJobSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const job = await loadJobBySlug(params.slug);
  if (!job) {
    return {
      ...seoCanonical(`/careers/${params.slug}`),
      title: seoPageTitle("Job not found"),
      description: "The requested VeeraFM job opening could not be found.",
    };
  }

  return {
    ...seoCanonical(`/careers/${job.slug}`),
    title: seoPageTitle(`${job.title} — ${job.location}`),
    description: job.metaDescription,
    openGraph: {
      title: job.title,
      description: job.metaDescription,
      type: "website",
      siteName: SEO_SITE_NAME,
      ...(job.heroImage
        ? {
            images: [
              {
                url: job.heroImage,
                width: 1200,
                height: 630,
                alt: job.heroImageAlt ?? job.title,
              },
            ],
          }
        : {}),
    },
  };
}

export default async function JobDetailPage({ params }: PageProps) {
  const job = await loadJobBySlug(params.slug);
  if (!job) notFound();

  return (
    <>
      <PreHeader />
      <Navbar />
      <main>
        <article>
          <header
            className={
              job.heroImage
                ? "relative min-h-[min(52vh,520px)] overflow-hidden border-b border-neutral-200 bg-neutral-950 text-white"
                : "relative overflow-hidden border-b border-neutral-200 bg-neutral-950 text-white"
            }
          >
            {job.heroImage ? (
              <>
                <RemoteImage
                  src={job.heroImage}
                  alt={job.heroImageAlt ?? job.title}
                  fill
                  priority
                  className="object-cover opacity-70"
                  sizes="100vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/55 to-black/30" />
              </>
            ) : (
              <div
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_55%_at_50%_-15%,rgba(64,88,176,0.35),transparent)]"
                aria-hidden
              />
            )}
            <div
              className={
                job.heroImage
                  ? "relative mx-auto flex min-h-[min(52vh,520px)] max-w-[1320px] flex-col justify-end px-4 pb-12 pt-28 md:px-8 md:pb-16"
                  : "relative mx-auto max-w-[1320px] px-4 pb-12 pt-28 md:px-8 md:pb-16"
              }
            >
              <Reveal blur>
                <Link
                  href="/careers"
                  className="inline-flex w-fit items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-white/80 transition-colors hover:text-white"
                >
                  <ArrowLeft className="h-4 w-4" />
                  All openings
                </Link>
                <p className="mt-6 text-[11px] font-bold uppercase tracking-[0.22em] text-brand-pale">
                  {job.category} · {job.employmentType}
                </p>
                <h1 className="mt-4 max-w-4xl break-words text-[clamp(1.75rem,5vw,3rem)] font-bold uppercase leading-[1.08] tracking-tight">
                  {job.title}
                </h1>
                <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm text-white/80 md:text-base">
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin className="h-4 w-4 text-brand-pale" aria-hidden />
                    {job.location}
                  </span>
                  {job.salaryRange ? (
                    <span className="inline-flex items-center gap-1.5 font-semibold text-white">
                      <Briefcase className="h-4 w-4 text-brand-pale" aria-hidden />
                      {job.salaryRange}
                    </span>
                  ) : null}
                </div>
              </Reveal>
            </div>
          </header>

          <div className="bg-white py-14 md:py-20">
            <Reveal>
              <p className="mx-auto max-w-[720px] px-4 text-lg font-medium leading-relaxed text-neutral-800 md:px-0 md:text-xl">
                {job.excerpt}
              </p>
            </Reveal>

            {job.requirements.length > 0 ? (
              <Reveal delay={0.05}>
                <div className="mx-auto mt-10 max-w-[720px] px-4 md:px-0">
                  <h2 className="text-xl font-bold uppercase tracking-tight text-neutral-950 md:text-2xl">
                    Requirements
                  </h2>
                  <ul className="mt-4 list-disc space-y-2 pl-5 text-base leading-relaxed text-neutral-700">
                    {job.requirements.map((req) => (
                      <li key={req}>{req}</li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ) : null}

            <div className="mt-12 px-4 md:px-8">
              <InsightsArticleProse sections={job.sections} />
            </div>
          </div>
        </article>

        <section className="border-t border-neutral-200 bg-[#f6f8ff] py-12 md:py-16">
          <div className="mx-auto max-w-[1320px] px-4 text-center md:px-8">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-[4px] bg-brand px-6 py-3 text-[11px] font-bold uppercase tracking-[0.22em] text-white transition-colors hover:bg-brand-navy"
            >
              Apply now
            </Link>
            <p className="mt-4 text-lg font-bold text-neutral-950">
              Interested in this role? Send your details to our careers team.
            </p>
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
}

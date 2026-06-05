import type { Metadata } from "next";
import { PreHeader } from "@/components/landing/PreHeader";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { CareersHero } from "@/components/jobs/CareersHero";
import { JobBoard } from "@/components/jobs/JobBoard";
import { loadPublishedJobs } from "@/lib/jobs/cms";
import { SEO_SITE_NAME, seoPageTitle } from "@/lib/seo/brand";
import { seoCanonical } from "@/lib/seo/canonical";

export const metadata: Metadata = {
  ...seoCanonical("/careers"),
  title: seoPageTitle("Careers — Job Openings"),
  description:
    "Browse VeeraFM job openings across security, facilities, housekeeping, driving, and support roles in the UAE. Apply online for current vacancies.",
  openGraph: {
    title: "VeeraFM Careers — Current Job Openings",
    description:
      "Find and apply for staffing and facilities roles managed by VeeraFM across Dubai, Abu Dhabi, Sharjah, and the UAE.",
    type: "website",
    siteName: SEO_SITE_NAME,
  },
};

export const revalidate = 60;

export default async function CareersPage() {
  const jobs = await loadPublishedJobs();

  const categories = Array.from(new Set(jobs.map((j) => j.category))).sort();
  const locations = Array.from(new Set(jobs.map((j) => j.location))).sort();
  const employmentTypes = Array.from(new Set(jobs.map((j) => j.employmentType))).sort();

  return (
    <>
      <PreHeader />
      <Navbar />
      <main>
        <CareersHero />

        <section className="border-b border-neutral-200 bg-white py-14 md:py-20">
          <div className="mx-auto max-w-[1320px] px-4 md:px-8">
            <JobBoard
              jobs={jobs}
              categories={categories}
              locations={locations}
              employmentTypes={employmentTypes}
            />
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
}

import type { Metadata } from "next";
import { PreHeader } from "@/components/landing/PreHeader";
import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { SecurityPoints } from "@/components/landing/SecurityPoints";
import { FeaturedServicesSection } from "@/components/landing/FeaturedServicesSection";
import { IndustriesSection } from "@/components/landing/IndustriesSection";
import { AboutSection } from "@/components/landing/AboutSection";
import { WhatWeDo } from "@/components/landing/WhatWeDo";
import { ByTheNumbers } from "@/components/landing/ByTheNumbers";
import { DEISection } from "@/components/landing/DEISection";
import { InsightsHomeSection } from "@/components/landing/InsightsHomeSection";
import { ReviewsBand } from "@/components/landing/ReviewsBand";
import { FAQBand } from "@/components/landing/FAQBand";
import { CareerBanner } from "@/components/landing/CareerBanner";
import { Footer } from "@/components/landing/Footer";
import { HomeHashScroll } from "@/components/landing/HomeHashScroll";
import { CTAForm } from "@/components/cta/CTAForm";

import { SEO_HOME_DESCRIPTION, SEO_SITE_NAME, seoPageTitle } from "@/lib/seo/brand";
import { seoCanonical } from "@/lib/seo/canonical";

export const metadata: Metadata = {
  ...seoCanonical("/"),
  title: seoPageTitle("Reliable Staffing & Facilities Management"),
  description: SEO_HOME_DESCRIPTION,
  openGraph: {
    title: "Reliable Staffing & Facilities Management",
    description:
      "Direct hire and managed staffing for housemaids, technicians, construction, event, and security personnel—built for facilities that must stay clean, compliant, and fully operational.",
    type: "website",
    siteName: SEO_SITE_NAME,
    images: [
      {
        url: "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=1200&q=80",
        width: 1200,
        height: 630,
        alt: "Skilled onsite technician at work",
      },
    ],
  },
};

export default function HomePage() {
  return (
    <>
      <PreHeader />
      <Navbar />
      <main>
        <HomeHashScroll />
        <Hero />
        <SecurityPoints />
        <FeaturedServicesSection />
        <IndustriesSection />
        <AboutSection />
        <WhatWeDo />
        <ByTheNumbers />
        <DEISection />
        <InsightsHomeSection />
        <ReviewsBand />
        <FAQBand />
        <CareerBanner />
        <CTAForm className="bg-gradient-to-b from-white to-[#f6f8ff]" />
        <Footer />
      </main>
    </>
  );
}

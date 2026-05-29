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

export const metadata: Metadata = {
  title: "Reliable Staffing & Care Management Solutions | VeeraCare",
  description:
    "VeeraCare provides reliable staffing and onsite workforce solutions through direct hire and managed supply—covering housemaids, skilled technicians, construction crews, event staff, and security personnel for facilities that must stay clean, compliant, and fully operational.",
  openGraph: {
    title: "Reliable Staffing & Care Management Solutions",
    description:
      "Direct hire and managed staffing for housemaids, technicians, construction, event, and security personnel—built for facilities that must stay clean, compliant, and fully operational.",
    type: "website",
    siteName: "VeeraCare",
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

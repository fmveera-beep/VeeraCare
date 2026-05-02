import { PreHeader } from "@/components/landing/PreHeader";
import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { FeaturedServicesSection } from "@/components/landing/FeaturedServicesSection";
import { IndustriesSection } from "@/components/landing/IndustriesSection";
import { AboutSection } from "@/components/landing/AboutSection";
import { WhatWeDo } from "@/components/landing/WhatWeDo";
import { ByTheNumbers } from "@/components/landing/ByTheNumbers";
import { DEISection } from "@/components/landing/DEISection";
import { ReviewsBand } from "@/components/landing/ReviewsBand";
import { FAQBand } from "@/components/landing/FAQBand";
import { CareerBanner } from "@/components/landing/CareerBanner";
import { Footer } from "@/components/landing/Footer";

export default function HomePage() {
  return (
    <>
      <PreHeader />
      <Navbar />
      <main>
        <Hero />
        <FeaturedServicesSection />
        <IndustriesSection />
        <AboutSection />
        <WhatWeDo />
        <ByTheNumbers />
        <DEISection />
        <ReviewsBand />
        <FAQBand />
        <CareerBanner />
        <Footer />
      </main>
    </>
  );
}

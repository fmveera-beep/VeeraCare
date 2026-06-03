import type { Metadata } from "next";
import { PreHeader } from "@/components/landing/PreHeader";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { CTAForm } from "@/components/cta/CTAForm";
import { seoPageTitle } from "@/lib/seo/brand";

export const metadata: Metadata = {
  title: seoPageTitle("Contact"),
  description:
    "Contact VeeraFM for facilities management and staffing—managed onsite teams, workforce inquiries, and employer support across the UAE.",
};

export default function ContactPage() {
  return (
    <>
      <PreHeader />
      <Navbar />
      <main>
        <CTAForm className="bg-white" />

        <Footer />
      </main>
    </>
  );
}


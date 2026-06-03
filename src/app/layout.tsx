import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { WhatsAppFloatingButton } from "@/components/contact/WhatsAppFloatingButton";
import { getSiteUrl } from "@/lib/seo/siteUrl";
import { SEO_DEFAULT_DESCRIPTION, SEO_SITE_NAME } from "@/lib/seo/brand";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  applicationName: SEO_SITE_NAME,
  title: {
    default: `${SEO_SITE_NAME} | Facilities management & staffing`,
    template: `%s | ${SEO_SITE_NAME}`,
  },
  description: SEO_DEFAULT_DESCRIPTION,
  openGraph: {
    siteName: SEO_SITE_NAME,
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
  ...(process.env.GOOGLE_SITE_VERIFICATION
    ? {
        verification: {
          google: process.env.GOOGLE_SITE_VERIFICATION,
        },
      }
    : {}),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
        <WhatsAppFloatingButton />
      </body>
    </html>
  );
}

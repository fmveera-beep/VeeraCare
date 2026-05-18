import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { WhatsAppFloatingButton } from "@/components/contact/WhatsAppFloatingButton";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Veera Care | Facilities management & staffing",
  description:
    "Veera Care provides facilities management and staffing for employers nationwide connecting skilled onsite technicians, construction and manpower crews, janitorial teams, porters, and maintenance staff.",
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

"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import {
  IconFacebook,
  IconInstagram,
  IconLinkedin,
} from "@/components/icons/SocialIcons";
import { VeeraLogo } from "@/components/brand/VeeraLogo";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { contactPhoneDisplay, contactPhoneE164, socialUrls } from "@/config/site";
import { seedServices } from "@/lib/cms/seed";
import { serviceDetailHref } from "@/lib/cms/serviceSectionAnchors";
import { smoothScrollToHash } from "@/components/landing/PromoCtas";

type FooterLink = { href: string; label: string };

const staticColumns: { title: string; links: FooterLink[] }[] = [
  {
    title: "Quick links",
    links: [
      { href: "/#about", label: "About VeeraCare" },
      { href: "/#industries", label: "Industries" },
      { href: "/#services", label: "Solutions overview" },
      { href: "/#reviews", label: "Customer reviews" },
      { href: "/#faq", label: "FAQ" },
    ],
  },
  {
    title: "Resources",
    links: [
      { href: "/insights", label: "Insights" },
      { href: "/#faq", label: "FAQ" },
      { href: "/contact", label: "Contact us" },
      { href: "/#membership", label: "Join our workforce" },
    ],
  },
];

function FooterNavLink({ href, label }: FooterLink) {
  const homeHash = href.startsWith("/#");

  return (
    <Link
      href={href}
      scroll={href.startsWith("/services")}
      onClick={
        homeHash
          ? (e) => {
              if (window.location.pathname === "/") {
                smoothScrollToHash(href.slice(1), e);
              }
            }
          : undefined
      }
      className="inline-block transition-all duration-200 hover:translate-x-1.5 hover:text-brand motion-reduce:hover:translate-x-0"
    >
      {label}
    </Link>
  );
}

const fallbackServiceLinks: FooterLink[] = seedServices.map((s) => ({
  label: s.title,
  href: serviceDetailHref(s.title),
}));

const footerSocial = [
  ["Facebook", IconFacebook, socialUrls.facebook],
  ["Instagram", IconInstagram, socialUrls.instagram],
  ["LinkedIn", IconLinkedin, socialUrls.linkedin],
] as const;

export function Footer() {
  const [newsletterThanks, setNewsletterThanks] = useState(false);
  const [serviceLinks, setServiceLinks] = useState<FooterLink[]>(fallbackServiceLinks);

  useEffect(() => {
    fetch("/api/public/services", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((data: { items?: { title: string; category: string }[] }) => {
        if (!Array.isArray(data.items) || data.items.length === 0) return;
        setServiceLinks(
          data.items.map((s) => ({
            label: String(s.title),
            href: serviceDetailHref(String(s.title)),
          }))
        );
      })
      .catch(() => {});
  }, []);

  const footerColumns = useMemo(
    () => [
      staticColumns[0],
      { title: "Services", links: serviceLinks },
      staticColumns[1],
    ],
    [serviceLinks]
  );

  const scrollToNewsletter = useCallback(() => {
    document.getElementById("newsletter")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
    window.setTimeout(() => {
      document.getElementById("newsletter-email")?.focus();
    }, 350);
  }, []);

  return (
    <footer id="footer" className="relative z-[3] -mt-[52px] bg-black pb-10 pt-[4.5rem] text-white md:-mt-[60px] md:pt-[5rem]">
      <div className="mx-auto max-w-[1320px] px-4 py-14 md:px-8 md:py-20">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,2fr)] lg:gap-16">
          <motion.div
            id="newsletter"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.4 }}
            className="scroll-mt-28"
          >
            <p className="mb-5 inline-flex flex-wrap items-center gap-2 rounded-full bg-neutral-900 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-white ring-1 ring-white/15">
              <span className="rounded-full bg-brand px-2 py-0.5 text-[10px] tracking-normal text-white">
                New
              </span>
              Facilities management &amp; staffing &gt;
            </p>
            <h3 className="text-xl font-bold uppercase tracking-wide">Stay updated</h3>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-white/70">
              Updates on labor trends, facilities compliance, wage benchmarks, and new VeeraCare
              programs—for HR, operations, and facilities leaders.
            </p>
            <form
              className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-end"
              onSubmit={(e) => {
                e.preventDefault();
                setNewsletterThanks(true);
              }}
            >
              <div className="relative flex-1">
                <label htmlFor="newsletter-email" className="sr-only">
                  Email address
                </label>
                <Input
                  id="newsletter-email"
                  type="email"
                  required
                  placeholder="Enter your email"
                  onChange={() => setNewsletterThanks(false)}
                  className="h-12 rounded-none border-0 border-b border-white/40 bg-transparent px-0 text-white placeholder:text-white/45 focus-visible:ring-0 focus-visible:ring-offset-0"
                />
              </div>
              <Button
                type="submit"
                size="icon"
                className="h-12 w-12 shrink-0 rounded-full bg-brand hover:bg-brand/90"
                aria-label="Subscribe"
              >
                <ArrowRight className="h-5 w-5 text-white" />
              </Button>
            </form>
            {newsletterThanks ? (
              <p className="mt-4 text-sm text-brand" role="status">
                Thankyou, you&apos;re on the list. We&apos;ll be in touch soon.
              </p>
            ) : null}
          </motion.div>

          <div className="grid gap-10 sm:grid-cols-3">
            {footerColumns.map((col) => (
              <motion.div
                key={col.title}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.35 }}
                className={col.title === "Services" ? "min-w-0" : undefined}
              >
                <p className="text-sm font-bold uppercase tracking-wide">{col.title}</p>
                <ul
                  className={
                    col.title === "Services"
                      ? "mt-4 max-h-[min(70vh,28rem)] space-y-2.5 overflow-y-auto pr-2 text-sm text-white/75 [scrollbar-color:rgba(255,255,255,0.35)_transparent] [scrollbar-width:thin] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-white/35"
                      : "mt-4 space-y-3 text-sm text-white/75"
                  }
                >
                  {col.links.map((l) => (
                    <li key={`${l.href}-${l.label}`}>
                      <FooterNavLink href={l.href} label={l.label} />
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="mt-16 grid gap-10 border-t border-white/10 pt-10 md:grid-cols-[auto_1fr_auto] md:items-center">
          <Link
            href="/"
            className="inline-flex w-fit items-center rounded-md border border-white/80 px-4 py-3 transition-all duration-300 hover:-translate-y-0.5 hover:border-brand hover:shadow-[0_0_28px_-4px_rgba(64,88,176,0.45)] motion-reduce:hover:translate-y-0"
            aria-label="Veera Care — home"
          >
            <VeeraLogo variant="nav" tone="light" />
          </Link>

          <div className="grid gap-8 text-sm md:grid-cols-3 md:gap-6">
            <div>
              <p className="font-semibold uppercase tracking-wide text-white/55">Call us</p>
              <p className="mt-2 font-medium">
                <a
                  href={`tel:+${contactPhoneE164}`}
                  className="transition-colors duration-200 hover:text-brand"
                >
                  {contactPhoneDisplay}
                </a>
              </p>
            </div>
            <div>
              <p className="font-semibold uppercase tracking-wide text-white/55">Email us</p>
              <p className="mt-2 font-medium">
                <a
                  href="mailto:admin@veerafm.com"
                  className="transition-colors duration-200 hover:text-brand"
                >
                  admin@veerafm.com
                </a>
              </p>
            </div>
            <div>
              <p className="font-semibold uppercase tracking-wide text-white/55">Visit us</p>
              <p className="mt-2 font-medium text-white/85">
                Al Khaleej Center, Office No: MB31
                <br />
                Near Sharaf DG Metro, Bur Dubai, UAE
                <br />
                United Arab Emirates
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 md:justify-end">
            {footerSocial.map(([label, Icon, url]) => (
              <a
                key={label}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/25 text-white transition-all duration-200 hover:border-brand hover:bg-white/10 motion-safe:hover:scale-110 motion-safe:active:scale-95"
                aria-label={label}
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-6 text-[13px] text-white/65">
          
          <div className="flex flex-wrap items-center gap-4">
            <Button
              type="button"
              className="rounded-[4px] bg-brand px-6 shadow-md shadow-brand/20 transition-all duration-300 hover:bg-brand/90 hover:shadow-lg hover:shadow-brand/35 motion-safe:hover:-translate-y-0.5"
              onClick={scrollToNewsletter}
            >
              Subscribe
            </Button>
            <Link
              href="/contact"
              className="font-semibold text-white transition-colors duration-200 hover:text-brand"
            >
              Contact us
            </Link>
          </div>
        </div>

        <p className="mt-8 text-center text-[12px] text-white/45 md:text-left">
          © {new Date().getFullYear()} VeeraCare. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

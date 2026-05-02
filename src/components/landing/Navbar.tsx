"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { VeeraLogo } from "@/components/brand/VeeraLogo";
import { GetAccessSolid } from "@/components/landing/PromoCtas";
import { cn } from "@/lib/utils";

const leftLinks = [
  { href: "#top", label: "Home" },
  { href: "#about", label: "About Us" },
  { href: "#services", label: "Services" },
  { href: "#industries", label: "Industries" },
  { href: "#faq", label: "FAQs" },
];

const rightLinks = [
  { href: "#reviews", label: "Reviews" },
  { href: "#contact", label: "Contact" },
];

const desktopNavLink =
  "relative py-1 text-[13px] font-semibold uppercase tracking-wide text-black transition-colors duration-200 after:pointer-events-none after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:origin-left after:scale-x-0 after:bg-brand after:transition-transform after:duration-200 after:ease-out hover:text-brand hover:after:scale-x-100 motion-safe:hover:-translate-y-px";

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.35, delay: 0.05 }}
      className={cn(
        "sticky top-0 z-50 border-b transition-[background-color,box-shadow,backdrop-filter] duration-300",
        scrolled
          ? "border-neutral-200/70 bg-white/90 shadow-md shadow-neutral-900/[0.06] backdrop-blur-md supports-[backdrop-filter]:bg-white/75"
          : "border-neutral-200 bg-white"
      )}
    >
      <nav className="relative mx-auto flex h-[72px] max-w-[1320px] items-center px-4 md:h-20 md:px-8">
        <div className="hidden flex-1 items-center justify-end gap-7 lg:flex lg:pr-28">
          {leftLinks.map((l) => (
            <Link key={l.href} href={l.href} className={desktopNavLink}>
              {l.label}
            </Link>
          ))}
        </div>

        <Link
          href="#top"
          className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center px-2 py-1 transition-all duration-300 hover:opacity-90 motion-safe:hover:scale-[1.02] motion-safe:active:scale-[0.99]"
          aria-label="Veera Care — home"
        >
          <VeeraLogo variant="nav" tone="dark" className="h-[34px] md:h-10" />
        </Link>

        <div className="hidden flex-1 items-center justify-start gap-7 lg:flex lg:pl-28">
          {rightLinks.map((l) => (
            <Link key={l.href} href={l.href} className={desktopNavLink}>
              {l.label}
            </Link>
          ))}
          <div className="ml-auto shrink-0">
            <GetAccessSolid />
          </div>
        </div>

        <div className="ml-auto flex items-center gap-2 lg:hidden">
          <GetAccessSolid className="scale-[0.92] px-3 py-2 text-[10px]" />
          <button
            type="button"
            aria-expanded={open}
            aria-label={open ? "Close menu" : "Open menu"}
            className="flex h-11 w-11 items-center justify-center rounded-[4px] border border-black text-black transition-all duration-200 hover:border-brand hover:bg-brand/5 hover:text-brand motion-safe:active:scale-95"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden border-t border-neutral-200 bg-white lg:hidden"
          >
            <div className="flex flex-col gap-1 px-4 py-4">
              {[...leftLinks, ...rightLinks].map((l) => (
                <Link
                  key={l.href + l.label}
                  href={l.href}
                  className={cn(
                    "rounded-[4px] px-3 py-3 text-sm font-semibold uppercase tracking-wide transition-all duration-200 hover:bg-brand/8 hover:pl-4 hover:text-brand motion-safe:active:scale-[0.99]"
                  )}
                  onClick={() => setOpen(false)}
                >
                  {l.label}
                </Link>
              ))}
              <div className="pt-3">
                <GetAccessSolid className="w-full justify-center" />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

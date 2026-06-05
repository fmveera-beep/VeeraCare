"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { VeeraLogo } from "@/components/brand/VeeraLogo";
import { GetAccessSolid } from "@/components/landing/PromoCtas";
import { cn } from "@/lib/utils";

const leftLinks = [
  { href: "/", label: "Home" },
  { href: "/#about", label: "About Us" },
  { href: "/services", label: "Services" },
  { href: "/insights", label: "Insights" },
  { href: "/careers", label: "Careers" },
  { href: "/#industries", label: "Industries" },
  { href: "/#faq", label: "FAQs" },
];

const rightLinks = [
  { href: "/#reviews", label: "Reviews" },
  { href: "/contact", label: "Contact" },
];

const desktopNavLink =
  "relative py-1 text-[13px] font-semibold uppercase tracking-wide text-black transition-colors duration-200 after:pointer-events-none after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:origin-left after:scale-x-0 after:bg-brand after:transition-transform after:duration-200 after:ease-out hover:text-brand hover:after:scale-x-100 motion-safe:hover:-translate-y-px";

const mobileNavLinks = [...leftLinks, ...rightLinks];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [open]);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const onChange = () => setOpen(false);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return (
    <motion.header
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.35, delay: 0.05 }}
      className={cn(
        "sticky top-0 z-50 w-full max-w-[100vw] border-b pt-[env(safe-area-inset-top,0px)] transition-[background-color,box-shadow,backdrop-filter] duration-300",
        scrolled
          ? "border-neutral-200/70 bg-white/90 shadow-md shadow-neutral-900/[0.06] backdrop-blur-md supports-[backdrop-filter]:bg-white/75"
          : "border-neutral-200 bg-white"
      )}
    >
      <nav className="relative flex min-h-[3.75rem] w-full min-w-0 max-w-full items-center gap-2 px-3 py-2 sm:min-h-[4rem] sm:px-4 lg:grid lg:min-h-[5.5rem] lg:grid-cols-[1fr_auto_1fr] lg:items-center lg:gap-4 lg:px-8 xl:min-h-[6.25rem]">
        <Link
          href="/"
          className="flex min-w-0 max-w-[calc(100%-2.75rem)] flex-1 items-center py-0.5 transition-all duration-300 hover:opacity-90 motion-safe:hover:scale-[1.02] motion-safe:active:scale-[0.99] sm:max-w-[calc(100%-3rem)] lg:max-w-none lg:flex-none lg:justify-self-start"
          aria-label="VeeraFM — home"
          onClick={() => setOpen(false)}
        >
          <VeeraLogo variant="compact" tone="dark" className="lg:hidden" />
          <VeeraLogo variant="nav" tone="dark" className="hidden lg:block" />
        </Link>

        <div className="hidden items-center justify-center gap-4 xl:gap-7 lg:flex">
          {leftLinks.map((l) => (
            <Link key={l.href} href={l.href} className={desktopNavLink}>
              {l.label}
            </Link>
          ))}
          {rightLinks.map((l) => (
            <Link key={l.href} href={l.href} className={desktopNavLink}>
              {l.label}
            </Link>
          ))}
        </div>

        <div className="hidden shrink-0 lg:block lg:justify-self-end">
          <GetAccessSolid />
        </div>

        <button
          type="button"
          aria-expanded={open}
          aria-controls="mobile-nav-menu"
          aria-label={open ? "Close menu" : "Open menu"}
          className="ml-auto flex h-10 w-10 shrink-0 items-center justify-center rounded-[4px] border border-black text-black transition-all duration-200 hover:border-brand hover:bg-brand/5 hover:text-brand motion-safe:active:scale-95 sm:h-11 sm:w-11 lg:hidden"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <>
            <motion.button
              key="mobile-nav-backdrop"
              type="button"
              aria-label="Close menu"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-black/35 lg:hidden"
              onClick={() => setOpen(false)}
            />
            <motion.div
              key="mobile-nav-panel"
              id="mobile-nav-menu"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className="relative z-50 overflow-hidden border-t border-neutral-200 bg-white shadow-lg shadow-neutral-900/10 lg:hidden"
            >
              <div className="max-h-[min(72vh,28rem)] overflow-y-auto overscroll-y-contain px-3 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:px-4 sm:py-4">
                <div className="flex flex-col gap-0.5">
                  {mobileNavLinks.map((l) => (
                    <Link
                      key={l.href + l.label}
                      href={l.href}
                      className={cn(
                        "rounded-[4px] px-3 py-3.5 text-[13px] font-semibold uppercase tracking-wide transition-all duration-200 hover:bg-brand/8 hover:text-brand active:bg-brand/10 motion-safe:active:scale-[0.99]"
                      )}
                      onClick={() => setOpen(false)}
                    >
                      {l.label}
                    </Link>
                  ))}
                </div>
                <div className="sticky bottom-0 mt-3 border-t border-neutral-100 bg-white pt-3">
                  <GetAccessSolid className="w-full justify-center px-4 py-3 text-[10px] sm:text-[11px]" />
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

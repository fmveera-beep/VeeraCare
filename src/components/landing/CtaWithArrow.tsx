"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type CtaWithArrowProps = {
  href: string;
  label: string;
  className?: string;
};

export function CtaWithArrow({ href, label, className }: CtaWithArrowProps) {
  return (
    <motion.div
      className="inline-flex max-w-full"
      whileHover={{ y: -3 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link
        href={href}
        className={cn(
          "group/cta inline-flex w-full items-center justify-between gap-3 rounded-[4px] border border-black bg-white px-4 py-3 text-xs font-bold uppercase tracking-[0.18em] text-black transition-all duration-200 hover:border-brand hover:bg-neutral-50 hover:text-brand hover:shadow-lg hover:shadow-brand/10 motion-safe:active:scale-[0.99]",
          className
        )}
      >
        <span>{label}</span>
        <ArrowRight className="h-4 w-4 shrink-0 transition-transform duration-200 group-hover/cta:translate-x-0.5" />
      </Link>
    </motion.div>
  );
}

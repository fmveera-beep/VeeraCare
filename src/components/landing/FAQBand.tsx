"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const faqs = [
  {
    q: "Can you staff both skilled onsite roles and facilities teams?",
    a: "Yes. VeeraFM supports skilled technicians and onsite trades alongside janitors, porters, grounds staff, and maintenance crews often under one coordinated staffing model so coverage stays predictable.",
  },
  {
    q: "How quickly can we fill urgent facilities or cleaning shifts?",
    a: "Most active accounts receive same day or next day bench coverage once routes, roles, and safety expectations are documented. For longer lead roles, we move on a structured shortlist timeline your team approves.",
  },
  {
    q: "Do you support multiple locations and rotating shifts?",
    a: "Yes. We support multi-site facilities programs, centralized coordination, and shift-based coverage with onboarding tailored to active worksites and operational standards.",
  },
];

export function FAQBand() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="bg-[#f9f9f9] pb-20 pt-4 md:pb-28 md:pt-6">
      <div className="mx-auto max-w-[820px] px-4 md:px-8">
        <p className="text-center text-[11px] font-bold uppercase tracking-[0.22em] text-brand">
          FAQs
        </p>
        <h2 className="mt-4 text-center text-3xl font-bold uppercase leading-tight tracking-tight text-neutral-900 md:text-[2rem]">
          Facilities &amp; staffing answers
        </h2>

        <div className="mt-12 space-y-4">
          {faqs.map((item, i) => {
            const isOpen = open === i;
            return (
              <motion.div
                key={item.q}
                layout
                className={`group/faq overflow-hidden rounded-xl border bg-white transition-all duration-300 ${
                  isOpen
                    ? "border-brand/35 shadow-md shadow-brand/10"
                    : "border-neutral-200 shadow-sm hover:border-brand/25 hover:shadow-md"
                }`}
              >
                <button
                  type="button"
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors duration-200 hover:bg-neutral-50/80"
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                >
                  <span className="font-semibold text-neutral-900 transition-colors group-hover/faq:text-neutral-950">
                    {item.q}
                  </span>
                  <motion.span
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 22 }}
                  >
                    <ChevronDown className="h-5 w-5 shrink-0 text-neutral-500 transition-colors duration-200 group-hover/faq:text-brand" />
                  </motion.span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen ? (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.28 }}
                    >
                      <p className="border-t border-neutral-100 px-5 py-4 text-sm leading-relaxed text-neutral-600">
                        {item.a}
                      </p>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

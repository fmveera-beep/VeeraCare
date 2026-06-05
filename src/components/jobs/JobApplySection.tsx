"use client";

import { useState } from "react";
import type { JobPost } from "@/lib/jobs/posts";
import { JobApplyModal } from "@/components/jobs/JobApplyModal";

export function JobApplySection({ job }: { job: JobPost }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <section className="border-t border-neutral-200 bg-[#f6f8ff] py-12 md:py-16">
        <div className="mx-auto max-w-[1320px] px-4 text-center md:px-8">
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="inline-flex items-center justify-center rounded-[4px] bg-brand px-6 py-3 text-[11px] font-bold uppercase tracking-[0.22em] text-white transition-colors hover:bg-brand-navy"
          >
            Apply now
          </button>
          <p className="mt-4 text-lg font-bold text-neutral-950">
            Interested in this role? Submit your details and CV below.
          </p>
        </div>
      </section>

      <JobApplyModal job={job} open={open} onClose={() => setOpen(false)} />
    </>
  );
}

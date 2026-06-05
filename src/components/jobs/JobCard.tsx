import Link from "next/link";
import { ArrowRight, MapPin, Briefcase } from "lucide-react";
import { RemoteImage } from "@/components/media/RemoteImage";
import { cn } from "@/lib/utils";
import type { JobPost } from "@/lib/jobs/posts";

export function JobCard({ job }: { job: JobPost }) {
  const hasImage = Boolean(job.heroImage?.trim());

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm transition-all duration-300 hover:border-brand/25 hover:shadow-lg hover:shadow-brand/10">
      {hasImage ? (
        <div className="relative aspect-[16/10] overflow-hidden bg-neutral-100">
          <RemoteImage
            src={job.heroImage!}
            alt={job.heroImageAlt ?? job.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
          <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-brand">
            {job.category}
          </span>
        </div>
      ) : null}

      <div className="flex flex-1 flex-col p-6 md:p-7">
        {!hasImage ? (
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-brand/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-brand">
              {job.category}
            </span>
            <span className="rounded-full border border-neutral-200 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-neutral-600">
              {job.employmentType}
            </span>
          </div>
        ) : (
          <span className="w-fit rounded-full border border-neutral-200 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-neutral-600">
            {job.employmentType}
          </span>
        )}

        <h2
          className={cn(
            "text-xl font-bold leading-snug tracking-tight text-neutral-950 md:text-[1.35rem]",
            hasImage ? "mt-3" : "mt-4"
          )}
        >
          {job.title}
        </h2>

        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-sm text-neutral-600">
          <span className="inline-flex items-center gap-1.5">
            <MapPin className="h-4 w-4 shrink-0 text-brand" aria-hidden />
            {job.location}
          </span>
          {job.salaryRange ? (
            <span className="inline-flex items-center gap-1.5 font-semibold text-neutral-800">
              <Briefcase className="h-4 w-4 shrink-0 text-brand" aria-hidden />
              {job.salaryRange}
            </span>
          ) : null}
        </div>

        <p className="mt-4 flex-1 text-sm leading-relaxed text-neutral-600">{job.excerpt}</p>

        <Link
          href={`/careers/${job.slug}`}
          className="mt-6 inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-brand transition-colors group-hover:text-brand-navy"
        >
          More details
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
    </article>
  );
}

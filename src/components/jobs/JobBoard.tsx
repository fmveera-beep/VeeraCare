"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import type { JobPost } from "@/lib/jobs/posts";
import { JobCard } from "@/components/jobs/JobCard";

type JobBoardProps = {
  jobs: JobPost[];
  categories: string[];
  locations: string[];
  employmentTypes: string[];
};

export function JobBoard({ jobs, categories, locations, employmentTypes }: JobBoardProps) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [location, setLocation] = useState("all");
  const [employmentType, setEmploymentType] = useState("all");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return jobs.filter((job) => {
      if (category !== "all" && job.category !== category) return false;
      if (location !== "all" && job.location !== location) return false;
      if (employmentType !== "all" && job.employmentType !== employmentType) return false;
      if (!q) return true;
      const haystack = [
        job.title,
        job.excerpt,
        job.category,
        job.location,
        job.employmentType,
        job.salaryRange ?? "",
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [jobs, query, category, location, employmentType]);

  const selectClass =
    "w-full rounded-xl border border-neutral-200 bg-white px-3 py-2.5 text-sm text-neutral-800 focus:border-brand/50 focus:outline-none focus:ring-1 focus:ring-brand/40";

  return (
    <div>
      <div className="rounded-2xl border border-neutral-200 bg-[#f6f8ff] p-4 md:p-6">
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
          <label className="block lg:col-span-2">
            <span className="sr-only">Search jobs</span>
            <span className="relative flex items-center">
              <Search className="pointer-events-none absolute left-3 h-4 w-4 text-neutral-400" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by title, location, or category…"
                className="w-full rounded-xl border border-neutral-200 bg-white py-2.5 pl-10 pr-3 text-sm text-neutral-800 placeholder:text-neutral-400 focus:border-brand/50 focus:outline-none focus:ring-1 focus:ring-brand/40"
              />
            </span>
          </label>

          <label className="block">
            <span className="mb-1 block text-[10px] font-bold uppercase tracking-[0.16em] text-neutral-500">
              Category
            </span>
            <select
              className={selectClass}
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="all">All categories</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="mb-1 block text-[10px] font-bold uppercase tracking-[0.16em] text-neutral-500">
              Location
            </span>
            <select
              className={selectClass}
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            >
              <option value="all">All locations</option>
              {locations.map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </select>
          </label>

          <label className="block md:col-span-2 lg:col-span-4 lg:max-w-xs">
            <span className="mb-1 block text-[10px] font-bold uppercase tracking-[0.16em] text-neutral-500">
              Job type
            </span>
            <select
              className={selectClass}
              value={employmentType}
              onChange={(e) => setEmploymentType(e.target.value)}
            >
              <option value="all">All job types</option>
              {employmentTypes.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      <p className="mt-6 text-sm text-neutral-600">
        Showing{" "}
        <span className="font-semibold text-neutral-900">{filtered.length}</span> of{" "}
        {jobs.length} openings
      </p>

      {filtered.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-dashed border-neutral-300 bg-white px-6 py-14 text-center">
          <p className="text-lg font-bold text-neutral-900">No jobs match your filters</p>
          <p className="mt-2 text-sm text-neutral-600">
            Try clearing search or choosing a different category or location.
          </p>
        </div>
      ) : (
        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {filtered.map((job) => (
            <JobCard key={job.slug} job={job} />
          ))}
        </div>
      )}
    </div>
  );
}

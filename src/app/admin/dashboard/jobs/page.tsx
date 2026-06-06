"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useCmsSession } from "@/components/admin/useCmsSession";
import { cn } from "@/lib/utils";
import type { JobSection } from "@/lib/jobs/posts";
import {
  jobCategoryOptions,
  jobEmploymentTypeOptions,
  jobLocationOptions,
} from "@/lib/jobs/posts";

type CmsJob = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  metaDescription: string;
  category: string;
  location: string;
  employmentType: string;
  salaryRange: string | null;
  heroImage: string | null;
  heroImageAlt: string | null;
  sections: JobSection[];
  requirements: string[];
  benefits: string[];
  published: boolean;
  publishedAt: string;
  order: number;
  updatedAt: string;
};

const adminFetch: RequestInit = { credentials: "include", cache: "no-store" };

const defaultSectionsJson = JSON.stringify(
  [
    {
      paragraphs: [
        "Describe the role, shift pattern, and what candidates can expect on site.",
      ],
    },
  ],
  null,
  2
);

const defaultRequirementsJson = JSON.stringify(
  ["List key requirements, one per line in this array."],
  null,
  2
);

const defaultBenefitsJson = JSON.stringify(
  ["List benefits shown in the apply modal, one per line in this array."],
  null,
  2
);

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function formatWhen(iso: string) {
  try {
    return new Date(iso).toLocaleDateString(undefined, { dateStyle: "medium" });
  } catch {
    return iso;
  }
}

function ModalShell({
  open,
  title,
  children,
  onClose,
}: {
  open: boolean;
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50">
      <button
        type="button"
        aria-label="Close modal"
        className="absolute inset-0 bg-black/65"
        onClick={onClose}
      />
      <div className="relative mx-auto mt-8 max-h-[min(92vh,900px)] w-[min(920px,94vw)] overflow-y-auto rounded-3xl border border-white/10 bg-neutral-950 shadow-2xl">
        <div className="sticky top-0 z-10 flex items-center justify-between gap-3 border-b border-white/10 bg-neutral-950/95 px-5 py-4 backdrop-blur">
          <p className="text-sm font-semibold text-white">{title}</p>
          <Button
            type="button"
            variant="outline"
            className="rounded-2xl border-white/15 bg-transparent text-neutral-100 hover:bg-white/5"
            onClick={onClose}
          >
            Close
          </Button>
        </div>
        <div className="p-5 md:p-7">{children}</div>
      </div>
    </div>
  );
}

const fieldClass =
  "mt-1.5 w-full rounded-xl border border-white/15 bg-neutral-900/80 px-3 py-2.5 text-sm text-white placeholder:text-neutral-500 focus:border-brand/50 focus:outline-none focus:ring-1 focus:ring-brand/40";

export default function AdminManageJobsPage() {
  const { canWrite } = useCmsSession();
  const [items, setItems] = useState<CmsJob[]>([]);
  const [ready, setReady] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const [form, setForm] = useState<{
    slug: string;
    title: string;
    excerpt: string;
    metaDescription: string;
    category: string;
    location: string;
    employmentType: string;
    salaryRange: string;
    heroImage: string;
    heroImageAlt: string;
    sectionsJson: string;
    requirementsJson: string;
    benefitsJson: string;
    published: boolean;
    publishedAt: string;
    order: string;
  }>({
    slug: "",
    title: "",
    excerpt: "",
    metaDescription: "",
    category: jobCategoryOptions[0],
    location: jobLocationOptions[0],
    employmentType: jobEmploymentTypeOptions[0],
    salaryRange: "",
    heroImage: "",
    heroImageAlt: "",
    sectionsJson: defaultSectionsJson,
    requirementsJson: defaultRequirementsJson,
    benefitsJson: defaultBenefitsJson,
    published: true,
    publishedAt: new Date().toISOString().slice(0, 10),
    order: "0",
  });

  const loadItems = useCallback(async () => {
    setLoadError(null);
    const res = await fetch("/api/admin/jobs", adminFetch);
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(
        res.status === 401
          ? "Not authorized. Sign in again."
          : `Could not load jobs (${res.status}). ${text.slice(0, 120)}`
      );
    }
    const data = (await res.json()) as { items?: CmsJob[] };
    setItems(Array.isArray(data.items) ? data.items : []);
  }, []);

  useEffect(() => {
    loadItems()
      .catch((e) => {
        setItems([]);
        setLoadError(e instanceof Error ? e.message : "Failed to load jobs.");
      })
      .finally(() => setReady(true));
  }, [loadItems]);

  const stats = useMemo(
    () => ({
      total: items.length,
      published: items.filter((i) => i.published).length,
    }),
    [items]
  );

  async function uploadJobImage(file: File) {
    setUploadError(null);
    setUploadingImage(true);
    try {
      const body = new FormData();
      body.append("file", file);
      const res = await fetch("/api/admin/uploads/job-image", {
        ...adminFetch,
        method: "POST",
        body,
      });
      const data = (await res.json().catch(() => null)) as { url?: string; error?: string } | null;
      if (!res.ok || !data?.url) {
        throw new Error(data?.error ?? "Upload failed. Try a JPG, PNG, WebP, or GIF under 5 MB.");
      }
      setForm((f) => ({
        ...f,
        heroImage: data.url!,
        heroImageAlt: f.heroImageAlt || f.title,
      }));
    } catch (e) {
      setUploadError(e instanceof Error ? e.message : "Upload failed.");
    } finally {
      setUploadingImage(false);
    }
  }

  function openAdd() {
    setEditingId(null);
    setFormError(null);
    setUploadError(null);
    setForm({
      slug: "",
      title: "",
      excerpt: "",
      metaDescription: "",
      category: jobCategoryOptions[0],
      location: jobLocationOptions[0],
      employmentType: jobEmploymentTypeOptions[0],
      salaryRange: "",
      heroImage: "",
      heroImageAlt: "",
      sectionsJson: defaultSectionsJson,
      requirementsJson: defaultRequirementsJson,
      benefitsJson: defaultBenefitsJson,
      published: true,
      publishedAt: new Date().toISOString().slice(0, 10),
      order: String(items.length),
    });
    setModalOpen(true);
  }

  function openEdit(item: CmsJob) {
    setEditingId(item.id);
    setFormError(null);
    setUploadError(null);
    setForm({
      slug: item.slug,
      title: item.title,
      excerpt: item.excerpt,
      metaDescription: item.metaDescription,
      category: item.category,
      location: item.location,
      employmentType: item.employmentType,
      salaryRange: item.salaryRange ?? "",
      heroImage: item.heroImage ?? "",
      heroImageAlt: item.heroImageAlt ?? "",
      sectionsJson: JSON.stringify(item.sections, null, 2),
      requirementsJson: JSON.stringify(item.requirements, null, 2),
      benefitsJson: JSON.stringify(item.benefits ?? [], null, 2),
      published: item.published,
      publishedAt: item.publishedAt.slice(0, 10),
      order: String(item.order),
    });
    setModalOpen(true);
  }

  async function remove(id: string) {
    const res = await fetch(`/api/admin/jobs?id=${encodeURIComponent(id)}`, {
      ...adminFetch,
      method: "DELETE",
    });
    if (!res.ok) return;
    setItems((current) => current.filter((i) => i.id !== id));
  }

  async function upsert() {
    setFormError(null);
    let sections: JobSection[];
    let requirements: string[];
    let benefits: string[];
    try {
      const parsedSections = JSON.parse(form.sectionsJson) as unknown;
      if (!Array.isArray(parsedSections)) throw new Error("sections");
      sections = parsedSections as JobSection[];

      const parsedReqs = JSON.parse(form.requirementsJson) as unknown;
      if (!Array.isArray(parsedReqs)) throw new Error("requirements");
      requirements = parsedReqs.filter((r): r is string => typeof r === "string");

      const parsedBenefits = JSON.parse(form.benefitsJson) as unknown;
      if (!Array.isArray(parsedBenefits)) throw new Error("benefits");
      benefits = parsedBenefits.filter((r): r is string => typeof r === "string");
    } catch {
      setFormError(
        "Sections must be a JSON array of { heading?, paragraphs[] }. Requirements and benefits must be JSON string arrays."
      );
      return;
    }

    const payload = {
      slug: form.slug || slugify(form.title),
      title: form.title,
      excerpt: form.excerpt,
      metaDescription: form.metaDescription,
      category: form.category,
      location: form.location,
      employmentType: form.employmentType,
      salaryRange: form.salaryRange.trim() || null,
      heroImage: form.heroImage.trim() || null,
      heroImageAlt: form.heroImageAlt.trim() || null,
      sections,
      requirements,
      benefits,
      published: form.published,
      publishedAt: form.publishedAt,
      order: Number(form.order) || 0,
    };

    const res = await fetch("/api/admin/jobs", {
      ...adminFetch,
      method: editingId ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editingId ? { id: editingId, ...payload } : payload),
    });

    if (!res.ok) {
      const data = (await res.json().catch(() => null)) as { error?: string } | null;
      setFormError(data?.error ?? "Save failed. Check required fields and slug uniqueness.");
      return;
    }

    await loadItems();
    setModalOpen(false);
  }

  return (
    <div className="space-y-6">
      {loadError ? (
        <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">
          <p className="font-semibold text-amber-50">Could not load jobs</p>
          <p className="mt-1 text-amber-100/90">{loadError}</p>
        </div>
      ) : null}

      <div className="rounded-3xl border border-white/10 bg-white/5 p-6 md:p-7">
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-neutral-400">
              Manage Jobs
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight">Job portal</h1>
            <p className="mt-2 text-sm text-neutral-300">
              Published on <span className="text-white">/careers</span>. Total:{" "}
              <span className="font-semibold text-white">{ready ? stats.total : "—"}</span> (
              {stats.published} live)
              {!canWrite ? (
                <span className="mt-2 block text-amber-200/90">
                  View-only access — contact an admin to add or edit jobs.
                </span>
              ) : null}
            </p>
          </div>
          {canWrite ? (
          <div className="flex flex-wrap items-center gap-2">
            <Button
              type="button"
              variant="outline"
              className="rounded-2xl border-white/15 bg-transparent text-neutral-100 hover:bg-white/5"
              onClick={() => {
                fetch("/api/admin/jobs?reset=1", { ...adminFetch, method: "POST" })
                  .then((r) => (r.ok ? r.json() : Promise.reject()))
                  .then((data: { items: CmsJob[] }) => setItems(data.items))
                  .catch(() => {});
              }}
            >
              Reset to defaults
            </Button>
            <Button type="button" className="rounded-2xl" onClick={openAdd}>
              Add job
            </Button>
          </div>
          ) : null}
        </div>
      </div>

      <div className="overflow-hidden rounded-3xl border border-white/10 bg-neutral-950">
        <div className="border-b border-white/10 bg-white/5 px-5 py-4">
          <p className="text-sm font-semibold text-white">Current openings</p>
          <p className="mt-1 text-xs text-neutral-400">
            Drafts are hidden on the public job portal.
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[960px] border-collapse">
            <thead>
              <tr className="border-b border-white/10 text-left text-xs uppercase tracking-wide text-neutral-400">
                <th className="px-5 py-3 font-semibold">Title</th>
                <th className="px-5 py-3 font-semibold">Category</th>
                <th className="px-5 py-3 font-semibold">Location</th>
                <th className="px-5 py-3 font-semibold">Salary</th>
                <th className="px-5 py-3 font-semibold">Image</th>
                <th className="px-5 py-3 font-semibold">Status</th>
                {canWrite ? (
                  <th className="px-5 py-3 font-semibold">Actions</th>
                ) : (
                  <th className="px-5 py-3 font-semibold">Link</th>
                )}
              </tr>
            </thead>
            <tbody>
              {!ready ? (
                <tr>
                  <td colSpan={7} className="px-5 py-8 text-sm text-neutral-400">
                    Loading…
                  </td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-8 text-sm text-neutral-400">
                    No jobs yet.
                  </td>
                </tr>
              ) : (
                items.map((item) => (
                  <tr key={item.id} className="border-b border-white/5 text-sm text-neutral-200">
                    <td className="max-w-[240px] px-5 py-4 font-medium text-white">
                      {item.title}
                    </td>
                    <td className="px-5 py-4">{item.category}</td>
                    <td className="px-5 py-4">{item.location}</td>
                    <td className="px-5 py-4">{item.salaryRange ?? "—"}</td>
                    <td className="px-5 py-4 text-xs text-neutral-400">
                      {item.heroImage ? "Yes" : "—"}
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={cn(
                          "rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide",
                          item.published
                            ? "bg-emerald-500/15 text-emerald-300"
                            : "bg-amber-500/15 text-amber-200"
                        )}
                      >
                        {item.published ? "Published" : "Draft"}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex flex-wrap gap-2">
                        {item.published ? (
                          <Link
                            href={`/careers/${item.slug}`}
                            target="_blank"
                            className="text-xs font-semibold text-brand hover:underline"
                          >
                            View
                          </Link>
                        ) : canWrite ? null : (
                          <span className="text-xs text-neutral-500">Draft</span>
                        )}
                        {canWrite ? (
                          <>
                            <button
                              type="button"
                              className="text-xs font-semibold text-white hover:underline"
                              onClick={() => openEdit(item)}
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              className="text-xs font-semibold text-red-300 hover:underline"
                              onClick={() => remove(item.id)}
                            >
                              Delete
                            </button>
                          </>
                        ) : null}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {canWrite ? (
      <ModalShell
        open={modalOpen}
        title={editingId ? "Edit job" : "Add job"}
        onClose={() => setModalOpen(false)}
      >
        <div className="grid gap-4 md:grid-cols-2">
          <label className="block md:col-span-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-neutral-400">
              Job title
            </span>
            <input
              className={fieldClass}
              value={form.title}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  title: e.target.value,
                  slug: f.slug || slugify(e.target.value),
                }))
              }
            />
          </label>
          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-wide text-neutral-400">
              Slug (URL)
            </span>
            <input
              className={fieldClass}
              value={form.slug}
              onChange={(e) => setForm((f) => ({ ...f, slug: slugify(e.target.value) }))}
            />
          </label>
          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-wide text-neutral-400">
              Published date
            </span>
            <input
              type="date"
              className={fieldClass}
              value={form.publishedAt}
              onChange={(e) => setForm((f) => ({ ...f, publishedAt: e.target.value }))}
            />
          </label>
          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-wide text-neutral-400">
              Category
            </span>
            <select
              className={fieldClass}
              value={form.category}
              onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
            >
              {jobCategoryOptions.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-wide text-neutral-400">
              Location
            </span>
            <select
              className={fieldClass}
              value={form.location}
              onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
            >
              {jobLocationOptions.map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-wide text-neutral-400">
              Employment type
            </span>
            <select
              className={fieldClass}
              value={form.employmentType}
              onChange={(e) => setForm((f) => ({ ...f, employmentType: e.target.value }))}
            >
              {jobEmploymentTypeOptions.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-wide text-neutral-400">
              Salary range (display)
            </span>
            <input
              className={fieldClass}
              placeholder="e.g. AED 2,200"
              value={form.salaryRange}
              onChange={(e) => setForm((f) => ({ ...f, salaryRange: e.target.value }))}
            />
          </label>
          <div className="md:col-span-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-neutral-400">
              Job image <span className="text-neutral-500">(optional)</span>
            </span>
            <div className="mt-2 flex flex-wrap items-center gap-3">
              <label className="inline-flex cursor-pointer items-center justify-center rounded-2xl bg-brand px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand/90 has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-60">
                {uploadingImage ? "Uploading…" : "Upload image"}
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  className="sr-only"
                  disabled={uploadingImage}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) void uploadJobImage(file);
                    e.target.value = "";
                  }}
                />
              </label>
              <span className="text-xs text-neutral-500">JPG, PNG, WebP, or GIF · max 5 MB</span>
            </div>
            <label className="mt-4 block">
              <span className="text-xs text-neutral-500">Or paste image URL</span>
              <input
                className={fieldClass}
                placeholder="https://…"
                value={form.heroImage}
                onChange={(e) => setForm((f) => ({ ...f, heroImage: e.target.value }))}
              />
            </label>
            {uploadError ? (
              <p className="mt-2 text-sm text-amber-300" role="alert">
                {uploadError}
              </p>
            ) : null}
          </div>
          <label className="block md:col-span-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-neutral-400">
              Image alt text <span className="text-neutral-500">(optional)</span>
            </span>
            <input
              className={fieldClass}
              placeholder="Describe the image for accessibility"
              value={form.heroImageAlt}
              onChange={(e) => setForm((f) => ({ ...f, heroImageAlt: e.target.value }))}
            />
          </label>
          {form.heroImage.trim() ? (
            <div className="md:col-span-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-neutral-400">
                Preview
              </p>
              <div className="mt-2 flex flex-wrap items-start gap-3">
                <div className="relative h-28 w-44 overflow-hidden rounded-xl border border-white/15 bg-neutral-900">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={form.heroImage.trim()}
                    alt={form.heroImageAlt.trim() || "Job image preview"}
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                </div>
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-2xl border-white/15 bg-transparent text-neutral-300 hover:bg-white/5"
                  onClick={() => setForm((f) => ({ ...f, heroImage: "", heroImageAlt: "" }))}
                >
                  Remove image
                </Button>
              </div>
            </div>
          ) : null}
          <label className="block md:col-span-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-neutral-400">
              Short excerpt
            </span>
            <textarea
              className={cn(fieldClass, "min-h-[80px]")}
              value={form.excerpt}
              onChange={(e) => setForm((f) => ({ ...f, excerpt: e.target.value }))}
            />
          </label>
          <label className="block md:col-span-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-neutral-400">
              Meta description (SEO)
            </span>
            <textarea
              className={cn(fieldClass, "min-h-[72px]")}
              value={form.metaDescription}
              onChange={(e) => setForm((f) => ({ ...f, metaDescription: e.target.value }))}
            />
          </label>
          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-wide text-neutral-400">
              Sort order
            </span>
            <input
              type="number"
              className={fieldClass}
              value={form.order}
              onChange={(e) => setForm((f) => ({ ...f, order: e.target.value }))}
            />
          </label>
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={form.published}
              onChange={(e) => setForm((f) => ({ ...f, published: e.target.checked }))}
              className="h-4 w-4 rounded border-white/20"
            />
            <span className="text-sm text-neutral-200">Published</span>
          </label>
          <label className="block md:col-span-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-neutral-400">
              Requirements (JSON array of strings)
            </span>
            <textarea
              className={cn(fieldClass, "min-h-[120px] font-mono text-xs")}
              value={form.requirementsJson}
              onChange={(e) => setForm((f) => ({ ...f, requirementsJson: e.target.value }))}
            />
          </label>
          <label className="block md:col-span-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-neutral-400">
              Benefits (JSON array of strings, shown in apply modal)
            </span>
            <textarea
              className={cn(fieldClass, "min-h-[100px] font-mono text-xs")}
              value={form.benefitsJson}
              onChange={(e) => setForm((f) => ({ ...f, benefitsJson: e.target.value }))}
            />
          </label>
          <label className="block md:col-span-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-neutral-400">
              Job description sections (JSON)
            </span>
            <textarea
              className={cn(fieldClass, "min-h-[220px] font-mono text-xs")}
              value={form.sectionsJson}
              onChange={(e) => setForm((f) => ({ ...f, sectionsJson: e.target.value }))}
            />
          </label>
        </div>

        {formError ? (
          <p className="mt-4 text-sm text-amber-300" role="alert">
            {formError}
          </p>
        ) : null}

        <div className="mt-6 flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            className="rounded-2xl border-white/15 bg-transparent text-neutral-100"
            onClick={() => setModalOpen(false)}
          >
            Cancel
          </Button>
          <Button type="button" className="rounded-2xl" onClick={() => upsert()}>
            Save job
          </Button>
        </div>
      </ModalShell>
      ) : null}
    </div>
  );
}

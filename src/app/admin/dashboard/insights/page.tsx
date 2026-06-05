"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { InsightSection } from "@/lib/insights/posts";

type CmsInsight = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  metaDescription: string;
  publishedAt: string;
  readTimeMinutes: number;
  category: string;
  heroImage: string;
  heroImageAlt: string | null;
  author: string;
  sections: InsightSection[];
  published: boolean;
  order: number;
  updatedAt: string;
};

const adminFetch: RequestInit = { credentials: "include", cache: "no-store" };

const defaultSectionsJson = JSON.stringify(
  [
    {
      paragraphs: [
        "Add your opening paragraphs here. Each section can include an optional heading.",
      ],
    },
  ],
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

export default function AdminManageInsightsPage() {
  const [items, setItems] = useState<CmsInsight[]>([]);
  const [ready, setReady] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const [form, setForm] = useState({
    slug: "",
    title: "",
    excerpt: "",
    metaDescription: "",
    publishedAt: new Date().toISOString().slice(0, 10),
    readTimeMinutes: "7",
    category: "Workforce Strategy",
    heroImage: "",
    heroImageAlt: "",
    author: "VeeraFM Insights",
    sectionsJson: defaultSectionsJson,
    published: true,
    order: "0",
  });

  const loadItems = useCallback(async () => {
    setLoadError(null);
    const res = await fetch("/api/admin/insights", adminFetch);
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(
        res.status === 401
          ? "Not authorized. Sign in again."
          : `Could not load insights (${res.status}). ${text.slice(0, 120)}`
      );
    }
    const data = (await res.json()) as { items?: CmsInsight[] };
    setItems(Array.isArray(data.items) ? data.items : []);
  }, []);

  useEffect(() => {
    loadItems()
      .catch((e) => {
        setItems([]);
        setLoadError(e instanceof Error ? e.message : "Failed to load insights.");
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

  function openAdd() {
    setEditingId(null);
    setFormError(null);
    setForm({
      slug: "",
      title: "",
      excerpt: "",
      metaDescription: "",
      publishedAt: new Date().toISOString().slice(0, 10),
      readTimeMinutes: "7",
      category: "Workforce Strategy",
      heroImage:
        "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=2000&q=82",
      heroImageAlt: "",
      author: "VeeraFM Insights",
      sectionsJson: defaultSectionsJson,
      published: true,
      order: String(items.length),
    });
    setModalOpen(true);
  }

  function openEdit(item: CmsInsight) {
    setEditingId(item.id);
    setFormError(null);
    setForm({
      slug: item.slug,
      title: item.title,
      excerpt: item.excerpt,
      metaDescription: item.metaDescription,
      publishedAt: item.publishedAt.slice(0, 10),
      readTimeMinutes: String(item.readTimeMinutes),
      category: item.category,
      heroImage: item.heroImage,
      heroImageAlt: item.heroImageAlt ?? "",
      author: item.author,
      sectionsJson: JSON.stringify(item.sections, null, 2),
      published: item.published,
      order: String(item.order),
    });
    setModalOpen(true);
  }

  async function remove(id: string) {
    const res = await fetch(`/api/admin/insights?id=${encodeURIComponent(id)}`, {
      ...adminFetch,
      method: "DELETE",
    });
    if (!res.ok) return;
    setItems((current) => current.filter((i) => i.id !== id));
  }

  async function upsert() {
    setFormError(null);
    let sections: InsightSection[];
    try {
      const parsed = JSON.parse(form.sectionsJson) as unknown;
      if (!Array.isArray(parsed)) throw new Error("Sections must be a JSON array");
      sections = parsed as InsightSection[];
    } catch {
      setFormError("Sections JSON is invalid. Use an array of { heading?, paragraphs[] }.");
      return;
    }

    const payload = {
      slug: form.slug || slugify(form.title),
      title: form.title,
      excerpt: form.excerpt,
      metaDescription: form.metaDescription,
      publishedAt: form.publishedAt,
      readTimeMinutes: Number(form.readTimeMinutes) || 5,
      category: form.category,
      heroImage: form.heroImage,
      heroImageAlt: form.heroImageAlt || null,
      author: form.author,
      sections,
      published: form.published,
      order: Number(form.order) || 0,
    };

    const res = await fetch("/api/admin/insights", {
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
          <p className="font-semibold text-amber-50">Could not load insights</p>
          <p className="mt-1 text-amber-100/90">{loadError}</p>
        </div>
      ) : null}

      <div className="rounded-3xl border border-white/10 bg-white/5 p-6 md:p-7">
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-neutral-400">
              Manage Insights
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight">Blog articles</h1>
            <p className="mt-2 text-sm text-neutral-300">
              Published on <span className="text-white">/insights</span> and the homepage
              preview. Total:{" "}
              <span className="font-semibold text-white">{ready ? stats.total : "—"}</span>{" "}
              ({stats.published} live)
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button
              type="button"
              variant="outline"
              className="rounded-2xl border-white/15 bg-transparent text-neutral-100 hover:bg-white/5"
              onClick={() => {
                fetch("/api/admin/insights?reset=1", { ...adminFetch, method: "POST" })
                  .then((r) => (r.ok ? r.json() : Promise.reject()))
                  .then((data: { items: CmsInsight[] }) => setItems(data.items))
                  .catch(() => {});
              }}
            >
              Reset to defaults
            </Button>
            <Button type="button" className="rounded-2xl" onClick={openAdd}>
              Add article
            </Button>
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-3xl border border-white/10 bg-neutral-950">
        <div className="border-b border-white/10 bg-white/5 px-5 py-4">
          <p className="text-sm font-semibold text-white">Current articles</p>
          <p className="mt-1 text-xs text-neutral-400">
            Drafts (unpublished) are hidden on the public site.
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[960px] border-collapse">
            <thead>
              <tr className="border-b border-white/10 text-left text-xs uppercase tracking-wide text-neutral-400">
                <th className="px-5 py-3 font-semibold">Title</th>
                <th className="px-5 py-3 font-semibold">Slug</th>
                <th className="px-5 py-3 font-semibold">Category</th>
                <th className="px-5 py-3 font-semibold">Date</th>
                <th className="px-5 py-3 font-semibold">Status</th>
                <th className="px-5 py-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {!ready ? (
                <tr>
                  <td colSpan={6} className="px-5 py-8 text-sm text-neutral-400">
                    Loading…
                  </td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-8 text-sm text-neutral-400">
                    No articles yet.
                  </td>
                </tr>
              ) : (
                items.map((item) => (
                  <tr key={item.id} className="border-b border-white/5 text-sm text-neutral-200">
                    <td className="max-w-[240px] px-5 py-4 font-medium text-white">
                      {item.title}
                    </td>
                    <td className="px-5 py-4 font-mono text-xs text-neutral-400">{item.slug}</td>
                    <td className="px-5 py-4">{item.category}</td>
                    <td className="px-5 py-4">{formatWhen(item.publishedAt)}</td>
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
                            href={`/insights/${item.slug}`}
                            target="_blank"
                            className="text-xs font-semibold text-brand hover:underline"
                          >
                            View
                          </Link>
                        ) : null}
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
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ModalShell
        open={modalOpen}
        title={editingId ? "Edit article" : "Add article"}
        onClose={() => setModalOpen(false)}
      >
        <div className="grid gap-4 md:grid-cols-2">
          <label className="block md:col-span-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-neutral-400">
              Title
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
              Category
            </span>
            <input
              className={fieldClass}
              value={form.category}
              onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
            />
          </label>
          <label className="block md:col-span-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-neutral-400">
              Excerpt
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
              Read time (minutes)
            </span>
            <input
              type="number"
              min={1}
              className={fieldClass}
              value={form.readTimeMinutes}
              onChange={(e) => setForm((f) => ({ ...f, readTimeMinutes: e.target.value }))}
            />
          </label>
          <label className="block md:col-span-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-neutral-400">
              Hero image URL
            </span>
            <input
              className={fieldClass}
              value={form.heroImage}
              onChange={(e) => setForm((f) => ({ ...f, heroImage: e.target.value }))}
            />
          </label>
          <label className="block md:col-span-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-neutral-400">
              Hero image alt text
            </span>
            <input
              className={fieldClass}
              value={form.heroImageAlt}
              onChange={(e) => setForm((f) => ({ ...f, heroImageAlt: e.target.value }))}
            />
          </label>
          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-wide text-neutral-400">
              Author
            </span>
            <input
              className={fieldClass}
              value={form.author}
              onChange={(e) => setForm((f) => ({ ...f, author: e.target.value }))}
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
          <label className="flex items-center gap-3 md:col-span-2">
            <input
              type="checkbox"
              checked={form.published}
              onChange={(e) => setForm((f) => ({ ...f, published: e.target.checked }))}
              className="h-4 w-4 rounded border-white/20"
            />
            <span className="text-sm text-neutral-200">Published (visible on public site)</span>
          </label>
          <label className="block md:col-span-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-neutral-400">
              Body sections (JSON)
            </span>
            <textarea
              className={cn(fieldClass, "min-h-[220px] font-mono text-xs")}
              value={form.sectionsJson}
              onChange={(e) => setForm((f) => ({ ...f, sectionsJson: e.target.value }))}
            />
            <p className="mt-2 text-xs text-neutral-500">
              Array of objects: {"{ \"heading?\": \"...\", \"paragraphs\": [\"...\"] }"}
            </p>
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
            Save article
          </Button>
        </div>
      </ModalShell>
    </div>
  );
}

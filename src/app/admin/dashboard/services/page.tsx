"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ServiceCategory =
  | "Domestic & Care"
  | "Cleaning & Facilities"
  | "Construction"
  | "Events & Hospitality"
  | "Security"
  | "Corporate Support";

type CmsService = {
  id: string;
  title: string;
  category: ServiceCategory;
  description: string;
  imageUrl: string;
  updatedAt: string;
};

const categories: readonly ServiceCategory[] = [
  "Domestic & Care",
  "Cleaning & Facilities",
  "Construction",
  "Events & Hospitality",
  "Security",
  "Corporate Support",
];

function nowIso() {
  return new Date().toISOString();
}

function safeParseServices(raw: string | null): CmsService[] | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return null;
    const ok = parsed.every(
      (s) =>
        s &&
        typeof s === "object" &&
        typeof (s as any).id === "string" &&
        typeof (s as any).title === "string" &&
        typeof (s as any).category === "string" &&
        typeof (s as any).description === "string" &&
        typeof (s as any).imageUrl === "string" &&
        typeof (s as any).updatedAt === "string"
    );
    return ok ? (parsed as CmsService[]) : null;
  } catch {
    return null;
  }
}

function makeIdFromTitle(title: string) {
  const base = title
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
  return `svc_${base || "service"}_${Math.random().toString(16).slice(2, 8)}`;
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
      <div className="relative mx-auto mt-14 w-[min(760px,92vw)] rounded-3xl border border-white/10 bg-neutral-950 shadow-2xl shadow-black/70">
        <div className="pointer-events-none absolute inset-0 rounded-3xl bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_55%)]" />
        <div className="relative flex items-center justify-between gap-3 border-b border-white/10 px-5 py-4">
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-white">{title}</p>
            <p className="mt-1 text-xs text-neutral-400">
              Changes save to your database after you confirm.
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            className="rounded-2xl border-white/15 bg-transparent text-neutral-100 hover:border-white/25 hover:bg-white/5 hover:text-white"
            onClick={onClose}
          >
            Close
          </Button>
        </div>
        <div className="relative p-5 md:p-7">{children}</div>
      </div>
    </div>
  );
}

const adminFetch: RequestInit = { credentials: "include", cache: "no-store" };

export default function AdminManageServicesPage() {
  const [services, setServices] = useState<CmsService[]>([]);
  const [ready, setReady] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const editing = useMemo(
    () => services.find((s) => s.id === editingId) || null,
    [editingId, services]
  );

  const [form, setForm] = useState<{
    title: string;
    category: ServiceCategory;
    description: string;
    imageUrl: string;
  }>({
    title: "",
    category: "Domestic & Care",
    description: "",
    imageUrl: "",
  });

  useEffect(() => {
    (async () => {
      setLoadError(null);
      const res = await fetch("/api/admin/services", adminFetch);
      if (!res.ok) {
        if (res.status === 401) {
          setLoadError(
            "Not authorized (401). Sign out and sign in again, or confirm Neon Auth env vars and the CMS allowlist (SOURCE_ADMIN_EMAILS / ADMIN_EMAIL)."
          );
        } else {
          const text = await res.text().catch(() => "");
          setLoadError(
            `Could not load services (${res.status}). ${text.slice(0, 200)} Check DATABASE_URL and Vercel logs.`
          );
        }
        setServices([]);
        setReady(true);
        return;
      }
      const data = (await res.json()) as { items?: CmsService[] };
      setServices(Array.isArray(data.items) ? data.items : []);
      setReady(true);
    })().catch((e) => {
      setServices([]);
      setLoadError(
        e instanceof Error ? e.message : "Network error loading services."
      );
      setReady(true);
    });
  }, []);

  useEffect(() => {
    // DB-backed now — no localStorage persistence needed.
  }, [ready, services]);

  function openAdd() {
    setEditingId(null);
    setForm({
      title: "",
      category: "Domestic & Care",
      description: "",
      imageUrl: "",
    });
    setModalOpen(true);
  }

  function openEdit(s: CmsService) {
    setEditingId(s.id);
    setForm({
      title: s.title,
      category: s.category,
      description: s.description,
      imageUrl: s.imageUrl,
    });
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
  }

  function upsert() {
    const title = form.title.trim();
    const description = form.description.trim();
    const imageUrl = form.imageUrl.trim();

    if (!title || !description || !imageUrl) return;

    (async () => {
      if (editingId) {
        const res = await fetch("/api/admin/services", {
          ...adminFetch,
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: editingId,
            title,
            category: form.category,
            description,
            imageUrl,
          }),
        });
        if (!res.ok) throw new Error("Update failed");
      } else {
        const res = await fetch("/api/admin/services", {
          ...adminFetch,
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title,
            category: form.category,
            description,
            imageUrl,
          }),
        });
        if (!res.ok) throw new Error("Create failed");
      }
      const refreshed = await fetch("/api/admin/services", adminFetch);
      const data = (await refreshed.json()) as { items: CmsService[] };
      setServices(data.items);
      setModalOpen(false);
    })().catch(() => {});
  }

  function remove(id: string) {
    (async () => {
      const res = await fetch(`/api/admin/services?id=${encodeURIComponent(id)}`, {
        ...adminFetch,
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Delete failed");
      setServices((current) => current.filter((s) => s.id !== id));
    })().catch(() => {});
  }

  const stats = useMemo(() => {
    const byCategory = new Map<ServiceCategory, number>();
    for (const c of categories) byCategory.set(c, 0);
    for (const s of services) {
      byCategory.set(s.category, (byCategory.get(s.category) || 0) + 1);
    }
    return { total: services.length, byCategory };
  }, [services]);

  return (
    <div className="space-y-6">
      {loadError ? (
        <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">
          <p className="font-semibold text-amber-50">Could not load catalog</p>
          <p className="mt-1 text-amber-100/90">{loadError}</p>
          <p className="mt-2 text-xs text-amber-200/80">
            Empty catalog after login usually means the API returned 401 (check{" "}
            <code className="rounded bg-black/30 px-1">NEON_AUTH_*</code>,{" "}
            <code className="rounded bg-black/30 px-1">SOURCE_ADMIN_EMAILS</code> /{" "}
            <code className="rounded bg-black/30 px-1">ADMIN_EMAIL</code>) or the DB is unreachable (check{" "}
            <code className="rounded bg-black/30 px-1">DATABASE_URL</code>). After
            fixing env vars, use &quot;Reset to defaults&quot; to seed rows.
          </p>
        </div>
      ) : null}
      <div className="rounded-3xl border border-white/10 bg-white/5 p-6 md:p-7">
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-neutral-400">
              Manage Services
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight">
              Services catalog
            </h1>
            <p className="mt-2 text-sm text-neutral-300">
              Edit services catalog (live site pulls from DB). Total:{" "}
              <span className="font-semibold text-white">{stats.total}</span>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              className="rounded-2xl border-white/15 bg-transparent text-neutral-100 hover:border-white/25 hover:bg-white/5 hover:text-white"
              onClick={() => {
                (async () => {
                  const res = await fetch("/api/admin/services?reset=1", {
                    ...adminFetch,
                    method: "POST",
                  });
                  if (!res.ok) throw new Error("Reset failed");
                  const data = (await res.json()) as { items: CmsService[] };
                  setServices(data.items);
                })().catch(() => {});
              }}
            >
              Reset to defaults
            </Button>
            <Button type="button" onClick={openAdd} className="rounded-2xl">
              Add New Service
            </Button>
          </div>
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-3">
          {categories.map((c) => (
            <div
              key={c}
              className="rounded-2xl border border-white/10 bg-neutral-900/35 p-4"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-400">
                {c}
              </p>
              <p className="mt-2 text-2xl font-bold text-white">
                {stats.byCategory.get(c) || 0}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="overflow-hidden rounded-3xl border border-white/10 bg-neutral-950">
        <div className="border-b border-white/10 bg-white/5 px-5 py-4">
          <p className="text-sm font-semibold text-white">Current services</p>
          <p className="mt-1 text-xs text-neutral-400">
            Edits persist in the database; refresh /services to verify.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[980px] border-collapse">
            <thead>
              <tr className="text-left text-xs font-semibold uppercase tracking-[0.18em] text-neutral-400">
                <th className="px-5 py-3">Service</th>
                <th className="px-5 py-3">Category</th>
                <th className="px-5 py-3">Image</th>
                <th className="px-5 py-3">Last update</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {services.map((s) => (
                <tr
                  key={s.id}
                  className={cn(
                    "border-t border-white/10 text-sm text-neutral-200",
                    "odd:bg-white/[0.02] hover:bg-white/5"
                  )}
                >
                  <td className="px-5 py-4">
                    <p className="font-semibold text-white">{s.title}</p>
                    <p className="mt-1 line-clamp-2 text-xs text-neutral-400">
                      {s.description}
                    </p>
                  </td>
                  <td className="px-5 py-4">
                    <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-neutral-100">
                      {s.category}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="max-w-[380px]">
                      <p className="truncate text-xs text-neutral-300">
                        {s.imageUrl}
                      </p>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <p className="text-xs text-neutral-300">
                      {new Date(s.updatedAt).toLocaleString()}
                    </p>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        className="rounded-2xl border-white/15 bg-transparent text-neutral-100 hover:border-white/25 hover:bg-white/5 hover:text-white"
                        onClick={() => openEdit(s)}
                      >
                        Edit
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        className="rounded-2xl border-red-500/25 bg-transparent text-red-200 hover:border-red-500/40 hover:bg-red-500/10 hover:text-red-100"
                        onClick={() => remove(s.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {services.length === 0 ? (
                <tr className="border-t border-white/10">
                  <td className="px-5 py-8 text-sm text-neutral-400" colSpan={5}>
                    No services yet. Click <span className="text-white">Add New Service</span>.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>

      <ModalShell
        open={modalOpen}
        title={editing ? `Edit: ${editing.title}` : "Add new service"}
        onClose={closeModal}
      >
        <div className="grid gap-4 md:grid-cols-2">
          <label className="block md:col-span-1">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-400">
              Service Title
            </span>
            <input
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              className="mt-2 w-full rounded-2xl border border-white/10 bg-neutral-950/55 px-4 py-3 text-sm text-neutral-100 outline-none transition focus:border-white/20 focus:bg-neutral-950/80"
              placeholder="e.g., Housemaid"
            />
          </label>

          <label className="block md:col-span-1">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-400">
              Category
            </span>
            <select
              value={form.category}
              onChange={(e) =>
                setForm((f) => ({ ...f, category: e.target.value as ServiceCategory }))
              }
              className="mt-2 w-full rounded-2xl border border-white/10 bg-neutral-950/55 px-4 py-3 text-sm text-neutral-100 outline-none transition focus:border-white/20 focus:bg-neutral-950/80"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>

          <label className="block md:col-span-2">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-400">
              Description
            </span>
            <textarea
              value={form.description}
              onChange={(e) =>
                setForm((f) => ({ ...f, description: e.target.value }))
              }
              rows={4}
              className="mt-2 w-full resize-none rounded-2xl border border-white/10 bg-neutral-950/55 px-4 py-3 text-sm text-neutral-100 outline-none transition focus:border-white/20 focus:bg-neutral-950/80"
              placeholder="Short, client-facing description..."
            />
          </label>

          <label className="block md:col-span-2">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-400">
              Image URL
            </span>
            <input
              value={form.imageUrl}
              onChange={(e) =>
                setForm((f) => ({ ...f, imageUrl: e.target.value }))
              }
              className="mt-2 w-full rounded-2xl border border-white/10 bg-neutral-950/55 px-4 py-3 text-sm text-neutral-100 outline-none transition focus:border-white/20 focus:bg-neutral-950/80"
              placeholder='e.g., "/images/services/housemaid.png" or "https://..."'
            />
            <p className="mt-2 text-xs text-neutral-400">
              Tip: For local images, use a leading slash path from `public/`.
            </p>
          </label>
        </div>

        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="outline"
            className="rounded-2xl border-white/15 bg-transparent text-neutral-100 hover:border-white/25 hover:bg-white/5 hover:text-white"
            onClick={closeModal}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={upsert}
            className="rounded-2xl"
            disabled={
              !form.title.trim() ||
              !form.description.trim() ||
              !form.imageUrl.trim()
            }
          >
            {editing ? "Save changes" : "Add service"}
          </Button>
        </div>
      </ModalShell>
    </div>
  );
}


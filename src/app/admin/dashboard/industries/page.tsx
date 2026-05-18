/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { industryCardBackgroundImage } from "@/lib/cms/industryCardBackground";
import { cn } from "@/lib/utils";

type CmsIndustry = {
  id: string;
  key: string;
  title: string;
  gradient: string;
  iconName: string;
  body: string;
  jobs: string[];
  updatedAt: string;
};

function nowIso() {
  return new Date().toISOString();
}

function safeParseIndustries(raw: string | null): CmsIndustry[] | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return null;
    const ok = parsed.every(
      (s) =>
        s &&
        typeof s === "object" &&
        typeof (s as any).id === "string" &&
        typeof (s as any).key === "string" &&
        typeof (s as any).title === "string" &&
        typeof (s as any).gradient === "string" &&
        typeof (s as any).iconName === "string" &&
        typeof (s as any).body === "string" &&
        Array.isArray((s as any).jobs) &&
        typeof (s as any).updatedAt === "string"
    );
    return ok ? (parsed as CmsIndustry[]) : null;
  } catch {
    return null;
  }
}

function makeIdFromKey(key: string) {
  const base = key
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
  return `ind_${base || "industry"}_${Math.random().toString(16).slice(2, 8)}`;
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
      <div className="relative mx-auto mt-14 w-[min(820px,92vw)] rounded-3xl border border-white/10 bg-neutral-950 shadow-2xl shadow-black/70">
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

export default function AdminManageIndustriesPage() {
  const [industries, setIndustries] = useState<CmsIndustry[]>([]);
  const [ready, setReady] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const editing = useMemo(
    () => industries.find((s) => s.id === editingId) || null,
    [editingId, industries]
  );

  const [form, setForm] = useState<{
    key: string;
    title: string;
    gradient: string;
    iconName: string;
    body: string;
    jobsText: string;
  }>({
    key: "",
    title: "",
    gradient: "from-brand via-brand-mid to-brand-pale",
    iconName: "Building2",
    body: "",
    jobsText: "",
  });

  useEffect(() => {
    (async () => {
      setLoadError(null);
      const res = await fetch("/api/admin/industries", adminFetch);
      if (!res.ok) {
        if (res.status === 401) {
          setLoadError(
            "Not authorized (401). Sign out and sign in again, or confirm Neon Auth env vars and the CMS allowlist (SOURCE_ADMIN_EMAILS / ADMIN_EMAIL)."
          );
        } else {
          const text = await res.text().catch(() => "");
          setLoadError(
            `Could not load industries (${res.status}). ${text.slice(0, 200)} Check DATABASE_URL and logs.`
          );
        }
        setIndustries([]);
        setReady(true);
        return;
      }
      const data = (await res.json()) as { items?: CmsIndustry[] };
      setIndustries(Array.isArray(data.items) ? data.items : []);
      setReady(true);
    })().catch((e) => {
      setIndustries([]);
      setLoadError(
        e instanceof Error ? e.message : "Network error loading industries."
      );
      setReady(true);
    });
  }, []);

  useEffect(() => {
    // DB-backed now — no localStorage persistence needed.
  }, [ready, industries]);

  function openAdd() {
    setEditingId(null);
    setForm({
      key: "",
      title: "",
      gradient: "from-brand via-brand-mid to-brand-pale",
      iconName: "Building2",
      body: "",
      jobsText: "",
    });
    setModalOpen(true);
  }

  function openEdit(s: CmsIndustry) {
    setEditingId(s.id);
    setForm({
      key: s.key,
      title: s.title,
      gradient: s.gradient,
      iconName: s.iconName,
      body: s.body,
      jobsText: s.jobs.join("\n"),
    });
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
  }

  function remove(id: string) {
    (async () => {
      const res = await fetch(`/api/admin/industries?id=${encodeURIComponent(id)}`, {
        ...adminFetch,
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Delete failed");
      setIndustries((current) => current.filter((s) => s.id !== id));
    })().catch(() => {});
  }

  function upsert() {
    const key = form.key.trim();
    const title = form.title.trim();
    const gradient = form.gradient.trim();
    const iconName = form.iconName.trim();
    const body = form.body.trim();
    const jobs = form.jobsText
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);

    if (!key || !title || !gradient || !iconName || !body || jobs.length === 0) {
      return;
    }

    (async () => {
      if (editingId) {
        const res = await fetch("/api/admin/industries", {
          ...adminFetch,
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: editingId,
            key,
            title,
            gradient,
            iconName,
            body,
            jobs,
          }),
        });
        if (!res.ok) throw new Error("Update failed");
      } else {
        const res = await fetch("/api/admin/industries", {
          ...adminFetch,
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            key,
            title,
            gradient,
            iconName,
            body,
            jobs,
          }),
        });
        if (!res.ok) throw new Error("Create failed");
      }
      const refreshed = await fetch("/api/admin/industries", adminFetch);
      const data = (await refreshed.json()) as { items: CmsIndustry[] };
      setIndustries(data.items);
      setModalOpen(false);
    })().catch(() => {});
  }

  const stats = useMemo(() => {
    return { total: industries.length };
  }, [industries.length]);

  return (
    <div className="space-y-6">
      {loadError ? (
        <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">
          <p className="font-semibold text-amber-50">Could not load industries</p>
          <p className="mt-1 text-amber-100/90">{loadError}</p>
        </div>
      ) : null}
      <div className="rounded-3xl border border-white/10 bg-white/5 p-6 md:p-7">
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-neutral-400">
              Manage Industries
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight">
              Industry cards
            </h1>
            <p className="mt-2 text-sm text-neutral-300">
              Edit homepage industries (live site pulls from DB). Total:{" "}
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
                  const res = await fetch("/api/admin/industries?reset=1", {
                    ...adminFetch,
                    method: "POST",
                  });
                  if (!res.ok) throw new Error("Reset failed");
                  const data = (await res.json()) as { items: CmsIndustry[] };
                  setIndustries(data.items);
                })().catch(() => {});
              }}
            >
              Reset to defaults
            </Button>
            <Button type="button" className="rounded-2xl" onClick={openAdd}>
              Add New Industry
            </Button>
          </div>
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-4">
          {industries.slice(0, 4).map((ind) => (
            <div
              key={ind.id}
              className={cn("rounded-2xl border border-white/10 p-4 text-white")}
              style={{
                backgroundImage: industryCardBackgroundImage(ind.gradient),
              }}
            >
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/80">
                Preview
              </p>
              <p className="mt-2 line-clamp-2 text-lg font-bold tracking-tight">
                {ind.title}
              </p>
              <p className="mt-2 line-clamp-2 text-xs text-white/90">{ind.body}</p>
              <p className="mt-3 text-xs text-white/80">
                Jobs: <span className="font-semibold text-white">{ind.jobs.length}</span>
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="overflow-hidden rounded-3xl border border-white/10 bg-neutral-950">
        <div className="border-b border-white/10 bg-white/5 px-5 py-4">
          <p className="text-sm font-semibold text-white">Current industries</p>
          <p className="mt-1 text-xs text-neutral-400">
            Edits persist in the database; refresh the homepage to verify.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1040px] border-collapse">
            <thead>
              <tr className="text-left text-xs font-semibold uppercase tracking-[0.18em] text-neutral-400">
                <th className="px-5 py-3">Title</th>
                <th className="px-5 py-3">Key</th>
                <th className="px-5 py-3">Gradient</th>
                <th className="px-5 py-3">Jobs</th>
                <th className="px-5 py-3">Last update</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {industries.map((s) => (
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
                      {s.body}
                    </p>
                  </td>
                  <td className="px-5 py-4">
                    <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-neutral-100">
                      {s.key}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <code className="text-xs text-neutral-300">{s.gradient}</code>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-xs text-neutral-300">{s.jobs.length}</span>
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
              {industries.length === 0 ? (
                <tr className="border-t border-white/10">
                  <td className="px-5 py-8 text-sm text-neutral-400" colSpan={6}>
                    No industries yet. Click{" "}
                    <span className="text-white">Add New Industry</span>.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>

      <ModalShell
        open={modalOpen}
        title={editing ? `Edit: ${editing.title}` : "Add new industry"}
        onClose={closeModal}
      >
        <div className="grid gap-4 md:grid-cols-2">
          <label className="block md:col-span-1">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-400">
              Key
            </span>
            <input
              value={form.key}
              onChange={(e) => setForm((f) => ({ ...f, key: e.target.value }))}
              className="mt-2 w-full rounded-2xl border border-white/10 bg-neutral-950/55 px-4 py-3 text-sm text-neutral-100 outline-none transition focus:border-white/20 focus:bg-neutral-950/80"
              placeholder="e.g., facilities"
            />
            <p className="mt-2 text-xs text-neutral-400">
              Internal slug (must stay unique across industries).
            </p>
          </label>

          <label className="block md:col-span-1">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-400">
              Title
            </span>
            <input
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              className="mt-2 w-full rounded-2xl border border-white/10 bg-neutral-950/55 px-4 py-3 text-sm text-neutral-100 outline-none transition focus:border-white/20 focus:bg-neutral-950/80"
              placeholder="e.g., Facilities & Workplaces"
            />
          </label>

          <label className="block md:col-span-1">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-400">
              Icon Name
            </span>
            <input
              value={form.iconName}
              onChange={(e) =>
                setForm((f) => ({ ...f, iconName: e.target.value }))
              }
              className="mt-2 w-full rounded-2xl border border-white/10 bg-neutral-950/55 px-4 py-3 text-sm text-neutral-100 outline-none transition focus:border-white/20 focus:bg-neutral-950/80"
              placeholder="e.g., Building2"
            />
            <p className="mt-2 text-xs text-neutral-400">
              Stored as text for now (we’ll map to icons later).
            </p>
          </label>

          <label className="block md:col-span-1">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-400">
              Gradient classes
            </span>
            <input
              value={form.gradient}
              onChange={(e) =>
                setForm((f) => ({ ...f, gradient: e.target.value }))
              }
              className="mt-2 w-full rounded-2xl border border-white/10 bg-neutral-950/55 px-4 py-3 text-sm text-neutral-100 outline-none transition focus:border-white/20 focus:bg-neutral-950/80"
              placeholder="from-brand via-brand-mid to-brand-pale"
            />
          </label>

          <label className="block md:col-span-2">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-400">
              Body
            </span>
            <textarea
              value={form.body}
              onChange={(e) => setForm((f) => ({ ...f, body: e.target.value }))}
              rows={3}
              className="mt-2 w-full resize-none rounded-2xl border border-white/10 bg-neutral-950/55 px-4 py-3 text-sm text-neutral-100 outline-none transition focus:border-white/20 focus:bg-neutral-950/80"
              placeholder="Short description shown on the industry card..."
            />
          </label>

          <label className="block md:col-span-2">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-400">
              Jobs (one per line)
            </span>
            <textarea
              value={form.jobsText}
              onChange={(e) =>
                setForm((f) => ({ ...f, jobsText: e.target.value }))
              }
              rows={6}
              className="mt-2 w-full resize-none rounded-2xl border border-white/10 bg-neutral-950/55 px-4 py-3 text-sm text-neutral-100 outline-none transition focus:border-white/20 focus:bg-neutral-950/80"
              placeholder={"e.g.\nJanitorial & day porters\nGrounds & light maintenance"}
            />
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
            className="rounded-2xl"
            onClick={upsert}
            disabled={
              !form.key.trim() ||
              !form.title.trim() ||
              !form.gradient.trim() ||
              !form.iconName.trim() ||
              !form.body.trim() ||
              form.jobsText
                .split("\n")
                .map((s) => s.trim())
                .filter(Boolean).length === 0
            }
          >
            {editing ? "Save changes" : "Add industry"}
          </Button>
        </div>
      </ModalShell>
    </div>
  );
}


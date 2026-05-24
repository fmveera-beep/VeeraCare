"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Lead = {
  id: string;
  inquiryType: "HIRING" | "WORKER";
  inquiryLabel: string;
  name: string;
  phone: string;
  email: string;
  serviceNeeded: string;
  availability: string | null;
  message: string;
  sourcePath: string | null;
  createdAt: string;
};

type Filter = "all" | "HIRING" | "WORKER";

const adminFetch: RequestInit = { credentials: "include", cache: "no-store" };

function formatWhen(iso: string) {
  try {
    return new Date(iso).toLocaleString(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    });
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
        aria-label="Close"
        className="absolute inset-0 bg-black/65"
        onClick={onClose}
      />
      <div className="relative mx-auto mt-10 max-h-[min(90vh,820px)] w-[min(720px,92vw)] overflow-y-auto rounded-3xl border border-white/10 bg-neutral-950 shadow-2xl">
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

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [ready, setReady] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [filter, setFilter] = useState<Filter>("all");
  const [selected, setSelected] = useState<Lead | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const loadLeads = useCallback(async () => {
    setLoadError(null);
    const res = await fetch("/api/admin/leads", adminFetch);
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(
        res.status === 401
          ? "Not authorized. Sign in again."
          : `Could not load leads (${res.status}). ${text.slice(0, 120)}`
      );
    }
    const data = (await res.json()) as { items?: Lead[] };
    setLeads(Array.isArray(data.items) ? data.items : []);
  }, []);

  useEffect(() => {
    loadLeads()
      .catch((e) => {
        setLeads([]);
        setLoadError(e instanceof Error ? e.message : "Failed to load leads.");
      })
      .finally(() => setReady(true));
  }, [loadLeads]);

  const filtered = useMemo(() => {
    if (filter === "all") return leads;
    return leads.filter((l) => l.inquiryType === filter);
  }, [filter, leads]);

  const stats = useMemo(
    () => ({
      total: leads.length,
      hiring: leads.filter((l) => l.inquiryType === "HIRING").length,
      worker: leads.filter((l) => l.inquiryType === "WORKER").length,
    }),
    [leads]
  );

  async function refresh() {
    setRefreshing(true);
    try {
      await loadLeads();
    } catch (e) {
      setLoadError(e instanceof Error ? e.message : "Refresh failed.");
    } finally {
      setRefreshing(false);
    }
  }

  function remove(id: string) {
    if (!confirm("Delete this lead permanently?")) return;
    (async () => {
      const res = await fetch(`/api/admin/leads?id=${encodeURIComponent(id)}`, {
        ...adminFetch,
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Delete failed");
      setLeads((current) => current.filter((l) => l.id !== id));
      if (selected?.id === id) setSelected(null);
    })().catch(() => {});
  }

  return (
    <div className="space-y-6">
      {loadError ? (
        <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">
          <p className="font-semibold text-amber-50">Could not load leads</p>
          <p className="mt-1 text-amber-100/90">{loadError}</p>
        </div>
      ) : null}

      <div className="rounded-3xl border border-white/10 bg-white/5 p-6 md:p-7">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-neutral-400">
              Leads
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight">Form submissions</h1>
            <p className="mt-2 max-w-2xl text-sm text-neutral-300">
              Every hiring or worker inquiry from the site contact form is saved here
              (same data as the notification email). Newest first.
            </p>
          </div>
          <Button
            type="button"
            className="rounded-2xl shrink-0"
            disabled={refreshing}
            onClick={() => refresh()}
          >
            {refreshing ? "Refreshing…" : "Refresh"}
          </Button>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          {(
            [
              ["all", `All (${stats.total})`],
              ["HIRING", `Hiring (${stats.hiring})`],
              ["WORKER", `Worker (${stats.worker})`],
            ] as const
          ).map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => setFilter(key)}
              className={cn(
                "rounded-full border px-4 py-1.5 text-xs font-semibold uppercase tracking-wide transition",
                filter === key
                  ? "border-brand/50 bg-brand/20 text-white"
                  : "border-white/15 text-neutral-300 hover:border-white/25 hover:text-white"
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-hidden rounded-3xl border border-white/10 bg-neutral-950">
        <div className="border-b border-white/10 bg-white/5 px-5 py-4">
          <p className="text-sm font-semibold text-white">
            {ready ? `${filtered.length} lead${filtered.length === 1 ? "" : "s"}` : "Loading…"}
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[960px] border-collapse">
            <thead>
              <tr className="text-left text-xs font-semibold uppercase tracking-[0.18em] text-neutral-400">
                <th className="px-5 py-3">Received</th>
                <th className="px-5 py-3">Type</th>
                <th className="px-5 py-3">Name</th>
                <th className="px-5 py-3">Email</th>
                <th className="px-5 py-3">Phone</th>
                <th className="px-5 py-3">Service</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((lead) => (
                <tr
                  key={lead.id}
                  className="border-t border-white/10 text-sm text-neutral-200 odd:bg-white/[0.02] hover:bg-white/5"
                >
                  <td className="px-5 py-4 whitespace-nowrap text-xs text-neutral-400">
                    {formatWhen(lead.createdAt)}
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={cn(
                        "inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide",
                        lead.inquiryType === "HIRING"
                          ? "bg-brand/25 text-brand-pale ring-1 ring-brand/30"
                          : "bg-emerald-500/15 text-emerald-200 ring-1 ring-emerald-500/25"
                      )}
                    >
                      {lead.inquiryType === "HIRING" ? "Hiring" : "Worker"}
                    </span>
                  </td>
                  <td className="px-5 py-4 font-medium text-white">{lead.name}</td>
                  <td className="px-5 py-4">
                    <a
                      href={`mailto:${lead.email}`}
                      className="text-brand-pale hover:text-white hover:underline"
                    >
                      {lead.email}
                    </a>
                  </td>
                  <td className="px-5 py-4">
                    <a href={`tel:${lead.phone}`} className="hover:text-white hover:underline">
                      {lead.phone}
                    </a>
                  </td>
                  <td className="px-5 py-4 text-neutral-300">{lead.serviceNeeded}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        className="rounded-2xl border-white/15 bg-transparent text-neutral-100 hover:bg-white/5"
                        onClick={() => setSelected(lead)}
                      >
                        View
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        className="rounded-2xl border-red-500/25 bg-transparent text-red-200 hover:bg-red-500/10"
                        onClick={() => remove(lead.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {ready && filtered.length === 0 ? (
                <tr className="border-t border-white/10">
                  <td colSpan={7} className="px-5 py-12 text-center text-sm text-neutral-400">
                    No leads yet. Submissions from the contact / CTA form will appear here.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>

      <ModalShell
        open={Boolean(selected)}
        title={selected ? `${selected.name} — ${selected.inquiryLabel}` : "Lead"}
        onClose={() => setSelected(null)}
      >
        {selected ? (
          <div className="space-y-5 text-sm text-neutral-200">
            <dl className="grid gap-3 sm:grid-cols-2">
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
                  Received
                </dt>
                <dd className="mt-1 text-white">{formatWhen(selected.createdAt)}</dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
                  Inquiry type
                </dt>
                <dd className="mt-1 text-white">{selected.inquiryLabel}</dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
                  Email
                </dt>
                <dd className="mt-1">
                  <a
                    href={`mailto:${selected.email}`}
                    className="font-medium text-brand-pale hover:underline"
                  >
                    {selected.email}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
                  Phone
                </dt>
                <dd className="mt-1">
                  <a href={`tel:${selected.phone}`} className="font-medium text-white hover:underline">
                    {selected.phone}
                  </a>
                </dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
                  Service
                </dt>
                <dd className="mt-1 text-white">{selected.serviceNeeded}</dd>
              </div>
              {selected.availability ? (
                <div className="sm:col-span-2">
                  <dt className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
                    Availability
                  </dt>
                  <dd className="mt-1 whitespace-pre-wrap text-white">{selected.availability}</dd>
                </div>
              ) : null}
              {selected.sourcePath ? (
                <div className="sm:col-span-2">
                  <dt className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
                    Source page
                  </dt>
                  <dd className="mt-1 font-mono text-xs text-neutral-400">{selected.sourcePath}</dd>
                </div>
              ) : null}
            </dl>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
                Message
              </p>
              <p className="mt-2 whitespace-pre-wrap rounded-2xl border border-white/10 bg-white/5 p-4 text-neutral-100">
                {selected.message}
              </p>
            </div>
            <p className="text-xs text-neutral-500">
              Request ID: <span className="font-mono text-neutral-400">{selected.id}</span>
            </p>
          </div>
        ) : null}
      </ModalShell>
    </div>
  );
}

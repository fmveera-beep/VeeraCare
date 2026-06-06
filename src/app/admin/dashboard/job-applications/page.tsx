"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useCmsSession } from "@/components/admin/useCmsSession";
import { cn } from "@/lib/utils";

type JobApplication = {
  id: string;
  jobSlug: string;
  jobTitle: string;
  name: string;
  email: string;
  phone: string;
  message: string | null;
  cvUrl: string | null;
  cvFileName: string | null;
  sourcePath: string | null;
  createdAt: string;
};

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

export default function AdminJobApplicationsPage() {
  const { canWrite } = useCmsSession();
  const [items, setItems] = useState<JobApplication[]>([]);
  const [ready, setReady] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [selected, setSelected] = useState<JobApplication | null>(null);

  const loadItems = useCallback(async () => {
    setLoadError(null);
    const res = await fetch("/api/admin/job-applications", adminFetch);
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(
        res.status === 401
          ? "Not authorized. Sign in again."
          : `Could not load applications (${res.status}). ${text.slice(0, 120)}`
      );
    }
    const data = (await res.json()) as { items?: JobApplication[] };
    setItems(Array.isArray(data.items) ? data.items : []);
  }, []);

  useEffect(() => {
    loadItems()
      .catch((e) => {
        setItems([]);
        setLoadError(e instanceof Error ? e.message : "Failed to load applications.");
      })
      .finally(() => setReady(true));
  }, [loadItems]);

  const stats = useMemo(
    () => ({
      total: items.length,
      withCv: items.filter((i) => i.cvUrl).length,
    }),
    [items]
  );

  async function remove(id: string) {
    const res = await fetch(`/api/admin/job-applications?id=${encodeURIComponent(id)}`, {
      ...adminFetch,
      method: "DELETE",
    });
    if (!res.ok) return;
    setItems((current) => current.filter((i) => i.id !== id));
    if (selected?.id === id) setSelected(null);
  }

  return (
    <div className="space-y-6">
      {loadError ? (
        <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">
          <p className="font-semibold text-amber-50">Could not load applications</p>
          <p className="mt-1 text-amber-100/90">{loadError}</p>
        </div>
      ) : null}

      <div className="rounded-3xl border border-white/10 bg-white/5 p-6 md:p-7">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-neutral-400">
          Job applications
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight">Careers submissions</h1>
        <p className="mt-2 text-sm text-neutral-300">
          Applications from the careers apply form. Total:{" "}
          <span className="font-semibold text-white">{ready ? stats.total : "—"}</span> (
          {stats.withCv} with CV)
          {!canWrite ? (
            <span className="mt-2 block text-amber-200/90">
              View-only access — you can review applications but not delete them.
            </span>
          ) : null}
        </p>
      </div>

      <div className="overflow-hidden rounded-3xl border border-white/10 bg-neutral-950">
        <div className="border-b border-white/10 bg-white/5 px-5 py-4">
          <p className="text-sm font-semibold text-white">Recent applications</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[960px] border-collapse">
            <thead>
              <tr className="border-b border-white/10 text-left text-xs uppercase tracking-wide text-neutral-400">
                <th className="px-5 py-3 font-semibold">Applicant</th>
                <th className="px-5 py-3 font-semibold">Job</th>
                <th className="px-5 py-3 font-semibold">Contact</th>
                <th className="px-5 py-3 font-semibold">CV</th>
                <th className="px-5 py-3 font-semibold">Submitted</th>
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
                    No applications yet.
                  </td>
                </tr>
              ) : (
                items.map((item) => (
                  <tr key={item.id} className="border-b border-white/5 text-sm text-neutral-200">
                    <td className="px-5 py-4 font-medium text-white">{item.name}</td>
                    <td className="px-5 py-4">
                      <Link
                        href={`/careers/${item.jobSlug}`}
                        target="_blank"
                        className="text-brand hover:underline"
                      >
                        {item.jobTitle}
                      </Link>
                    </td>
                    <td className="px-5 py-4">
                      <div>{item.email}</div>
                      <div className="text-neutral-400">{item.phone}</div>
                    </td>
                    <td className="px-5 py-4">
                      {item.cvUrl ? (
                        <a
                          href={item.cvUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-brand hover:underline"
                        >
                          {item.cvFileName ?? "Download CV"}
                        </a>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td className="px-5 py-4">{formatWhen(item.createdAt)}</td>
                    <td className="px-5 py-4">
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          className="text-xs font-semibold text-white hover:underline"
                          onClick={() => setSelected(item)}
                        >
                          View
                        </button>
                        {canWrite ? (
                          <button
                            type="button"
                            className="text-xs font-semibold text-red-300 hover:underline"
                            onClick={() => remove(item.id)}
                          >
                            Delete
                          </button>
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

      <ModalShell
        open={Boolean(selected)}
        title={selected ? `Application — ${selected.name}` : "Application"}
        onClose={() => setSelected(null)}
      >
        {selected ? (
          <div className="space-y-4 text-sm text-neutral-200">
            <div>
              <p className="text-xs uppercase tracking-wide text-neutral-400">Job</p>
              <p className="mt-1 font-medium text-white">{selected.jobTitle}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-neutral-400">Email</p>
              <p className="mt-1">{selected.email}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-neutral-400">Phone</p>
              <p className="mt-1">{selected.phone}</p>
            </div>
            {selected.message ? (
              <div>
                <p className="text-xs uppercase tracking-wide text-neutral-400">Message</p>
                <p className="mt-1 whitespace-pre-wrap">{selected.message}</p>
              </div>
            ) : null}
            {selected.cvUrl ? (
              <div>
                <p className="text-xs uppercase tracking-wide text-neutral-400">CV</p>
                <a
                  href={selected.cvUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn("mt-1 inline-block text-brand hover:underline")}
                >
                  {selected.cvFileName ?? "Download CV"}
                </a>
              </div>
            ) : null}
            <div>
              <p className="text-xs uppercase tracking-wide text-neutral-400">Submitted</p>
              <p className="mt-1">{formatWhen(selected.createdAt)}</p>
            </div>
          </div>
        ) : null}
      </ModalShell>
    </div>
  );
}

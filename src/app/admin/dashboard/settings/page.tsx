/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const SETTINGS_KEY = "veeracare_cms_settings_v1";

type CmsSettings = {
  updatedAt: string;
  ownerNotifyEmail: string;
  notes: string;
};

function nowIso() {
  return new Date().toISOString();
}

function safeParseSettings(raw: string | null): CmsSettings | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== "object") return null;
    if (
      typeof (parsed as any).updatedAt !== "string" ||
      typeof (parsed as any).ownerNotifyEmail !== "string" ||
      typeof (parsed as any).notes !== "string"
    ) {
      return null;
    }
    return parsed as CmsSettings;
  } catch {
    return null;
  }
}

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<CmsSettings>({
    updatedAt: nowIso(),
    ownerNotifyEmail: "owner@veeracare.com",
    notes: "",
  });
  const [ready, setReady] = useState(false);

  const [servicesCount, setServicesCount] = useState<number | null>(null);
  const [industriesCount, setIndustriesCount] = useState<number | null>(null);

  useEffect(() => {
    const parsed = safeParseSettings(localStorage.getItem(SETTINGS_KEY));
    if (parsed) setSettings(parsed);

    (async () => {
      const [sRes, iRes] = await Promise.all([
        fetch("/api/admin/services", { credentials: "include", cache: "no-store" }),
        fetch("/api/admin/industries", { credentials: "include", cache: "no-store" }),
      ]);
      if (sRes.ok) {
        const data = (await sRes.json()) as { items: unknown[] };
        setServicesCount(Array.isArray(data.items) ? data.items.length : 0);
      } else {
        setServicesCount(0);
      }
      if (iRes.ok) {
        const data = (await iRes.json()) as { items: unknown[] };
        setIndustriesCount(Array.isArray(data.items) ? data.items.length : 0);
      } else {
        setIndustriesCount(0);
      }
    })().catch(() => {
      setServicesCount(0);
      setIndustriesCount(0);
    });

    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  }, [ready, settings]);

  const storageStats = useMemo(() => {
    return [
      { label: "Services records", value: servicesCount ?? "—" },
      { label: "Industries records", value: industriesCount ?? "—" },
      { label: "Settings record", value: 1 },
    ] as const;
  }, [industriesCount, servicesCount]);

  function refreshCounts() {
    (async () => {
      const [sRes, iRes] = await Promise.all([
        fetch("/api/admin/services", { credentials: "include", cache: "no-store" }),
        fetch("/api/admin/industries", { credentials: "include", cache: "no-store" }),
      ]);
      if (sRes.ok) {
        const data = (await sRes.json()) as { items: unknown[] };
        setServicesCount(Array.isArray(data.items) ? data.items.length : 0);
      } else setServicesCount(0);
      if (iRes.ok) {
        const data = (await iRes.json()) as { items: unknown[] };
        setIndustriesCount(Array.isArray(data.items) ? data.items.length : 0);
      } else setIndustriesCount(0);
    })().catch(() => {
      setServicesCount(0);
      setIndustriesCount(0);
    });
  }

  function clearCmsData() {
    (async () => {
      await Promise.all([
        fetch("/api/admin/services?all=1", {
          method: "DELETE",
          credentials: "include",
        }),
        fetch("/api/admin/industries?all=1", {
          method: "DELETE",
          credentials: "include",
        }),
      ]);
      localStorage.removeItem(SETTINGS_KEY);
      setSettings({
        updatedAt: nowIso(),
        ownerNotifyEmail: "owner@veeracare.com",
        notes: "",
      });
      refreshCounts();
    })().catch(() => {});
  }

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-white/10 bg-white/5 p-6 md:p-7">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-neutral-400">
          Settings
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight">CMS settings</h1>
        <p className="mt-2 max-w-2xl text-sm text-neutral-300">
          Admin preferences are stored in your browser only. CMS content (services
          and industries) is stored in the database and drives the live site.
        </p>

        <div className="mt-6 grid gap-3 md:grid-cols-3">
          {storageStats.map((s) => (
            <div
              key={s.label}
              className="rounded-2xl border border-white/10 bg-neutral-900/35 p-4"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-400">
                {s.label}
              </p>
              <p className="mt-2 text-2xl font-bold text-white">{s.value}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl border border-white/10 bg-neutral-950 p-6 md:p-7">
          <p className="text-sm font-semibold text-white">Admin preferences</p>
          <p className="mt-1 text-xs text-neutral-400">
            Stored in localStorage for now.
          </p>

          <div className="mt-5 space-y-4">
            <label className="block">
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-400">
                Owner notify email
              </span>
              <input
                value={settings.ownerNotifyEmail}
                onChange={(e) =>
                  setSettings((s) => ({
                    ...s,
                    ownerNotifyEmail: e.target.value,
                    updatedAt: nowIso(),
                  }))
                }
                className="mt-2 w-full rounded-2xl border border-white/10 bg-neutral-950/55 px-4 py-3 text-sm text-neutral-100 outline-none transition focus:border-white/20 focus:bg-neutral-950/80"
                placeholder="owner@veeracare.com"
              />
            </label>

            <label className="block">
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-400">
                Internal notes
              </span>
              <textarea
                value={settings.notes}
                onChange={(e) =>
                  setSettings((s) => ({
                    ...s,
                    notes: e.target.value,
                    updatedAt: nowIso(),
                  }))
                }
                rows={5}
                className="mt-2 w-full resize-none rounded-2xl border border-white/10 bg-neutral-950/55 px-4 py-3 text-sm text-neutral-100 outline-none transition focus:border-white/20 focus:bg-neutral-950/80"
                placeholder="Notes for the admin team..."
              />
            </label>

            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-xs text-neutral-300">
              <p className="text-neutral-400">Last updated</p>
              <p className="mt-1 font-semibold text-white">
                {new Date(settings.updatedAt).toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-neutral-950 p-6 md:p-7">
          <p className="text-sm font-semibold text-white">CMS maintenance</p>
          <p className="mt-1 text-xs text-neutral-400">
            Database maintenance and session tools.
          </p>

          <div className="mt-5 space-y-3">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-sm font-semibold text-white">Refresh counters</p>
              <p className="mt-1 text-xs text-neutral-400">
                Re-check how many CMS records exist in the database.
              </p>
              <div className="mt-3">
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-2xl border-white/15 bg-transparent text-neutral-100 hover:border-white/25 hover:bg-white/5 hover:text-white"
                  onClick={refreshCounts}
                >
                  Refresh
                </Button>
              </div>
            </div>

            <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-4">
              <p className="text-sm font-semibold text-white">Clear CMS data</p>
              <p className="mt-1 text-xs text-neutral-400">
                Deletes all Services and Industries in the database; clears saved
                settings in your browser only.
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-2xl border-red-500/25 bg-transparent text-red-200 hover:border-red-500/40 hover:bg-red-500/10 hover:text-red-100"
                  onClick={clearCmsData}
                >
                  Clear local CMS data
                </Button>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-sm font-semibold text-white">Session</p>
              <p className="mt-1 text-xs text-neutral-400">
                Signed in via an httpOnly session cookie (use Logout to end).
              </p>
              <div className="mt-3">
                <Button
                  type="button"
                  variant="outline"
                  className={cn(
                    "rounded-2xl border-white/15 bg-transparent text-neutral-100",
                    "hover:border-white/25 hover:bg-white/5 hover:text-white"
                  )}
                  onClick={() => {
                    fetch("/api/admin/logout", {
                      method: "POST",
                      credentials: "include",
                    })
                      .catch(() => {})
                      .finally(() => {
                        window.location.href = "/admin/login";
                      });
                  }}
                >
                  Force logout
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


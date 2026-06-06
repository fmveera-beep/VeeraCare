"use client";

import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  CMS_ROLE_OPTIONS,
  roleDescription,
  roleLabel,
  type CmsRole,
} from "@/lib/neon-auth/cmsRoles";
import { cn } from "@/lib/utils";

type CmsUser = {
  id: string;
  email: string;
  role: CmsRole;
  createdAt: string;
  updatedAt: string;
};

const adminFetch: RequestInit = { credentials: "include", cache: "no-store" };

const fieldClass =
  "mt-1.5 w-full rounded-xl border border-white/15 bg-neutral-900/80 px-3 py-2.5 text-sm text-white placeholder:text-neutral-500 focus:border-brand/50 focus:outline-none focus:ring-1 focus:ring-brand/40";

export default function AdminManageUsersPage() {
  const [items, setItems] = useState<CmsUser[]>([]);
  const [ready, setReady] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<CmsRole>("leads");
  const [saving, setSaving] = useState(false);

  const loadItems = useCallback(async () => {
    setLoadError(null);
    const res = await fetch("/api/admin/cms-users", adminFetch);
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(
        res.status === 401
          ? "Not authorized. Sign in as admin."
          : `Could not load users (${res.status}). ${text.slice(0, 120)}`
      );
    }
    const data = (await res.json()) as { items?: CmsUser[] };
    setItems(Array.isArray(data.items) ? data.items : []);
  }, []);

  useEffect(() => {
    loadItems()
      .catch((e) => {
        setItems([]);
        setLoadError(e instanceof Error ? e.message : "Failed to load users.");
      })
      .finally(() => setReady(true));
  }, [loadItems]);

  async function addUser(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);
    setSaving(true);
    try {
      const res = await fetch("/api/admin/cms-users", {
        ...adminFetch,
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), role }),
      });
      const data = (await res.json().catch(() => null)) as { error?: string } | null;
      if (!res.ok) {
        throw new Error(data?.error ?? "Could not add user.");
      }
      setEmail("");
      setRole("leads");
      await loadItems();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Could not add user.");
    } finally {
      setSaving(false);
    }
  }

  async function changeRole(id: string, nextRole: CmsRole) {
    setFormError(null);
    const res = await fetch("/api/admin/cms-users", {
      ...adminFetch,
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, role: nextRole }),
    });
    const data = (await res.json().catch(() => null)) as { error?: string; item?: CmsUser } | null;
    if (!res.ok) {
      setFormError(data?.error ?? "Could not update role.");
      return;
    }
    if (data?.item) {
      setItems((current) => current.map((u) => (u.id === id ? data.item! : u)));
    } else {
      await loadItems();
    }
  }

  async function remove(id: string) {
    setFormError(null);
    const res = await fetch(`/api/admin/cms-users?id=${encodeURIComponent(id)}`, {
      ...adminFetch,
      method: "DELETE",
    });
    const data = (await res.json().catch(() => null)) as { error?: string } | null;
    if (!res.ok) {
      setFormError(data?.error ?? "Could not remove user.");
      return;
    }
    setItems((current) => current.filter((u) => u.id !== id));
  }

  return (
    <div className="space-y-6">
      {loadError ? (
        <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">
          <p className="font-semibold text-amber-50">Could not load users</p>
          <p className="mt-1 text-amber-100/90">{loadError}</p>
        </div>
      ) : null}

      <div className="rounded-3xl border border-white/10 bg-white/5 p-6 md:p-7">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-neutral-400">
          Manage Users
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight">CMS access roles</h1>
        <p className="mt-2 max-w-2xl text-sm text-neutral-300">
          Assign who can sign in to the admin dashboard and what they can see. Users sign in with
          Neon email OTP using the email you add here.
        </p>
      </div>

      <div className="rounded-3xl border border-white/10 bg-neutral-950 p-6 md:p-7">
        <h2 className="text-lg font-bold text-white">Add user</h2>
        <form onSubmit={addUser} className="mt-4 grid gap-4 md:grid-cols-[1fr_12rem_auto] md:items-end">
          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-wide text-neutral-400">
              Email
            </span>
            <input
              required
              type="email"
              className={fieldClass}
              placeholder="user@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>
          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-wide text-neutral-400">
              Role
            </span>
            <select
              className={cn(fieldClass, "cursor-pointer")}
              value={role}
              onChange={(e) => setRole(e.target.value as CmsRole)}
            >
              {CMS_ROLE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </label>
          <Button type="submit" className="rounded-2xl" disabled={saving}>
            {saving ? "Adding…" : "Add user"}
          </Button>
        </form>
        <p className="mt-3 text-xs text-neutral-500">{roleDescription(role)}</p>
        {formError ? (
          <p className="mt-3 text-sm text-amber-300" role="alert">
            {formError}
          </p>
        ) : null}
      </div>

      <div className="overflow-hidden rounded-3xl border border-white/10 bg-neutral-950">
        <div className="border-b border-white/10 bg-white/5 px-5 py-4">
          <p className="text-sm font-semibold text-white">Current users</p>
          <p className="mt-1 text-xs text-neutral-400">
            {ready ? `${items.length} user${items.length === 1 ? "" : "s"}` : "Loading…"}
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] border-collapse">
            <thead>
              <tr className="border-b border-white/10 text-left text-xs uppercase tracking-wide text-neutral-400">
                <th className="px-5 py-3 font-semibold">Email</th>
                <th className="px-5 py-3 font-semibold">Role</th>
                <th className="px-5 py-3 font-semibold">Access</th>
                <th className="px-5 py-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {!ready ? (
                <tr>
                  <td colSpan={4} className="px-5 py-8 text-sm text-neutral-400">
                    Loading…
                  </td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-5 py-8 text-sm text-neutral-400">
                    No users yet.
                  </td>
                </tr>
              ) : (
                items.map((user) => (
                  <tr key={user.id} className="border-b border-white/5 text-sm text-neutral-200">
                    <td className="px-5 py-4 font-medium text-white">{user.email}</td>
                    <td className="px-5 py-4">
                      <select
                        className="rounded-xl border border-white/15 bg-neutral-900 px-3 py-2 text-sm text-white"
                        value={user.role}
                        onChange={(e) => changeRole(user.id, e.target.value as CmsRole)}
                      >
                        {CMS_ROLE_OPTIONS.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-5 py-4 text-xs text-neutral-400">
                      {roleDescription(user.role)}
                    </td>
                    <td className="px-5 py-4">
                      <button
                        type="button"
                        className="text-xs font-semibold text-red-300 hover:underline"
                        onClick={() => remove(user.id)}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5 p-5 text-sm text-neutral-300">
        <p className="font-semibold text-white">Role summary</p>
        <ul className="mt-3 space-y-2">
          {CMS_ROLE_OPTIONS.map((opt) => (
            <li key={opt.value}>
              <span className="font-medium text-white">{roleLabel(opt.value)}</span>
              {" — "}
              {roleDescription(opt.value)}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

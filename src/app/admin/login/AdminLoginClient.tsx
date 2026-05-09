"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { VeeraLogo } from "@/components/brand/VeeraLogo";

export function AdminLoginClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = searchParams.get("next") || "/admin/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const canSubmit = useMemo(
    () => email.trim().length > 0 && password.length > 0 && !isSubmitting,
    [email, password, isSubmitting]
  );

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          password,
        }),
      });
      if (!res.ok) {
        setIsSubmitting(false);
        setError("Invalid credentials. Please try again.");
        return;
      }
      setIsSubmitting(false);
      router.replace(nextPath);
      router.refresh();
    } catch {
      setIsSubmitting(false);
      setError("Login failed. Please try again.");
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-neutral-950 text-neutral-100">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 left-1/2 h-[560px] w-[560px] -translate-x-1/2 rounded-full bg-brand/25 blur-[120px]" />
        <div className="absolute -bottom-48 -left-28 h-[520px] w-[520px] rounded-full bg-indigo-500/15 blur-[130px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.06),transparent_55%)]" />
        <div className="absolute inset-0 opacity-[0.07] [background-image:linear-gradient(to_right,rgba(255,255,255,0.12)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.12)_1px,transparent_1px)] [background-size:56px_56px]" />
      </div>

      <div className="relative mx-auto flex min-h-screen max-w-md items-center px-6 py-14">
        <div className="w-full rounded-3xl border border-white/10 bg-neutral-900/40 p-6 shadow-2xl shadow-black/50 backdrop-blur-xl md:p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="mt-5 text-xs font-semibold uppercase tracking-[0.22em] text-neutral-400">
                VeeraCare CMS
              </p>
              <h1 className="mt-2 text-3xl font-bold tracking-tight">
                Admin login
              </h1>
              <p className="mt-2 text-sm text-neutral-300">
                Sign in to manage services and industries.
              </p>
            </div>
            <div className="hidden h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-gradient-to-b from-white/15 to-white/0 md:flex">
              <VeeraLogo className="h-8 w-8 opacity-95" />
            </div>
          </div>

          <form onSubmit={onSubmit} className="mt-7 space-y-4">
            <label className="block">
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-400">
                Admin Email
              </span>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                autoComplete="email"
                className="mt-2 w-full rounded-2xl border border-white/10 bg-neutral-950/55 px-4 py-3 text-sm text-neutral-100 outline-none ring-0 transition focus:border-white/20 focus:bg-neutral-950/80"
                placeholder="admin@veeracare.com"
                required
              />
            </label>

            <label className="block">
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-400">
                Password
              </span>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                autoComplete="current-password"
                className="mt-2 w-full rounded-2xl border border-white/10 bg-neutral-950/55 px-4 py-3 text-sm text-neutral-100 outline-none ring-0 transition focus:border-white/20 focus:bg-neutral-950/80"
                placeholder="••••••••"
                required
              />
            </label>

            {error ? (
              <div className="rounded-2xl border border-red-500/25 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                {error}
              </div>
            ) : null}

            <button
              type="submit"
              disabled={!canSubmit}
              className="inline-flex w-full items-center justify-center rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-neutral-950 shadow-lg shadow-black/30 transition hover:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "Signing in..." : "Login to CMS"}
            </button>

            <div className="pt-3">
              <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-xs text-neutral-300">
                <p className="text-neutral-400">
                  Use your admin credentials. If you need access, contact the site owner.
                </p>
              </div>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}


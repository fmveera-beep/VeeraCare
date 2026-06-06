import type { ReactNode } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { cn } from "@/lib/utils";
import { AdminLogoutButton } from "@/components/admin/AdminLogoutButton";
import { AdminSidebarNav } from "@/components/admin/AdminSidebarNav";
import { getCmsSession } from "@/lib/neon-auth/requireCmsPage";
import { tryGetNeonAuth } from "@/lib/neon-auth/server";

export const dynamic = "force-dynamic";

export default async function AdminDashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const auth = tryGetNeonAuth();
  if (!auth) redirect("/admin/login?error=auth_config");

  const session = await getCmsSession();

  if (!session) redirect("/admin/login");

  const roleLabel = session.role === "admin" ? "Admin" : "HR (view only)";

  return (
    <div className="relative min-h-screen overflow-hidden bg-neutral-950 text-neutral-100">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-44 right-[-140px] h-[560px] w-[560px] rounded-full bg-brand/20 blur-[130px]" />
        <div className="absolute -bottom-52 left-[-160px] h-[620px] w-[620px] rounded-full bg-indigo-500/12 blur-[150px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.05),transparent_60%)]" />
        <div className="absolute inset-0 opacity-[0.06] [background-image:linear-gradient(to_right,rgba(255,255,255,0.12)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.12)_1px,transparent_1px)] [background-size:72px_72px]" />
      </div>

      <div className="relative mx-auto flex min-h-screen max-w-[1480px]">
        <aside className="hidden w-80 shrink-0 border-r border-white/10 bg-neutral-950/50 p-6 backdrop-blur md:flex md:flex-col">
          <Link
            href="/admin/dashboard"
            className="group block rounded-2xl border border-white/10 bg-white/5 px-4 py-4 transition hover:bg-white/7"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-neutral-400">
              VeeraFM
            </p>
            <p className="mt-1 text-lg font-bold tracking-tight text-white">
              CMS Dashboard
            </p>
            <p className="mt-1 text-xs text-neutral-300">
              Neon Auth • {roleLabel}
            </p>
          </Link>

          <div className="mt-5">
            <AdminSidebarNav role={session.role} />
          </div>

          <div className="mt-auto pt-6">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-400">
                Session
              </p>
              <p className="mt-1 truncate text-sm text-neutral-200">{session.email}</p>
              <p className="mt-1 text-xs text-neutral-400">{roleLabel}</p>
            </div>
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header
            className={cn(
              "sticky top-0 z-30 border-b border-white/10 bg-neutral-950/70 backdrop-blur-xl",
              "supports-[backdrop-filter]:bg-neutral-950/50"
            )}
          >
            <div className="flex items-center justify-between gap-3 px-5 py-4 md:px-10">
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-neutral-400 md:hidden">
                  VeeraFM CMS
                </p>
                <p className="truncate text-sm font-semibold text-neutral-200">
                  {session.role === "admin"
                    ? "Manage content without touching code"
                    : "Careers portal — jobs & applications"}
                </p>
                <p className="mt-0.5 hidden text-xs text-neutral-400 md:block">
                  {roleLabel} • {session.email}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <AdminLogoutButton />
              </div>
            </div>
          </header>

          <main className="min-w-0 flex-1 px-5 py-6 md:px-10 md:py-9">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}

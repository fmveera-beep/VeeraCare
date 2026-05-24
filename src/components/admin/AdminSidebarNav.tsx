"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/admin/dashboard", label: "Dashboard Home" },
  { href: "/admin/dashboard/leads", label: "Leads" },
  { href: "/admin/dashboard/services", label: "Manage Services" },
  { href: "/admin/dashboard/industries", label: "Manage Industries" },
  { href: "/admin/dashboard/settings", label: "Settings" },
] as const;

export function AdminSidebarNav() {
  const pathname = usePathname();

  return (
    <nav className="space-y-1.5">
      {nav.map((item) => {
        const active =
          item.href === "/admin/dashboard"
            ? pathname === item.href
            : pathname.startsWith(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "relative flex items-center justify-between rounded-2xl border border-transparent px-3.5 py-3 text-sm font-semibold transition",
              "text-neutral-200 hover:bg-white/5 hover:text-white",
              active && "border-white/10 bg-white/5 text-white"
            )}
          >
            <span
              className={cn(
                "absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full bg-transparent",
                active && "bg-brand"
              )}
            />
            <span>{item.label}</span>
            <span
              className={cn(
                "h-2 w-2 rounded-full bg-transparent ring-1 ring-white/10",
                active && "bg-brand ring-brand/40"
              )}
            />
          </Link>
        );
      })}
    </nav>
  );
}


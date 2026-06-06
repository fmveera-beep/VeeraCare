import Link from "next/link";
import { getCmsSession } from "@/lib/neon-auth/requireCmsPage";
import { dashboardCardsForRole, roleDescription } from "@/lib/neon-auth/cmsRoles";

export default async function AdminDashboardHomePage() {
  const session = await getCmsSession();
  const role = session?.role ?? "admin";
  const cards = dashboardCardsForRole(role);

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-neutral-400">
          Dashboard Home
        </p>
        <h1 className="mt-2 text-2xl font-bold tracking-tight">
          Welcome to VeeraFM CMS
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-neutral-300">
          {role === "admin"
            ? "Use the sidebar to review form leads and manage Services and Industries. Content is saved to your database and reflected on the public site."
            : roleDescription(role)}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="rounded-2xl border border-white/10 bg-neutral-900/40 p-6 transition hover:bg-neutral-900/60"
          >
            <h2 className="text-lg font-bold tracking-tight">{card.title}</h2>
            <p className="mt-2 text-sm text-neutral-300">{card.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

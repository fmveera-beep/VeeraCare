import Link from "next/link";

export default function AdminDashboardHomePage() {
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
          Use the sidebar to review form leads and manage Services and Industries.
          Content is saved to your database and reflected on the public site.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Link
          href="/admin/dashboard/leads"
          className="rounded-2xl border border-white/10 bg-neutral-900/40 p-6 transition hover:bg-neutral-900/60"
        >
          <h2 className="text-lg font-bold tracking-tight">Leads</h2>
          <p className="mt-2 text-sm text-neutral-300">
            View hiring and worker inquiries from the contact form.
          </p>
        </Link>

        <Link
          href="/admin/dashboard/services"
          className="rounded-2xl border border-white/10 bg-neutral-900/40 p-6 transition hover:bg-neutral-900/60"
        >
          <h2 className="text-lg font-bold tracking-tight">Manage Services</h2>
          <p className="mt-2 text-sm text-neutral-300">
            Add, edit, or remove service cards shown on the website.
          </p>
        </Link>

        <Link
          href="/admin/dashboard/industries"
          className="rounded-2xl border border-white/10 bg-neutral-900/40 p-6 transition hover:bg-neutral-900/60"
        >
          <h2 className="text-lg font-bold tracking-tight">Manage Industries</h2>
          <p className="mt-2 text-sm text-neutral-300">
            Update industry categories used across the homepage.
          </p>
        </Link>

        <Link
          href="/admin/dashboard/insights"
          className="rounded-2xl border border-white/10 bg-neutral-900/40 p-6 transition hover:bg-neutral-900/60"
        >
          <h2 className="text-lg font-bold tracking-tight">Manage Insights</h2>
          <p className="mt-2 text-sm text-neutral-300">
            Publish and edit blog articles on /insights and the homepage preview.
          </p>
        </Link>

        <Link
          href="/admin/dashboard/jobs"
          className="rounded-2xl border border-white/10 bg-neutral-900/40 p-6 transition hover:bg-neutral-900/60"
        >
          <h2 className="text-lg font-bold tracking-tight">Manage Jobs</h2>
          <p className="mt-2 text-sm text-neutral-300">
            Add and publish job openings on the /careers portal.
          </p>
        </Link>
      </div>
    </div>
  );
}


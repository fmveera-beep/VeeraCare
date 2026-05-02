import Link from "next/link";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-peach/40">
      <header className="border-b border-neutral-200 bg-white">
        <div className="mx-auto flex h-16 max-w-lg items-center justify-between px-4">
          <Link
            href="/"
            className="text-sm font-bold uppercase tracking-[0.2em] text-black transition-colors hover:text-brand"
          >
            VeeraCare
          </Link>
          <Link href="/" className="text-sm font-medium text-neutral-600 hover:text-brand">
            Back to site
          </Link>
        </div>
      </header>
      <main className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-lg flex-col justify-center px-4 py-12">
        {children}
      </main>
    </div>
  );
}

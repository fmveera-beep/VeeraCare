import { Suspense } from "react";
import { listAllowedLoginEmails } from "@/lib/cms/users";
import { tryGetNeonAuth } from "@/lib/neon-auth/server";
import { AdminLoginClient } from "./AdminLoginClient";

export const dynamic = "force-dynamic";

export default async function AdminLoginPage() {
  const allowedEmails = await listAllowedLoginEmails();
  const authConfigured = Boolean(tryGetNeonAuth());

  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-neutral-950 text-neutral-100" />
      }
    >
      <AdminLoginClient
        allowedEmails={allowedEmails}
        authConfigured={authConfigured}
      />
    </Suspense>
  );
}

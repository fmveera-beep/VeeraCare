import { Suspense } from "react";
import { parseAllowedLoginEmailList } from "@/lib/neon-auth/cmsRoles";
import { tryGetNeonAuth } from "@/lib/neon-auth/server";
import { AdminLoginClient } from "./AdminLoginClient";

export const dynamic = "force-dynamic";

export default function AdminLoginPage() {
  const allowedEmails = parseAllowedLoginEmailList();
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


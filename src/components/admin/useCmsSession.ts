"use client";

import { useEffect, useState } from "react";
import type { CmsRole } from "@/lib/neon-auth/cmsRoles";

type CmsMe = {
  ok: true;
  role: CmsRole;
  email: string;
  canWrite: boolean;
};

const adminFetch: RequestInit = { credentials: "include", cache: "no-store" };

export function useCmsSession() {
  const [ready, setReady] = useState(false);
  const [role, setRole] = useState<CmsRole>("admin");
  const [canWrite, setCanWrite] = useState(true);
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/me", adminFetch)
      .then(async (res) => {
        if (!res.ok) return null;
        return (await res.json()) as CmsMe;
      })
      .then((data) => {
        if (data?.ok) {
          setRole(data.role);
          setCanWrite(data.canWrite);
          setEmail(data.email);
        }
      })
      .finally(() => setReady(true));
  }, []);

  return { ready, role, canWrite, email };
}

"use client";

import { useEffect, useState } from "react";
import type { CmsRole } from "@/lib/neon-auth/cmsRoles";

type CmsMe = {
  ok: true;
  role: CmsRole;
  email: string;
  canWrite: boolean;
  canWriteJobs: boolean;
  canDeleteLeads: boolean;
};

const adminFetch: RequestInit = { credentials: "include", cache: "no-store" };

export function useCmsSession() {
  const [ready, setReady] = useState(false);
  const [role, setRole] = useState<CmsRole | null>(null);
  const [canWrite, setCanWrite] = useState(false);
  const [canWriteJobs, setCanWriteJobs] = useState(false);
  const [canDeleteLeads, setCanDeleteLeads] = useState(false);
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
          setCanWriteJobs(data.canWriteJobs);
          setCanDeleteLeads(data.canDeleteLeads);
          setEmail(data.email);
        }
      })
      .finally(() => setReady(true));
  }, []);

  return {
    ready,
    role,
    email,
    /** Full CMS admin (all sections). */
    canWrite: ready && canWrite,
    /** Admin or HR — manage jobs. */
    canWriteJobs: ready && canWriteJobs,
    /** Admin or Leads — delete lead submissions. */
    canDeleteLeads: ready && canDeleteLeads,
  };
}

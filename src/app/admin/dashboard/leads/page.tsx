import { getCmsSession } from "@/lib/neon-auth/requireCmsPage";
import { canWriteCms } from "@/lib/neon-auth/cmsRoles";
import { AdminLeadsPageClient } from "./AdminLeadsPageClient";

export default async function AdminLeadsPage() {
  const session = await getCmsSession();
  const canWrite = session ? canWriteCms(session.role) : false;

  return <AdminLeadsPageClient canWrite={canWrite} />;
}

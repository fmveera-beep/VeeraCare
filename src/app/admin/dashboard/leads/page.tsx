import { getCmsSession } from "@/lib/neon-auth/requireCmsPage";
import { canDeleteLeads } from "@/lib/neon-auth/cmsRoles";
import { AdminLeadsPageClient } from "./AdminLeadsPageClient";

export default async function AdminLeadsPage() {
  const session = await getCmsSession();
  const canDelete = session ? canDeleteLeads(session.role) : false;

  return <AdminLeadsPageClient canDelete={canDelete} />;
}

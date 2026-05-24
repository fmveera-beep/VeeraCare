import { redirect } from "next/navigation";

/** `/admin` → CMS sign-in (there is no separate page at `/admin`). */
export default function AdminIndexPage() {
  redirect("/admin/login");
}

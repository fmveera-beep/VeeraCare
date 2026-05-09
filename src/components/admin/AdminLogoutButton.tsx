"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function AdminLogoutButton() {
  const router = useRouter();

  return (
    <Button
      type="button"
      variant="outline"
      className="rounded-2xl border-white/15 bg-transparent text-neutral-100 hover:border-white/25 hover:bg-white/5 hover:text-white"
      onClick={() => {
        fetch("/api/admin/logout", {
          method: "POST",
          credentials: "include",
        })
          .catch(() => {})
          .finally(() => {
            router.replace("/admin/login");
          });
      }}
    >
      Logout
    </Button>
  );
}


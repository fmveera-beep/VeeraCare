import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { tryGetNeonAuth } from "@/lib/neon-auth/server";

const neonAuth = tryGetNeonAuth();
const dashboardGuard =
  neonAuth?.middleware({ loginUrl: "/admin/login" }) ?? null;

export default function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (!pathname.startsWith("/admin/dashboard")) {
    return NextResponse.next();
  }

  if (!dashboardGuard) {
    const url = req.nextUrl.clone();
    url.pathname = "/admin/login";
    url.searchParams.set("error", "auth_config");
    return NextResponse.redirect(url);
  }

  return dashboardGuard(req);
}

export const config = {
  matcher: ["/admin/dashboard/:path*"],
};

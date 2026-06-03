import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { tryGetNeonAuth } from "@/lib/neon-auth/server";

const CANONICAL_HOST = "www.veerafm.com";

export default function middleware(req: NextRequest) {
  const host = req.headers.get("host")?.split(":")[0]?.toLowerCase();

  if (host === "veerafm.com") {
    const target = new URL(req.nextUrl.pathname + req.nextUrl.search, `https://${CANONICAL_HOST}`);
    return NextResponse.redirect(target, 308);
  }

  const { pathname } = req.nextUrl;

  if (!pathname.startsWith("/admin/dashboard")) {
    return NextResponse.next();
  }

  const neonAuth = tryGetNeonAuth();
  const dashboardGuard =
    neonAuth?.middleware({ loginUrl: "/admin/login" }) ?? null;

  if (!dashboardGuard) {
    const url = req.nextUrl.clone();
    url.pathname = "/admin/login";
    url.searchParams.set("error", "auth_config");
    return NextResponse.redirect(url);
  }

  return dashboardGuard(req);
}

export const config = {
  matcher: [
    "/admin/dashboard/:path*",
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|html|txt|xml)$).*)",
  ],
};

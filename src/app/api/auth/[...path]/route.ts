import type { NextRequest } from "next/server";
import { getNeonAuthOrThrow } from "@/lib/neon-auth/server";

export const dynamic = "force-dynamic";

type RouteContext = { params: Promise<{ path: string[] }> | { path: string[] } };

async function run(
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH",
  request: NextRequest,
  context: RouteContext
) {
  const handlers = getNeonAuthOrThrow().handler();
  const handlerFn = handlers[method] as (
    req: NextRequest,
    ctx: RouteContext
  ) => Promise<Response>;
  return handlerFn(request, context);
}

export function GET(request: NextRequest, context: RouteContext) {
  return run("GET", request, context);
}

export function POST(request: NextRequest, context: RouteContext) {
  return run("POST", request, context);
}

export function PUT(request: NextRequest, context: RouteContext) {
  return run("PUT", request, context);
}

export function DELETE(request: NextRequest, context: RouteContext) {
  return run("DELETE", request, context);
}

export function PATCH(request: NextRequest, context: RouteContext) {
  return run("PATCH", request, context);
}

import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { AUTH_COOKIE_NAME, verifyAuthToken } from "@/lib/auth/jwt";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const token = cookies().get(AUTH_COOKIE_NAME)?.value;
    if (!token) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    let payload: { sub: string };
    try {
      payload = await verifyAuthToken(token);
    } catch {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    if (!payload.sub) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.sub },
      select: { id: true, email: true, name: true, role: true },
    });

    if (!user) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    return NextResponse.json({ user });
  } catch (err) {
    console.error("[auth/me]", err);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth/password";
import { registerSchema } from "@/lib/validations/auth";

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const parsed = registerSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { name, email, password } = parsed.data;
    const normalized = email.toLowerCase();

    const existing = await prisma.user.findUnique({
      where: { email: normalized },
    });
    if (existing) {
      return NextResponse.json(
        { error: "An account with this email already exists." },
        { status: 409 }
      );
    }

    const passwordHash = await hashPassword(password);
    await prisma.user.create({
      data: {
        email: normalized,
        name: name.trim(),
        passwordHash,
        role: "CLIENT",
      },
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[auth/register]", err);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}

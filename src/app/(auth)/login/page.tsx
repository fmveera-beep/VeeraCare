"use client";

import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginInput } from "@/lib/validations/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [formError, setFormError] = useState<string | null>(null);
  const [banner, setBanner] = useState<string | null>(null);

  useEffect(() => {
    if (searchParams.get("registered") === "1") {
      setBanner("Account created. Log in with your email and password.");
    }
  }, [searchParams]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  async function onSubmit(data: LoginInput) {
    setFormError(null);
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
      credentials: "include",
    });

    const payload = await res.json().catch(() => ({}));

    if (!res.ok) {
      setFormError(
        typeof payload.error === "string" ? payload.error : "Could not log in."
      );
      return;
    }

    router.push("/");
    router.refresh();
  }

  return (
    <div className="w-full max-w-md">
      <h1 className="text-2xl font-bold uppercase tracking-tight text-black md:text-3xl">
        Log in
      </h1>
      <p className="mt-2 text-sm text-neutral-600">
        Use the email and password you registered with. New here?{" "}
        <Link href="/signup" className="font-semibold text-brand hover:underline">
          Sign up
        </Link>
      </p>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mt-8 space-y-5 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm md:p-8"
        noValidate
      >
        {banner ? (
          <p className="rounded-[4px] border border-brand/30 bg-peach px-3 py-2 text-sm text-neutral-900">
            {banner}
          </p>
        ) : null}
        {formError ? (
          <p className="rounded-[4px] border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
            {formError}
          </p>
        ) : null}

        <div className="space-y-2">
          <label
            htmlFor="email"
            className="text-xs font-semibold uppercase tracking-wide text-neutral-700"
          >
            Email
          </label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            aria-invalid={errors.email ? "true" : "false"}
            {...register("email")}
          />
          {errors.email ? (
            <p className="text-sm text-red-600">{errors.email.message}</p>
          ) : null}
        </div>

        <div className="space-y-2">
          <label
            htmlFor="password"
            className="text-xs font-semibold uppercase tracking-wide text-neutral-700"
          >
            Password
          </label>
          <Input
            id="password"
            type="password"
            autoComplete="current-password"
            aria-invalid={errors.password ? "true" : "false"}
            {...register("password")}
          />
          {errors.password ? (
            <p className="text-sm text-red-600">{errors.password.message}</p>
          ) : null}
        </div>

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Signing in…" : "Log in"}
        </Button>
      </form>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="text-sm text-neutral-600">Loading…</div>}>
      <LoginForm />
    </Suspense>
  );
}

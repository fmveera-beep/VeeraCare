"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, type RegisterInput } from "@/lib/validations/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function SignupPage() {
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", email: "", password: "" },
  });

  async function onSubmit(data: RegisterInput) {
    setFormError(null);
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const payload = await res.json().catch(() => ({}));
    if (!res.ok) {
      setFormError(
        typeof payload.error === "string" ? payload.error : "Could not create account."
      );
      return;
    }
    router.push("/login?registered=1");
    router.refresh();
  }

  return (
    <div className="w-full max-w-md">
      <h1 className="text-2xl font-bold uppercase tracking-tight text-black md:text-3xl">
        Create an account
      </h1>
      <p className="mt-2 text-sm text-neutral-600">
        Already registered?{" "}
        <Link href="/login" className="font-semibold text-brand hover:underline">
          Log in
        </Link>
      </p>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mt-8 space-y-5 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm md:p-8"
        noValidate
      >
        {formError ? (
          <p className="rounded-[4px] border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
            {formError}
          </p>
        ) : null}

        <div className="space-y-2">
          <label
            htmlFor="name"
            className="text-xs font-semibold uppercase tracking-wide text-neutral-700"
          >
            Name
          </label>
          <Input
            id="name"
            autoComplete="name"
            aria-invalid={errors.name ? "true" : "false"}
            {...register("name")}
          />
          {errors.name ? (
            <p className="text-sm text-red-600">{errors.name.message}</p>
          ) : null}
        </div>

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
            autoComplete="new-password"
            aria-invalid={errors.password ? "true" : "false"}
            {...register("password")}
          />
          {errors.password ? (
            <p className="text-sm text-red-600">{errors.password.message}</p>
          ) : null}
        </div>

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Creating account…" : "Sign up"}
        </Button>
      </form>
    </div>
  );
}

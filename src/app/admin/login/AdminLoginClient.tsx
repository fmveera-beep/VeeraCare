"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { VeeraLogo } from "@/components/brand/VeeraLogo";
import type { AdminMeReason } from "@/lib/neon-auth/adminMeReason";
import { neonAuthClient } from "@/lib/neon-auth/client";
import { describeEmailOtpSendFailure } from "@/lib/neon-auth/otpClientHelpers";

type Step = "email" | "otp";

type AdminLoginClientProps = {
  allowedEmails: string[];
  authConfigured: boolean;
};

export function AdminLoginClient({
  allowedEmails,
  authConfigured,
}: AdminLoginClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = searchParams.get("next") || "/admin/dashboard";

  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);

  useEffect(() => {
    if (!authConfigured) {
      setError(
        "Neon Auth is not configured on the server. Set NEON_AUTH_BASE_URL and NEON_AUTH_COOKIE_SECRET (32+ characters) in .env, then restart npm run dev."
      );
      return;
    }
    const code = searchParams.get("error");
    if (code === "auth_config") {
      setError(
        "Neon Auth is not configured on the server (missing NEON_AUTH_BASE_URL / NEON_AUTH_COOKIE_SECRET)."
      );
    } else if (code === "forbidden") {
      setError(
        `That account is not allowed to access the CMS. Use: ${allowedEmails.join(", ")}`
      );
    }
  }, [searchParams, authConfigured, allowedEmails]);

  const normalizedEmail = useMemo(
    () => email.trim().toLowerCase(),
    [email]
  );

  const canSendCode = useMemo(
    () =>
      authConfigured &&
      normalizedEmail.length > 3 &&
      normalizedEmail.includes("@") &&
      !isSubmitting,
    [authConfigured, normalizedEmail, isSubmitting]
  );

  const canVerify = useMemo(
    () =>
      otp.replace(/\s+/g, "").length >= 6 &&
      normalizedEmail.length > 0 &&
      !isSubmitting,
    [otp, normalizedEmail, isSubmitting]
  );

  async function onSendCode(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (
      allowedEmails.length > 0 &&
      !allowedEmails.includes(normalizedEmail)
    ) {
      setError(
        `Use one of the CMS admin emails: ${allowedEmails.join(", ")}`
      );
      return;
    }

    setIsSubmitting(true);
    try {
      const sendRes = await neonAuthClient.emailOtp.sendVerificationOtp({
        email: normalizedEmail,
        type: "sign-in",
      });

      const failMsg = describeEmailOtpSendFailure(sendRes);
      if (failMsg || sendRes.error) {
        setIsSubmitting(false);
        setError(
          failMsg ??
            sendRes.error?.message ??
            "Could not send verification code."
        );
        return;
      }

      setStep("otp");
      setOtp("");
      setIsSubmitting(false);
    } catch (e) {
      console.error("[admin login] send OTP", e);
      setIsSubmitting(false);
      setError(
        e instanceof Error ? e.message : "Could not send verification code."
      );
    }
  }

  async function onVerify(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const { error: signErr } = await neonAuthClient.signIn.emailOtp({
        email: normalizedEmail,
        otp: otp.replace(/\s+/g, ""),
      });

      if (signErr) {
        setIsSubmitting(false);
        setError(signErr.message ?? "Invalid or expired code.");
        return;
      }

      await neonAuthClient.getSession().catch(() => {});

      let me: Response | undefined;
      for (let attempt = 0; attempt < 8; attempt++) {
        me = await fetch("/api/admin/me", {
          credentials: "include",
          cache: "no-store",
        });
        if (me.ok) break;

        if (me.status === 403) break;

        await new Promise((r) => setTimeout(r, 80 + attempt * 60));
      }

      if (!me!.ok) {
        await neonAuthClient.signOut().catch(() => {});
        setIsSubmitting(false);

        const body = (await me!.json().catch(() => ({}))) as {
          reason?: AdminMeReason;
        };

        const msg =
          body.reason === "not_allowlisted"
            ? "Your Neon account signed in, but this email is not in the CMS allowlist. Edit SOURCE_ADMIN_EMAILS in adminEmails.ts (and optionally ADMIN_EMAIL in .env), using the exact address Neon shows for your user."
            : body.reason === "auth_config"
              ? "Neon Auth is not configured on the server."
              : body.reason === "no_session" || me!.status === 401
                ? "Sign-in succeeded but the session was not visible yet. Refresh the page and try logging in once more, or wait a moment and submit the code again."
                : "Could not verify CMS access after sign-in. Try again.";

        setError(msg);
        setStep("email");
        setOtp("");
        return;
      }

      setIsSubmitting(false);
      router.replace(nextPath);
      router.refresh();
    } catch {
      setIsSubmitting(false);
      setError("Verification failed. Try again.");
    }
  }

  async function onResend() {
    if (isResending || !normalizedEmail) return;
    setError(null);
    setIsResending(true);
    try {
      const sendRes = await neonAuthClient.emailOtp.sendVerificationOtp({
        email: normalizedEmail,
        type: "sign-in",
      });
      const failMsg = describeEmailOtpSendFailure(sendRes);
      if (failMsg || sendRes.error) {
        setError(
          failMsg ?? sendRes.error?.message ?? "Could not resend code."
        );
      }
    } catch (e) {
      console.error("[admin login] resend OTP", e);
      setError(e instanceof Error ? e.message : "Could not resend code.");
    } finally {
      setIsResending(false);
    }
  }

  function onUseDifferentEmail() {
    setStep("email");
    setOtp("");
    setError(null);
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-neutral-950 text-neutral-100">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 left-1/2 h-[560px] w-[560px] -translate-x-1/2 rounded-full bg-brand/25 blur-[120px]" />
        <div className="absolute -bottom-48 -left-28 h-[520px] w-[520px] rounded-full bg-indigo-500/15 blur-[130px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.06),transparent_55%)]" />
        <div className="absolute inset-0 opacity-[0.07] [background-image:linear-gradient(to_right,rgba(255,255,255,0.12)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.12)_1px,transparent_1px)] [background-size:56px_56px]" />
      </div>

      <div className="relative mx-auto flex min-h-screen max-w-md items-center px-6 py-14">
        <div className="w-full overflow-hidden rounded-3xl border border-white/10 bg-neutral-900/40 p-6 shadow-2xl shadow-black/50 backdrop-blur-xl md:p-8">
          <div className="mb-5 flex justify-center sm:justify-start">
            <VeeraLogo variant="compact" className="opacity-95" />
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-neutral-400">
              VeeraCare CMS
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight">
              {step === "email" ? "Admin sign-in" : "Enter login code"}
            </h1>
            <p className="mt-2 text-sm text-neutral-300">
              {step === "email"
                ? "Managed Neon Auth: we email you a one-time code each time you sign in."
                : `Check ${normalizedEmail} for your verification code.`}
            </p>
          </div>

          {step === "email" ? (
            <form onSubmit={onSendCode} className="mt-7 space-y-4">
              <label className="block">
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-400">
                  Email
                </span>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  autoComplete="email"
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-neutral-950/55 px-4 py-3 text-sm text-neutral-100 outline-none ring-0 transition focus:border-white/20 focus:bg-neutral-950/80"
                  placeholder={
                    allowedEmails[0]
                      ? allowedEmails.join(", ")
                      : "admin@your-domain.com"
                  }
                  required
                />
              </label>

              {error ? (
                <div className="rounded-2xl border border-red-500/25 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                  {error}
                </div>
              ) : null}

              <button
                type="submit"
                disabled={!canSendCode}
                className="inline-flex w-full items-center justify-center rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-neutral-950 shadow-lg shadow-black/30 transition hover:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? "Sending code…" : "Email me a code"}
              </button>
            </form>
          ) : (
            <form onSubmit={onVerify} className="mt-7 space-y-4">
              <label className="block">
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-400">
                  Verification code
                </span>
                <input
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-neutral-950/55 px-4 py-3 text-center font-mono text-lg tracking-[0.35em] text-neutral-100 outline-none ring-0 transition focus:border-white/20 focus:bg-neutral-950/80"
                  placeholder="000000"
                  maxLength={16}
                  required
                />
              </label>

              {error ? (
                <div className="rounded-2xl border border-red-500/25 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                  {error}
                </div>
              ) : null}

              <button
                type="submit"
                disabled={!canVerify}
                className="inline-flex w-full items-center justify-center rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-neutral-950 shadow-lg shadow-black/30 transition hover:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? "Signing in…" : "Verify & continue"}
              </button>

              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <button
                  type="button"
                  onClick={onResend}
                  disabled={isResending}
                  className="text-sm font-medium text-neutral-300 underline-offset-4 hover:text-white hover:underline disabled:opacity-50"
                >
                  {isResending ? "Sending…" : "Resend code"}
                </button>
                <button
                  type="button"
                  onClick={onUseDifferentEmail}
                  className="text-sm font-medium text-neutral-400 underline-offset-4 hover:text-neutral-200 hover:underline"
                >
                  Use a different email
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}

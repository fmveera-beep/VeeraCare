"use client";

import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { JobPost } from "@/lib/jobs/posts";
import {
  RecaptchaCheckbox,
  type RecaptchaCheckboxRef,
} from "@/components/recaptcha/RecaptchaCheckbox";
import { recaptchaEnabled } from "@/lib/recaptcha/config";

type JobApplyModalProps = {
  job: JobPost;
  open: boolean;
  onClose: () => void;
};

const fieldClass =
  "mt-1.5 w-full rounded-xl border border-neutral-200 bg-white px-3 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-brand/50 focus:outline-none focus:ring-1 focus:ring-brand/40";

function BulletList({ items }: { items: string[] }) {
  if (items.length === 0) return null;
  return (
    <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-neutral-700">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

export function JobApplyModal({ job, open, onClose }: JobApplyModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const recaptchaRef = useRef<RecaptchaCheckboxRef>(null);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    if (!open) {
      setName("");
      setEmail("");
      setPhone("");
      setMessage("");
      setCvFile(null);
      setError(null);
      setSuccess(false);
      setSubmitting(false);
    }
  }, [open]);

  if (!open) return null;

  const salaryLabel = job.salaryRange
    ? job.salaryRange.includes("/")
      ? job.salaryRange
      : `${job.salaryRange}/mo`
    : null;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const recaptchaToken = recaptchaRef.current?.getToken();
    if (recaptchaEnabled && !recaptchaToken) {
      setError("Please complete the captcha.");
      return;
    }

    setSubmitting(true);

    try {
      const body = new FormData();
      body.append("jobSlug", job.slug);
      body.append("name", name.trim());
      body.append("email", email.trim());
      body.append("phone", phone.trim());
      body.append("message", message.trim());
      body.append("sourcePath", `/careers/${job.slug}`);
      if (recaptchaToken) body.append("recaptchaToken", recaptchaToken);
      if (cvFile) body.append("cv", cvFile);

      const res = await fetch("/api/job-applications", {
        method: "POST",
        body,
      });
      const data = (await res.json().catch(() => null)) as { error?: string } | null;

      if (!res.ok) {
        throw new Error(data?.error ?? "Could not submit application.");
      }

      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not submit application.");
      recaptchaRef.current?.reset();
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center p-0 sm:items-center sm:p-4">
      <button
        type="button"
        aria-label="Close application form"
        className="absolute inset-0 bg-black/45"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="job-apply-title"
        className="relative flex max-h-[min(92vh,820px)] w-full max-w-lg flex-col overflow-hidden rounded-t-2xl border border-neutral-200 bg-white shadow-2xl sm:rounded-2xl"
      >
        <div className="flex items-start justify-between gap-3 border-b border-neutral-100 px-5 py-4 sm:px-6">
          <div className="min-w-0 pr-2">
            <h2 id="job-apply-title" className="text-lg font-bold text-brand md:text-xl">
              {job.title}
            </h2>
            <p className="mt-1 text-sm font-medium text-brand/80">
              {job.location}
              {salaryLabel ? ` · ${salaryLabel}` : ""}
            </p>
          </div>
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-neutral-200 text-neutral-600 transition hover:bg-neutral-50"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-5 sm:px-6">
          {success ? (
            <div className="py-8 text-center">
              <p className="text-lg font-bold text-neutral-950">Application submitted</p>
              <p className="mt-2 text-sm text-neutral-600">
                Thank you. Our careers team will review your details and contact you soon.
              </p>
              <button
                type="button"
                onClick={onClose}
                className="mt-6 rounded-[4px] bg-brand px-6 py-3 text-[11px] font-bold uppercase tracking-[0.18em] text-white hover:bg-brand-navy"
              >
                Close
              </button>
            </div>
          ) : (
            <>
              <section>
                <h3 className="text-[11px] font-bold uppercase tracking-[0.18em] text-neutral-500">
                  Description
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-neutral-700">{job.excerpt}</p>
              </section>

              {job.requirements.length > 0 ? (
                <section className="mt-6">
                  <h3 className="text-[11px] font-bold uppercase tracking-[0.18em] text-neutral-500">
                    Requirements
                  </h3>
                  <BulletList items={job.requirements} />
                </section>
              ) : null}

              {job.benefits.length > 0 ? (
                <section className="mt-6">
                  <h3 className="text-[11px] font-bold uppercase tracking-[0.18em] text-neutral-500">
                    Benefits
                  </h3>
                  <BulletList items={job.benefits} />
                </section>
              ) : null}

              <form id="job-apply-form" className="mt-8" onSubmit={onSubmit}>
                <h3 className="text-base font-bold text-brand">Apply</h3>

                <label className="mt-4 block">
                  <span className="text-sm font-medium text-neutral-800">
                    Full name <span className="text-brand">*</span>
                  </span>
                  <input
                    required
                    className={fieldClass}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </label>

                <label className="mt-4 block">
                  <span className="text-sm font-medium text-neutral-800">
                    Email <span className="text-brand">*</span>
                  </span>
                  <input
                    required
                    type="email"
                    className={fieldClass}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </label>

                <label className="mt-4 block">
                  <span className="text-sm font-medium text-neutral-800">
                    Phone <span className="text-brand">*</span>
                  </span>
                  <input
                    required
                    type="tel"
                    className={fieldClass}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </label>

                <label className="mt-4 block">
                  <span className="text-sm font-medium text-neutral-800">
                    Short message <span className="text-neutral-400">(optional)</span>
                  </span>
                  <textarea
                    rows={4}
                    className={cn(fieldClass, "resize-y")}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                </label>

                <div className="mt-4">
                  <span className="text-sm font-medium text-neutral-800">
                    CV attachment <span className="text-neutral-400">(optional)</span>
                  </span>
                  <div className="mt-2 rounded-xl border border-dashed border-brand/25 bg-brand-tint/40 px-4 py-4">
                    <div className="flex flex-wrap items-center gap-3">
                      <label className="inline-flex cursor-pointer items-center justify-center rounded-lg border border-brand/30 bg-white px-3 py-2 text-xs font-semibold text-brand transition hover:bg-brand/5">
                        Upload CV
                        <input
                          type="file"
                          accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                          className="sr-only"
                          onChange={(e) => setCvFile(e.target.files?.[0] ?? null)}
                        />
                      </label>
                      <span className="text-xs text-neutral-500">
                        PDF, DOC, DOCX (max 5 MB)
                      </span>
                    </div>
                    {cvFile ? (
                      <p className="mt-2 text-xs font-medium text-neutral-700">{cvFile.name}</p>
                    ) : null}
                  </div>
                </div>

                <RecaptchaCheckbox ref={recaptchaRef} className="mt-4 flex justify-center" />

                {error ? (
                  <p className="mt-4 text-sm text-red-600" role="alert">
                    {error}
                  </p>
                ) : null}
              </form>
            </>
          )}
        </div>

        {!success ? (
          <div className="flex gap-3 border-t border-neutral-100 px-5 py-4 sm:px-6">
            <button
              type="submit"
              form="job-apply-form"
              disabled={submitting}
              className="flex-1 rounded-[4px] bg-brand px-4 py-3 text-[11px] font-bold uppercase tracking-[0.18em] text-white transition hover:bg-brand-navy disabled:opacity-60"
            >
              {submitting ? "Submitting…" : "Submit"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded-[4px] border border-neutral-200 bg-white px-4 py-3 text-[11px] font-bold uppercase tracking-[0.18em] text-neutral-700 transition hover:bg-neutral-50"
            >
              Close
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}

"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Reveal } from "@/components/motion/Reveal";
import { RemoteImage } from "@/components/media/RemoteImage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  serviceNeededOptions,
  type CTARequestInput,
} from "@/lib/validations/cta";

type CTAFormProps = {
  className?: string;
  title?: string;
  subtitle?: string;
  imageSrc?: string;
  imageAlt?: string;
  id?: string;
};

const ease = [0.22, 1, 0.36, 1] as const;

function FieldLabel({
  children,
  htmlFor,
}: {
  children: React.ReactNode;
  htmlFor: string;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="text-[11px] font-bold uppercase tracking-[0.18em] text-neutral-800"
    >
      {children}
    </label>
  );
}

const controlBase =
  "h-11 w-full rounded-[4px] border border-neutral-300 bg-white px-3 text-sm text-neutral-950 ring-offset-white placeholder:text-neutral-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2";

export function CTAForm({
  className,
  id = "contact",
  title = "Contact VeeraCare",
  subtitle = "Need dependable staff—or are you a worker looking for work with us? Choose who you are below and fill in your details. We’ll route your inquiry to the right team.",
  imageSrc = "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1400&q=82",
  imageAlt = "VeeraCare staffing coordination and teamwork",
}: CTAFormProps) {
  const initial = useMemo<CTARequestInput>(
    () => ({
      inquiryType: "HIRING",
      name: "",
      phone: "",
      email: "",
      serviceNeeded: "Housemaid",
      availability: "",
      message: "",
    }),
    []
  );

  const [data, setData] = useState<CTARequestInput>(initial);
  const [status, setStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const hiring = data.inquiryType === "HIRING";

  async function submit() {
    setStatus("submitting");
    setErrorMsg(null);
    try {
      const res = await fetch("/api/cta-request", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const json = (await res.json().catch(() => null)) as
          | { error?: string }
          | null;
        throw new Error(json?.error || "Please check the form and try again.");
      }
      setStatus("success");
      setData(initial);
    } catch (e) {
      setStatus("error");
      setErrorMsg(e instanceof Error ? e.message : "Something went wrong.");
    }
  }

  return (
    <section
      id={id}
      className={cn(
        "relative z-[3] scroll-mt-24 bg-white md:scroll-mt-28",
        className
      )}
    >
      <div className="mx-auto max-w-[1320px] px-4 py-14 md:px-8 md:py-20">
        <Reveal blur>
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-[clamp(1.75rem,4vw,2.6rem)] font-bold uppercase leading-[1.08] tracking-tight text-neutral-950">
              {title}
            </h2>
            <p className="mt-4 text-base leading-relaxed text-neutral-700 md:text-lg">
              {subtitle}
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.06} y={24}>
          <div className="mt-10 overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-2xl shadow-brand/10 md:mt-14">
            <div className="grid md:grid-cols-[1.05fr_1fr]">
              <div className="relative min-h-[260px] md:min-h-[520px]">
                <RemoteImage
                  src={imageSrc}
                  alt={imageAlt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 55vw"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-black/60 via-black/15 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                  <div className="max-w-md rounded-2xl border border-white/15 bg-white/10 p-5 text-white backdrop-blur-md">
                    <p className="text-sm font-semibold uppercase tracking-[0.18em] text-white/85">
                      Employers &amp; workers welcome
                    </p>
                    <p className="mt-2 text-base leading-relaxed text-white/90">
                      Facilities and homes rely on us for managed staffing. Workers rely on us for
                      fair placements and steady roles—tell us which side you&apos;re on in the form.
                    </p>
                  </div>
                </div>
              </div>

              <form
                className="p-6 md:p-8"
                onSubmit={(e) => {
                  e.preventDefault();
                  void submit();
                }}
              >
                <div className="grid gap-5">
                  <div className="space-y-3">
                    <FieldLabel htmlFor="cta-inquiry-type">You are</FieldLabel>
                    <p className="text-xs leading-relaxed text-neutral-600">
                      So we ask for the right details: hiring managed staff, or looking for work with
                      VeeraCare.
                    </p>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <button
                        type="button"
                        onClick={() =>
                          setData((d) => ({
                            ...d,
                            inquiryType: "HIRING",
                            availability: "",
                          }))
                        }
                        className={cn(
                          "rounded-2xl border-2 px-4 py-4 text-left transition-all duration-200",
                          hiring
                            ? "border-brand bg-brand/[0.06] shadow-md shadow-brand/15"
                            : "border-neutral-200 hover:border-brand/40"
                        )}
                      >
                        <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-neutral-900">
                          I need staff
                        </span>
                        <span className="mt-2 block text-sm leading-snug text-neutral-600">
                          Request house, facility, event, or site coverage.
                        </span>
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setData((d) => ({
                            ...d,
                            inquiryType: "WORKER",
                          }))
                        }
                        className={cn(
                          "rounded-2xl border-2 px-4 py-4 text-left transition-all duration-200",
                          !hiring
                            ? "border-brand bg-brand/[0.06] shadow-md shadow-brand/15"
                            : "border-neutral-200 hover:border-brand/40"
                        )}
                      >
                        <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-neutral-900">
                          I&apos;m a worker
                        </span>
                        <span className="mt-2 block text-sm leading-snug text-neutral-600">
                          Share your trade and when you&apos;re available—we&apos;ll follow up.
                        </span>
                      </button>
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <FieldLabel htmlFor="cta-name">Full name</FieldLabel>
                    <Input
                      id="cta-name"
                      value={data.name}
                      onChange={(e) =>
                        setData((d) => ({ ...d, name: e.target.value }))
                      }
                      placeholder={hiring ? "Contact or hiring manager name" : "Your name"}
                      autoComplete="name"
                      required
                    />
                  </div>

                  <div className="grid gap-2 md:grid-cols-2">
                    <div className="grid gap-2">
                      <FieldLabel htmlFor="cta-phone">Phone</FieldLabel>
                      <Input
                        id="cta-phone"
                        value={data.phone}
                        onChange={(e) =>
                          setData((d) => ({ ...d, phone: e.target.value }))
                        }
                        placeholder="+91 9XXXXXXXXX"
                        autoComplete="tel"
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <FieldLabel htmlFor="cta-email">Email</FieldLabel>
                      <Input
                        id="cta-email"
                        type="email"
                        value={data.email}
                        onChange={(e) =>
                          setData((d) => ({ ...d, email: e.target.value }))
                        }
                        placeholder={hiring ? "work@company.com" : "you@email.com"}
                        autoComplete="email"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <FieldLabel htmlFor="cta-service">
                      {hiring ? "Service / role needed" : "Role you’re interested in"}
                    </FieldLabel>
                    <select
                      id="cta-service"
                      className={cn(controlBase, "pr-9")}
                      value={data.serviceNeeded}
                      onChange={(e) =>
                        setData((d) => ({
                          ...d,
                          serviceNeeded: e.target.value as CTARequestInput["serviceNeeded"],
                        }))
                      }
                    >
                      {serviceNeededOptions.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>

                  {!hiring && (
                    <div className="grid gap-2">
                      <FieldLabel htmlFor="cta-availability">Availability</FieldLabel>
                      <Input
                        id="cta-availability"
                        value={data.availability ?? ""}
                        onChange={(e) =>
                          setData((d) => ({ ...d, availability: e.target.value }))
                        }
                        placeholder="e.g. Full-time from June · Mon–Sat day shift · Hyderabad"
                        autoComplete="off"
                        required
                      />
                      <p className="text-xs text-neutral-500">
                        Days, shifts, location, or when you can start—helps us match you faster.
                      </p>
                    </div>
                  )}

                  <div className="grid gap-2">
                    <FieldLabel htmlFor="cta-message">
                      {hiring ? "Requirements & details" : "Experience & notes"}
                    </FieldLabel>
                    <textarea
                      id="cta-message"
                      className={cn(controlBase, "h-28 resize-none py-2")}
                      value={data.message}
                      onChange={(e) =>
                        setData((d) => ({ ...d, message: e.target.value }))
                      }
                      placeholder={
                        hiring
                          ? "Headcount, location, shift times, start date, and any compliance or uniform needs."
                          : "Years of experience, certifications, languages, and anything else we should know."
                      }
                      required
                    />
                  </div>

                  <div className="grid gap-3">
                    <Button
                      type="submit"
                      size="lg"
                      disabled={status === "submitting"}
                      className="h-12 w-full text-[11px] font-bold uppercase tracking-[0.2em]"
                    >
                      {status === "submitting" ? "Sending…" : "Send inquiry"}
                    </Button>

                    <motion.div
                      initial={{ opacity: 0, y: 6 }}
                      animate={{
                        opacity: status === "idle" ? 0 : 1,
                        y: status === "idle" ? 6 : 0,
                      }}
                      transition={{ duration: 0.35, ease }}
                      className="min-h-[22px] text-center text-sm"
                      aria-live="polite"
                    >
                      {status === "success" && (
                        <span className="font-semibold text-green-700">
                          Thanks — we received your inquiry and’ll be in touch shortly.
                        </span>
                      )}
                      {status === "error" && (
                        <span className="font-semibold text-red-700">
                          {errorMsg ?? "Something went wrong. Please try again."}
                        </span>
                      )}
                    </motion.div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

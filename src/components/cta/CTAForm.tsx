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
  /** Optional heading override */
  title?: string;
  /** Optional supporting text override */
  subtitle?: string;
  /** Role-relevant visual (remote URLs supported) */
  imageSrc?: string;
  imageAlt?: string;
  /** In-page anchor id for linking */
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
  id = "request-staff",
  title = "Request Reliable Staff Today",
  subtitle = "Tell us what role you need. We’ll respond quickly with vetted, managed staff options that match your facility or home.",
  imageSrc = "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1400&q=82",
  imageAlt = "VeeraCare staffing team in a professional meeting",
}: CTAFormProps) {
  const initial = useMemo<CTARequestInput>(
    () => ({
      name: "",
      phone: "",
      email: "",
      serviceNeeded: "Housemaid",
      message: "",
    }),
    []
  );

  const [data, setData] = useState<CTARequestInput>(initial);
  const [status, setStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

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
    <section id={id} className={cn("relative z-[3] bg-white", className)}>
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
                      Managed staffing for real work
                    </p>
                    <p className="mt-2 text-base leading-relaxed text-white/90">
                      We recruit, verify, and manage reliable workers—creating
                      meaningful jobs while keeping your operations covered.
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
                  <div className="grid gap-2">
                    <FieldLabel htmlFor="cta-name">Name</FieldLabel>
                    <Input
                      id="cta-name"
                      value={data.name}
                      onChange={(e) =>
                        setData((d) => ({ ...d, name: e.target.value }))
                      }
                      placeholder="Your full name"
                      autoComplete="name"
                      required
                    />
                  </div>

                  <div className="grid gap-2 md:grid-cols-2">
                    <div className="grid gap-2">
                      <FieldLabel htmlFor="cta-phone">Phone Number</FieldLabel>
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
                        placeholder="you@company.com"
                        autoComplete="email"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <FieldLabel htmlFor="cta-service">Service Needed</FieldLabel>
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

                  <div className="grid gap-2">
                    <FieldLabel htmlFor="cta-message">Message</FieldLabel>
                    <textarea
                      id="cta-message"
                      className={cn(controlBase, "h-28 resize-none py-2")}
                      value={data.message}
                      onChange={(e) =>
                        setData((d) => ({ ...d, message: e.target.value }))
                      }
                      placeholder="Share the role details, location, shift timing, and how many people you need."
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
                      {status === "submitting" ? "Sending..." : "Request Staff Now"}
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
                          Request received. We’ll reach out shortly.
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


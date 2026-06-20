import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { loadJobBySlug } from "@/lib/jobs/cms";
import { sendJobApplicationEmail } from "@/lib/email/jobApplication";
import { saveJobCv } from "@/lib/uploads/jobCv";
import { jobApplicationSchema } from "@/lib/validations/jobApplication";
import { verifyRecaptchaToken } from "@/lib/recaptcha/verify";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const recaptcha = await verifyRecaptchaToken(
      String(formData.get("recaptchaToken") ?? "") || null
    );
    if (!recaptcha.ok) {
      return NextResponse.json({ error: recaptcha.error }, { status: 400 });
    }

    const raw = {
      jobSlug: String(formData.get("jobSlug") ?? ""),
      name: String(formData.get("name") ?? ""),
      email: String(formData.get("email") ?? ""),
      phone: String(formData.get("phone") ?? ""),
      message: String(formData.get("message") ?? ""),
      sourcePath: String(formData.get("sourcePath") ?? ""),
    };

    const parsed = jobApplicationSchema.safeParse(raw);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Please check your details and try again." },
        { status: 400 }
      );
    }

    const job = await loadJobBySlug(parsed.data.jobSlug);
    if (!job) {
      return NextResponse.json({ error: "This job opening is no longer available." }, { status: 404 });
    }

    const cvFile = formData.get("cv");
    let cvUrl: string | null = null;
    let cvFileName: string | null = null;

    if (cvFile instanceof File && cvFile.size > 0) {
      const saved = await saveJobCv(cvFile);
      cvUrl = saved.url;
      cvFileName = saved.fileName;
    }

    const application = await prisma.jobApplication.create({
      data: {
        jobSlug: job.slug,
        jobTitle: job.title,
        name: parsed.data.name,
        email: parsed.data.email,
        phone: parsed.data.phone,
        message: parsed.data.message?.trim() || null,
        cvUrl,
        cvFileName,
        sourcePath: parsed.data.sourcePath?.trim() || null,
      },
    });

    const mail = await sendJobApplicationEmail({
      applicationId: application.id,
      jobTitle: job.title,
      jobSlug: job.slug,
      name: parsed.data.name,
      email: parsed.data.email,
      phone: parsed.data.phone,
      message: parsed.data.message?.trim() || null,
      cvUrl,
      cvFileName,
      sourcePath: parsed.data.sourcePath?.trim() || null,
    });

    return NextResponse.json({
      ok: true,
      id: application.id,
      emailSent: mail.status === "sent",
      confirmationSent:
        mail.status === "sent" ? mail.confirmationSent : false,
      emailSkipped: mail.status === "skipped",
      ...(mail.status === "failed" ? { emailError: mail.error } : {}),
      ...(mail.status === "sent" && !mail.confirmationSent
        ? { confirmationError: mail.confirmationError }
        : {}),
    });
  } catch (e) {
    console.error("[job-applications POST]", e);
    const msg = e instanceof Error ? e.message : "Could not submit application.";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}

import { NextResponse } from "next/server";
import { assertJobsWrite } from "@/app/api/admin/_auth";
import { saveJobImage } from "@/lib/uploads/jobImage";

export const runtime = "nodejs";

export async function POST(req: Request) {
  if (!(await assertJobsWrite())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!(file instanceof File) || file.size === 0) {
      return NextResponse.json({ error: "Choose an image file to upload." }, { status: 400 });
    }

    const url = await saveJobImage(file);
    return NextResponse.json({ url });
  } catch (e) {
    console.error("[admin/uploads/job-image]", e);
    const msg = e instanceof Error ? e.message : "Upload failed";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}

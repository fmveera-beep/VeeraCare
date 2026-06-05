import { randomBytes } from "crypto";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { put } from "@vercel/blob";

const MAX_BYTES = 5 * 1024 * 1024;

const ALLOWED_TYPES = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]);

const ALLOWED_EXT = new Set([".pdf", ".doc", ".docx"]);

function safeExt(name: string): string {
  const ext = path.extname(name).toLowerCase();
  return ALLOWED_EXT.has(ext) ? ext : "";
}

export async function saveJobCv(file: File): Promise<{ url: string; fileName: string }> {
  const ext = safeExt(file.name);
  if (!ext) {
    throw new Error("Only PDF, DOC, or DOCX files are allowed.");
  }

  if (file.type && !ALLOWED_TYPES.has(file.type) && file.type !== "application/octet-stream") {
    throw new Error("Only PDF, DOC, or DOCX files are allowed.");
  }

  if (file.size > MAX_BYTES) {
    throw new Error("CV must be 5 MB or smaller.");
  }

  const storedName = `cv-${Date.now()}-${randomBytes(4).toString("hex")}${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  const contentType =
    ext === ".pdf"
      ? "application/pdf"
      : ext === ".doc"
        ? "application/msword"
        : "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const blob = await put(`applications/${storedName}`, buffer, {
      access: "public",
      contentType,
      addRandomSuffix: false,
    });
    return { url: blob.url, fileName: file.name };
  }

  const dir = path.join(process.cwd(), "public", "uploads", "applications");
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, storedName), buffer);
  return { url: `/uploads/applications/${storedName}`, fileName: file.name };
}

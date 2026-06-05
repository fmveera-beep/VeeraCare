import { randomBytes } from "crypto";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import sharp from "sharp";
import { put } from "@vercel/blob";

const MAX_BYTES = 5 * 1024 * 1024;
const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

function buildFilename() {
  return `job-${Date.now()}-${randomBytes(4).toString("hex")}.webp`;
}

export async function saveJobImage(file: File): Promise<string> {
  if (!ALLOWED_TYPES.has(file.type)) {
    throw new Error("Only JPG, PNG, WebP, or GIF images are allowed.");
  }

  if (file.size > MAX_BYTES) {
    throw new Error("Image must be 5 MB or smaller.");
  }

  const input = Buffer.from(await file.arrayBuffer());
  const optimized = await sharp(input)
    .rotate()
    .resize({ width: 1600, withoutEnlargement: true })
    .webp({ quality: 82 })
    .toBuffer();

  const filename = buildFilename();

  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const blob = await put(`jobs/${filename}`, optimized, {
      access: "public",
      contentType: "image/webp",
      addRandomSuffix: false,
    });
    return blob.url;
  }

  const dir = path.join(process.cwd(), "public", "uploads", "jobs");
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, filename), optimized);
  return `/uploads/jobs/${filename}`;
}

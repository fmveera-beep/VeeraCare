import path from "node:path";
import sharp from "sharp";

// Remove near-black background from the primary logo (transparent PNG for nav/footer).
const inputPath = path.resolve("src/assets/veera-logo-primary.png");
const outputPath = path.resolve("src/assets/veera-logo-transparent.png");

const { data, info } = await sharp(inputPath).ensureAlpha().raw().toBuffer({
  resolveWithObject: true,
});

const transparentCutoff = 12;
const opaqueCutoff = 50;

for (let i = 0; i < data.length; i += 4) {
  const r = data[i];
  const g = data[i + 1];
  const b = data[i + 2];

  const dist = Math.max(r, g, b);

  let a;
  if (dist <= transparentCutoff) a = 0;
  else if (dist >= opaqueCutoff) a = 255;
  else
    a = Math.round(
      ((dist - transparentCutoff) / (opaqueCutoff - transparentCutoff)) * 255
    );

  data[i + 3] = a;
}

await sharp(data, {
  raw: { width: info.width, height: info.height, channels: 4 },
})
  .png()
  .toFile(outputPath);

// Keep legacy filename in sync for scripts that reference veera-logo.png
await sharp(outputPath).toFile(path.resolve("src/assets/veera-logo.png"));

console.log(`Wrote ${outputPath}`);

/**
 * Editorial photography (Unsplash). Override via NEXT_PUBLIC_* when self-hosting.
 * Empty-string env values are ignored so accidental `VAR=` in .env does not break images.
 */

import type { StaticImageData } from "next/image";
import heroMainBundled from "@/assets/hero-main.png";

function envSrc(key: string, fallback: string): string {
  const raw = process.env[key];
  if (typeof raw !== "string") return fallback;
  const trimmed = raw.trim();
  return trimmed.length > 0 ? trimmed : fallback;
}

/** Prefer env URL; otherwise bundled file (avoids /public 404 when cwd/project root differs). */
function envHeroPortrait(): string | StaticImageData {
  const raw = process.env.NEXT_PUBLIC_HERO_IMAGE_MAIN;
  if (typeof raw === "string" && raw.trim().length > 0) return raw.trim();
  return heroMainBundled;
}

export const landingImages = {
  /** Hero right — bundled under src/assets by default */
  heroPortrait: envHeroPortrait(),
  heroInset: envSrc(
    "NEXT_PUBLIC_HERO_IMAGE_INSET",
    "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=80"
  ),
  /** About grid — leadership portrait (avoid removed/forbidden Unsplash IDs) */
  aboutPortrait: envSrc(
    "NEXT_PUBLIC_ABOUT_PORTRAIT",
    "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=85"
  ),
  aboutServer: envSrc(
    "NEXT_PUBLIC_ABOUT_SERVER",
    "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=85"
  ),
  deiSticky: envSrc(
    "NEXT_PUBLIC_DEI_IMAGE",
    "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1000&q=85"
  ),
  videoThumb: envSrc(
    "NEXT_PUBLIC_VIDEO_THUMB",
    "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=900&q=85"
  ),
  careerPortrait: envSrc(
    "NEXT_PUBLIC_CAREER_IMAGE",
    "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=800&q=85"
  ),
  trustAvatars: [
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80",
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80",
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80",
  ] as const,
  /** Services grid — bottom photos */
  services: [
    "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=81",
    "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80",
  ] as const,
  reviews: [
    envSrc(
      "NEXT_PUBLIC_REVIEW_AVATAR_1",
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80"
    ),
    envSrc(
      "NEXT_PUBLIC_REVIEW_AVATAR_2",
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80"
    ),
  ] as const,
};

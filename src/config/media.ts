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
  // Default to a "field/on-site" visual unless an env override is provided.
  return heroMainBundled;
}

export const landingImages = {
  /** Hero right — bundled under src/assets by default */
  heroPortrait: envHeroPortrait(),
  heroInset: envSrc(
    "NEXT_PUBLIC_HERO_IMAGE_INSET",
    "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=800&q=80"
  ),
  /** About grid — onsite / facilities imagery */
  aboutPortrait: envSrc(
    "NEXT_PUBLIC_ABOUT_PORTRAIT",
    "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=800&q=85"
  ),
  aboutServer: envSrc(
    "NEXT_PUBLIC_ABOUT_SERVER",
    "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=800&q=85"
  ),
  deiSticky: envSrc(
    "NEXT_PUBLIC_DEI_IMAGE",
    "https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=1000&q=85"
  ),
  videoThumb: envSrc(
    "NEXT_PUBLIC_VIDEO_THUMB",
    "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=900&q=85"
  ),
  careerPortrait: envSrc(
    "NEXT_PUBLIC_CAREER_IMAGE",
    "https://images.unsplash.com/photo-1523413651479-597eb2da0ad6?auto=format&fit=crop&w=800&q=85"
  ),
  trustAvatars: [
    "/images/team/team-1.png",
    "/images/team/team-2.png",
    "/images/team/team-3.png",
  ] as const,
  /** Services grid — bottom photos */
  services: [
    "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1523413651479-597eb2da0ad6?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80",
  ] as const,
  reviews: [
    envSrc("NEXT_PUBLIC_REVIEW_AVATAR_1", "/images/team/team-1.png"),
    envSrc("NEXT_PUBLIC_REVIEW_AVATAR_2", "/images/team/team-2.png"),
    envSrc("NEXT_PUBLIC_REVIEW_AVATAR_3", "/images/team/team-3.png"),
  ] as const,
};

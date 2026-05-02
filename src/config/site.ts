/** Inbox for job applications from the site (mailto “Apply” buttons). */
export const careersEmail =
  process.env.NEXT_PUBLIC_CAREERS_EMAIL ?? "hello@veeracare.com";

export const socialUrls = {
  facebook:
    process.env.NEXT_PUBLIC_SOCIAL_FACEBOOK ?? "https://www.facebook.com/",
  instagram:
    process.env.NEXT_PUBLIC_SOCIAL_INSTAGRAM ?? "https://www.instagram.com/",
  linkedin:
    process.env.NEXT_PUBLIC_SOCIAL_LINKEDIN ?? "https://www.linkedin.com/",
  youtube:
    process.env.NEXT_PUBLIC_SOCIAL_YOUTUBE ?? "https://www.youtube.com/",
  x: process.env.NEXT_PUBLIC_SOCIAL_X ?? "https://twitter.com/",
} as const;

export const introVideoEmbedUrl =
  process.env.NEXT_PUBLIC_INTRO_VIDEO_EMBED ??
  "https://www.youtube-nocookie.com/embed/M7lc1UVf-VE";

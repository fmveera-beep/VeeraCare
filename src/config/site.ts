/** Public careers inbox (mailto links, site copy). */
export const careersEmail =
  process.env.NEXT_PUBLIC_CAREERS_EMAIL ?? "admin@veerafm.com";

/** Footer / contact — display format */
export const contactPhoneDisplay =
  process.env.NEXT_PUBLIC_CONTACT_PHONE_DISPLAY ?? "+971 55 572 2868";

/** Digits only for tel: / WhatsApp (no +, spaces, or dashes) */
export const contactPhoneE164 =
  process.env.NEXT_PUBLIC_CONTACT_PHONE_E164 ?? "971555722868";

export function whatsAppChatUrl(prefillMessage?: string) {
  const digits = contactPhoneE164.replace(/\D/g, "");
  const base = `https://wa.me/${digits}`;
  if (!prefillMessage?.trim()) return base;
  return `${base}?text=${encodeURIComponent(prefillMessage.trim())}`;
}

export const socialUrls = {
  facebook:
    process.env.NEXT_PUBLIC_SOCIAL_FACEBOOK ??
    "https://www.facebook.com/61589429788809/",
  instagram:
    process.env.NEXT_PUBLIC_SOCIAL_INSTAGRAM ??
    "https://www.instagram.com/veeracarefm/?utm_source=ig_web_button_share_sheet",
  linkedin:
    process.env.NEXT_PUBLIC_SOCIAL_LINKEDIN ??
    "https://www.linkedin.com/company/veeracarefm",
  youtube:
    process.env.NEXT_PUBLIC_SOCIAL_YOUTUBE ?? "https://www.youtube.com/",
} as const;

export const introVideoEmbedUrl =
  process.env.NEXT_PUBLIC_INTRO_VIDEO_EMBED ??
  "https://www.youtube-nocookie.com/embed/M7lc1UVf-VE";

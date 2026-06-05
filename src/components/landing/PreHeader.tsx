"use client";

import Link from "next/link";
import {
  IconFacebook,
  IconInstagram,
  IconLinkedin,
  IconYoutube,
} from "@/components/icons/SocialIcons";
import { careersEmail, socialUrls } from "@/config/site";

const social = [
  ["Facebook", IconFacebook, socialUrls.facebook],
  ["Instagram", IconInstagram, socialUrls.instagram],
  ["LinkedIn", IconLinkedin, socialUrls.linkedin],
] as const;

export function PreHeader() {
  return (
    <div className="border-b border-white/10 bg-neutral-950 text-[11px] text-white/85 sm:text-[12px]">
      <div className="mx-auto flex max-w-[1320px] flex-col gap-2 px-3 py-2 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-3 sm:px-4 sm:py-2.5 md:px-8">
        <p className="min-w-0 font-medium leading-snug tracking-wide break-words">
          <span className="text-white">Work with VeeraFM</span>
          <span className="mx-1.5 hidden text-white/35 sm:inline">·</span>
          <a
            href={`mailto:${careersEmail}`}
            className="mt-0.5 block text-white/90 underline-offset-4 transition-colors hover:text-brand hover:underline sm:mt-0 sm:inline"
          >
            {careersEmail}
          </a>
        </p>
        <div className="flex shrink-0 items-center gap-0.5 self-end sm:gap-1 sm:self-auto">
          {social.map(([label, Icon, url]) => (
            <Link
              key={label}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-9 w-9 items-center justify-center rounded-full text-white/80 transition-all duration-200 hover:scale-110 hover:bg-brand/25 hover:text-white motion-reduce:transition-colors motion-reduce:hover:scale-100"
              aria-label={label}
            >
              <Icon className="h-4 w-4" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

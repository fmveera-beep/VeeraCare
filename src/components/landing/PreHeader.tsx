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
  ["YouTube", IconYoutube, socialUrls.youtube],
] as const;

export function PreHeader() {
  return (
    <div className="border-b border-white/10 bg-neutral-950 text-[12px] text-white/85">
      <div className="mx-auto flex max-w-[1320px] flex-wrap items-center justify-between gap-3 px-4 py-2.5 md:px-8">
        <p className="font-medium tracking-wide">
          <span className="text-white">Work with VeeraFM</span>
          <span className="mx-2 text-white/35">·</span>
          <a
            href={`mailto:${careersEmail}`}
            className="text-white/90 underline-offset-4 transition-colors hover:text-brand hover:underline"
          >
            {careersEmail}
          </a>
        </p>
        <div className="flex items-center gap-1">
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

"use client";

import Link from "next/link";
import { parseSocialLinks, extractUsername } from "@/lib/link-parser";

interface SocialLinksProps {
  links: string[];
}

export default function SocialLinks({ links }: SocialLinksProps) {
  if (!links || links.length === 0) return null;

  const parsedLinks = parseSocialLinks(links);

  return (
    <div className="flex items-center gap-4">
      {/* 아이콘들 */}
      {parsedLinks.map((link, index) => {
        const Icon = link.icon;
        return (
          <Link
            key={index}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`transition-colors ${link.color}`}
            title={link.label}
          >
            <Icon className="h-5 w-5" />
          </Link>
        );
      })}

      {/* 첫 번째 링크의 사용자명 표시 (있으면) */}
      {parsedLinks[0] && extractUsername(parsedLinks[0].url, parsedLinks[0].platform) && (
        <Link
          href={parsedLinks[0].url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 hover:underline text-sm"
        >
          {extractUsername(parsedLinks[0].url, parsedLinks[0].platform)}
        </Link>
      )}
    </div>
  );
}



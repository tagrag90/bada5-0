import { type ClassValue, clsx } from "clsx";
import { formatDistanceToNowStrict, format as formatDate } from "date-fns";
import { ko } from "date-fns/locale";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatRelativeDate(from: Date) {
  const currentDate = new Date();
  if (currentDate.getTime() - from.getTime() < 24 * 60 * 60 * 1000) {
    return formatDistanceToNowStrict(from, {
      addSuffix: true,
      locale: ko,
    });
  } else {
    if (currentDate.getFullYear() === from.getFullYear()) {
      return formatDate(from, "M월 d일", { locale: ko });
    } else {
      return formatDate(from, "yyyy년 M월 d일", { locale: ko });
    }
  }
}

export function formatNumber(n: number): string {
  return Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(n);
}

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/ /g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

export function convertYouTubeLinks(content: string): string {
  if (content.includes("youtube.com/embed")) {
    return content; // 이미 임베드된 경우 그대로 반환
  }

  const youtubeRegex =
    /https?:\/\/(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/g;
  return content.replace(youtubeRegex, (match, videoId) => {
    return `<div class="youtube-embed w-full"><iframe width="100%" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>`;
  });
}

export function stripHtmlTags(html: string) {
  return html?.replace(/<[^>]*>/g, "") || "";
}

export function convertContent(content: string): string {
  // YouTube URL을 React Player로 변환
  const youtubeRegex =
    /https?:\/\/(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/g;
  return content.replace(youtubeRegex, (match, videoId) => {
    return `<div class="youtube-player" data-url="${match}"></div>`;
  });
}

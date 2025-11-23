import { type ClassValue, clsx } from "clsx";
import { formatDistanceToNowStrict, format as formatDate } from "date-fns";
import { ko } from "date-fns/locale";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatRelativeDate(from: Date | string) {
  // Date 객체가 아니면 변환
  const date = from instanceof Date ? from : new Date(from);
  
  // 유효한 Date인지 확인
  if (isNaN(date.getTime())) {
    // logger는 순환 참조 방지를 위해 직접 체크
    if (process.env.NODE_ENV === 'development') {
      console.warn("formatRelativeDate: Invalid date", from);
    }
    return "날짜 없음";
  }
  
  const currentDate = new Date();
  if (currentDate.getTime() - date.getTime() < 24 * 60 * 60 * 1000) {
    return formatDistanceToNowStrict(date, {
      addSuffix: true,
      locale: ko,
    });
  } else {
    if (currentDate.getFullYear() === date.getFullYear()) {
      return formatDate(date, "M월 d일", { locale: ko });
    } else {
      return formatDate(date, "yyyy년 M월 d일", { locale: ko });
    }
  }
}

export function formatNumber(n: number): string {
  return Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(n);
}

export function getDefaultAvatar(userId: string): string {
  // 사용자 ID를 기반으로 일관된 해시 값 생성
  const hash = userId.split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0);
    return a & a;
  }, 0);
  
  // 7개의 이미지 중 하나를 선택 (1~7)
  const imageIndex = Math.abs(hash) % 7 + 1;
  return `/avatars/default-${imageIndex}.png`;
}

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/ /g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

// 이미지 URL 최적화 함수 (Vercel Blob 지원)
export function getCompressedImageUrl(url: string, quality: number = 75, width?: number): string {
  // Vercel Blob에서는 기본적으로 원본 이미지 제공 (압축 미지원)
  // 향후 이미지 최적화가 필요하면 Next.js Image 컴포넌트 사용 권장
  if (!url.includes('blob.vercel-storage.com')) return url;

  // 현재는 원본 URL 반환 (향후 최적화 로직 추가 가능)
  return url;
}

// 파일 크기 포맷팅 함수
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// YouTube 별도 임베드 기능 제거 - 링크 미리보기로 통합
// export function convertYouTubeLinks(content: string): string {
//   if (content.includes("youtube.com/embed")) {
//     return content; // 이미 임베드된 경우 그대로 반환
//   }

//   const youtubeRegex =
//     /https?:\/\/(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/g;
//   return content.replace(youtubeRegex, (match, videoId) => {
//     return `<div class="youtube-embed w-full"><iframe width="100%" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>`;
//   });
// }

export function convertYouTubeLinks(content: string): string {
  // YouTube 링크 변환 비활성화 - 링크 미리보기로 통합됨
  return content;
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

import { Toaster } from "@/components/ui/toaster";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { extractRouterConfig } from "uploadthing/server";
import { fileRouter } from "./api/uploadthing/core";
import "./globals.css";
import ReactQueryProvider from "./ReactQueryProvider";
import { Analytics } from "@vercel/analytics/react";
import { NoticePopup } from "@/components/NoticePopup";

const pretendard = localFont({
  src: "./fonts/PretendardVariable.woff2",
  display: "swap",
  weight: "45 920",
  variable: "--font-pretendard",
});

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
});

// 랜덤 이미지 배열 정의
const ogImage = "/og-images/og-3.png";

// 이미지 선택 함수
function getOgImage() {
  return ogImage;
}

export const metadata: Metadata = {
  metadataBase: new URL("https://divetobada.com"),
  title: {
    default: "Dive to Bada",
    template: "%s | Dive to Bada",
  },
  description:
    "크리에이터와 팬을 직접 연결하는 새로운 엔터테인먼트 플랫폼. 소속사 없이도 주도권을 가지고 활동하며 팬들과 매끄럽게 소통하세요.",
  openGraph: {
    title: "Dive to Bada",
    description: "크리에이터와 팬을 직접 연결하는 엔터테인먼트 플랫폼",
    url: "https://divetobada.com",
    siteName: "Dive to Bada",
    images: [
      {
        url: ogImage,
        width: 1200,
        height: 630,
        alt: "Dive to Bada",
      },
    ],
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Dive to Bada",
    description: "크리에이터와 팬을 직접 연결하는 엔터테인먼트 플랫폼",
    images: [ogImage],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // const themeScript = `
  //   (function() {
  //     const theme = localStorage.getItem('theme-color');
  //     if (theme) {
  //       document.documentElement.style.setProperty('--background', theme);
  //     }
  //   })()
  // `;

  return (
    <html lang="ko">
      <head>
        <link rel="icon" href="/favicon.ico" />
        {/* 추가적인 메타 태그나 링크를 여기에 추가할 수 있습니다. */}
        {/* <meta charSet="UTF-8" /> */}
      </head>
      <body
        className={`${pretendard.variable} ${geistSans.variable} ${geistMono.variable}`}
      >
        {/* 테마 스크립트 비활성화 */}
        <NextSSRPlugin routerConfig={extractRouterConfig(fileRouter)} />
        <ReactQueryProvider>
          {children}
          <Toaster />
          {/* <NoticePopup title="챌린지 : 이번주 있었던 일을 7글자로 표현해보세요!✏️" /> */}
          <Analytics />
        </ReactQueryProvider>
      </body>
    </html>
  );
}

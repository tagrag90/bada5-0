import { Toaster } from "@/components/ui/toaster";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import type { Metadata, Viewport } from "next";
import { ThemeProvider } from "next-themes";
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
const ogImages = ["/og-images/og-1.png", "/og-images/og-2.png"];

// 랜덤 이미지 선택 함수
function getRandomOgImage() {
  const randomIndex = Math.floor(Math.random() * ogImages.length);
  return ogImages[randomIndex];
}

export const metadata: Metadata = {
  metadataBase: new URL("https://divetobada.com"),
  title: {
    default: "Dive to Bada",
    template: "%s | Dive to Bada",
  },
  description:
    "Bada는 크리에이터와 아티스트들이 소통하고, 협업을 통해 성장할 수 있도록 돕는 소셜미디어 커뮤니티입니다.",
  openGraph: {
    title: "Dive to Bada",
    description: "크리에이터와 아티스트들의 소셜 미디어 커뮤니티",
    url: "https://divetobada.com",
    siteName: "Dive to Bada",
    images: [
      {
        url: getRandomOgImage(),
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
    description: "크리에이터와 아티스트들의 소셜 미디어 커뮤니티",
    images: [getRandomOgImage()],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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
        <NextSSRPlugin routerConfig={extractRouterConfig(fileRouter)} />
        <ReactQueryProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <Toaster />
            <NoticePopup title="챌린지 : 이번주 있었던 일을 7글자로 표현해보세요!✏️" />
            <Analytics />
          </ThemeProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}

import { Toaster } from "@/components/ui/toaster";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { extractRouterConfig } from "uploadthing/server";
import { fileRouter } from "./api/uploadthing/core";
import "./globals.css";
import ReactQueryProvider from "./ReactQueryProvider";
import { Analytics } from "@vercel/analytics/react";

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

// 오픈그래프 이미지
const ogImage = "/og-images/og-bada.png";

export const metadata: Metadata = {
  metadataBase: new URL("https://divetobada.com"),
  title: {
    default: "Dive to Bada",
    template: "%s | Dive to Bada",
  },
  description:
    "Platform for New culture-flow between creator and fan.",
  openGraph: {
    title: "Dive to Bada",
    description: "Platform for New culture-flow between creator and fan.",
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
    description: "Platform for New culture-flow between creator and fan.",
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
          <Analytics />
        </ReactQueryProvider>
      </body>
    </html>
  );
}
